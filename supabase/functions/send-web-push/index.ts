// Supabase Edge Function: send-web-push
// Handles Database Webhooks for INSERT on public.conversations and public.checkout_leads
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";
import webPush from "npm:web-push@3.6.7";

// Timing-safe string comparison to prevent timing attacks on webhook secret
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

const MAX_PAYLOAD_BYTES = 4096; // 4KB

serve(async (req: Request) => {
  // 1. Validate HTTP Method
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Validate Content-Type
  const contentType = req.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return new Response(JSON.stringify({ error: "Unsupported media type. Expected application/json" }), {
      status: 415,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // 3. Obtain Environment Secrets
    const webhookSecret = Deno.env.get("WEBHOOK_SECRET");
    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");
    const vapidSubject = Deno.env.get("VAPID_SUBJECT") || "mailto:admin@essencialgood.com";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!webhookSecret || !vapidPublicKey || !vapidPrivateKey || !supabaseUrl || !supabaseServiceKey) {
      console.error("[WebPush Edge] Configuração de secrets incompleta.");
      return new Response(JSON.stringify({ error: "Server misconfiguration" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 4. Validate x-webhook-secret header with timing-attack resistance
    const reqSecret = req.headers.get("x-webhook-secret") || "";
    if (!timingSafeEqual(reqSecret, webhookSecret)) {
      console.warn("[WebPush Edge] Autenticação de Webhook falhou.");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 5. Read body text & Validate payload size limit (4KB)
    const rawText = await req.text();
    const encoder = new TextEncoder();
    if (encoder.encode(rawText).length > MAX_PAYLOAD_BYTES) {
      return new Response(JSON.stringify({ error: "Payload too large. Exceeds 4KB limit" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 6. Parse & Validate Database Webhook JSON Schema
    let body: any;
    try {
      body = JSON.parse(rawText);
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON format" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { type, schema, table, record } = body || {};

    if (type !== "INSERT" || schema !== "public" || !["conversations", "checkout_leads"].includes(table) || !record?.id) {
      return new Response(JSON.stringify({ error: "Invalid event payload schema" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const eventKey = `${table}:${record.id}`;
    const eventType = table === "conversations" ? "new_conversation" : "new_checkout_lead";

    // 7. Initialize Supabase Admin Client (Service Role)
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    // 8. Idempotência por Evento (push_notification_events)
    let eventRecord: any;

    const { data: existingEvents } = await supabaseAdmin
      .from("push_notification_events")
      .select("id, status, attempts, locked_at")
      .eq("event_key", eventKey)
      .maybeSingle();

    if (existingEvents) {
      if (existingEvents.status === "completed") {
        console.log(`[WebPush Edge] Evento já finalizado: ${eventKey}`);
        return new Response(JSON.stringify({ success: true, sent: 0, reason: "Event already completed" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Se estiver travado por outra invocação recente (< 60s), aguarda ou ignora
      const lockAge = Date.now() - new Date(existingEvents.locked_at).getTime();
      if (existingEvents.status === "processing" && lockAge < 60000) {
        console.log(`[WebPush Edge] Evento travado em processamento recente: ${eventKey}`);
        return new Response(JSON.stringify({ success: true, sent: 0, reason: "Event locked by concurrent process" }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Atualiza trava para esta execução
      const { data: updatedEvt } = await supabaseAdmin
        .from("push_notification_events")
        .update({
          status: "processing",
          attempts: (existingEvents.attempts || 1) + 1,
          locked_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingEvents.id)
        .select()
        .single();

      eventRecord = updatedEvt;
    } else {
      const { data: newEvt, error: insertErr } = await supabaseAdmin
        .from("push_notification_events")
        .insert([{ event_key: eventKey, event_type: eventType, record_id: record.id, status: "processing" }])
        .select()
        .single();

      if (insertErr) {
        console.error("[WebPush Edge] Falha ao registrar evento:", insertErr.message);
        return new Response(JSON.stringify({ error: "Failed to create event" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      eventRecord = newEvt;
    }

    // 9. Configure VAPID Keys para web-push
    webPush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

    // 10. Query Inscrições Ativas
    const columnFilter = table === "conversations" ? "notify_chats" : "notify_leads";

    const { data: subscriptions, error: subErr } = await supabaseAdmin
      .from("push_subscriptions")
      .select("id, user_id, endpoint, p256dh, auth_key, failed_count")
      .eq("enabled", true)
      .eq(columnFilter, true);

    if (subErr) {
      console.error("[WebPush Edge] Erro ao buscar inscrições:", subErr.message);
      return new Response(JSON.stringify({ error: "Failed to query subscriptions" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!subscriptions || subscriptions.length === 0) {
      await supabaseAdmin
        .from("push_notification_events")
        .update({ status: "completed", completed_at: new Date().toISOString(), updated_at: new Date().toISOString() })
        .eq("id", eventRecord.id);

      return new Response(JSON.stringify({ success: true, sent: 0, reason: "No active subscriptions" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 11. Montar Payload Genérico Neutro (ZERO PII / NENHUM DADO PESSOAL)
    const payloadObject = table === "conversations"
      ? {
          title: "Novo chat recebido",
          body: "Uma nova conversa foi iniciada.",
          url: "/admin/conversations",
          type: "new_conversation",
          tag: "chat-new",
        }
      : {
          title: "Novo lead do pré-checkout",
          body: "Um novo contato foi capturado.",
          url: "/admin/leads",
          type: "new_checkout_lead",
          tag: "lead-new",
        };

    const pushPayloadString = JSON.stringify(payloadObject);

    // 12. Idempotência por Dispositivo (push_notification_deliveries)
    let sentCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    let expiredCount = 0;

    for (const sub of subscriptions) {
      // Verifica estado de entrega existente para esta inscrição no evento
      const { data: existingDelivery } = await supabaseAdmin
        .from("push_notification_deliveries")
        .select("id, status, attempts, locked_at")
        .eq("event_id", eventRecord.id)
        .eq("subscription_id", sub.id)
        .maybeSingle();

      if (existingDelivery) {
        if (existingDelivery.status === "completed" || existingDelivery.status === "expired") {
          console.log(`[WebPush Edge] Dispositivo já processado (${existingDelivery.status}): sub=${sub.id}`);
          skippedCount++;
          continue;
        }

        const delLockAge = Date.now() - new Date(existingDelivery.locked_at).getTime();
        if (existingDelivery.status === "processing" && delLockAge < 60000) {
          console.log(`[WebPush Edge] Entrega em processamento por outra rotina: sub=${sub.id}`);
          skippedCount++;
          continue;
        }

        await supabaseAdmin
          .from("push_notification_deliveries")
          .update({
            status: "processing",
            attempts: (existingDelivery.attempts || 1) + 1,
            locked_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", existingDelivery.id);
      } else {
        await supabaseAdmin
          .from("push_notification_deliveries")
          .insert([{
            event_id: eventRecord.id,
            subscription_id: sub.id,
            status: "processing",
            attempts: 1,
            locked_at: new Date().toISOString(),
          }]);
      }

      // Envia notificação para a inscrição
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth_key,
        },
      };

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        await webPush.sendNotification(pushSubscription, pushPayloadString, {
          signal: controller.signal,
          TTL: 86400,
        });
        clearTimeout(timeoutId);

        sentCount++;

        // Atualiza entrega como completed
        await supabaseAdmin
          .from("push_notification_deliveries")
          .update({
            status: "completed",
            completed_at: new Date().toISOString(),
            last_error_code: null,
            updated_at: new Date().toISOString(),
          })
          .eq("event_id", eventRecord.id)
          .eq("subscription_id", sub.id);

        // Atualiza estatísticas da subscription
        await supabaseAdmin
          .from("push_subscriptions")
          .update({
            last_success_at: new Date().toISOString(),
            failed_count: 0,
            updated_at: new Date().toISOString(),
          })
          .eq("id", sub.id);
      } catch (err: any) {
        failedCount++;
        const statusCode = err?.statusCode || err?.status;
        const isExpired = statusCode === 404 || statusCode === 410;

        if (isExpired) {
          expiredCount++;
          // Atualiza entrega como expired
          await supabaseAdmin
            .from("push_notification_deliveries")
            .update({
              status: "expired",
              completed_at: new Date().toISOString(),
              last_error_code: `HTTP_${statusCode}`,
              updated_at: new Date().toISOString(),
            })
            .eq("event_id", eventRecord.id)
            .eq("subscription_id", sub.id);

          // Desativa a subscription no banco
          await supabaseAdmin
            .from("push_subscriptions")
            .update({
              enabled: false,
              failed_count: (sub.failed_count || 0) + 1,
              last_failure_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", sub.id);
        } else {
          // Atualiza entrega como failed (para retentativa futura no reenvio do webhook)
          await supabaseAdmin
            .from("push_notification_deliveries")
            .update({
              status: "failed",
              last_error_code: `HTTP_${statusCode || 'ERR'}`,
              updated_at: new Date().toISOString(),
            })
            .eq("event_id", eventRecord.id)
            .eq("subscription_id", sub.id);

          await supabaseAdmin
            .from("push_subscriptions")
            .update({
              failed_count: (sub.failed_count || 0) + 1,
              last_failure_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq("id", sub.id);
        }
      }
    }

    // 13. Avaliar Status Final do Evento
    const { data: allDeliveries } = await supabaseAdmin
      .from("push_notification_deliveries")
      .select("status")
      .eq("event_id", eventRecord.id);

    const allFinished = allDeliveries && allDeliveries.length > 0 && allDeliveries.every(
      (d: any) => d.status === "completed" || d.status === "expired"
    );

    if (allFinished) {
      await supabaseAdmin
        .from("push_notification_events")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventRecord.id);
    } else {
      await supabaseAdmin
        .from("push_notification_events")
        .update({
          status: "failed",
          last_error_code: "SOME_DELIVERIES_FAILED",
          updated_at: new Date().toISOString(),
        })
        .eq("id", eventRecord.id);
    }

    return new Response(
      JSON.stringify({
        success: true,
        sent: sentCount,
        skipped: skippedCount,
        failed: failedCount,
        expired: expiredCount,
        eventStatus: allFinished ? "completed" : "failed",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (err: any) {
    console.error("[WebPush Edge] Exceção na Edge Function:", err?.message || err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
