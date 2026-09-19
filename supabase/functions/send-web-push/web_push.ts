// Native Web Push Helper for Supabase Edge Functions / Deno
import webPush from "npm:web-push@3.6.7";

export interface PushSubscriptionKeys {
  p256dh: string;
  auth: string;
}

export interface PushSubscriptionTarget {
  endpoint: string;
  keys: PushSubscriptionKeys;
}

export interface VapidDetails {
  subject: string;
  publicKey: string;
  privateKey: string;
}

export interface SendPushOptions {
  subscription: PushSubscriptionTarget;
  payload: string;
  vapidDetails: VapidDetails;
  ttl?: number;
  timeoutMs?: number;
}

export interface SendPushResult {
  success: boolean;
  statusCode?: number;
  error?: string;
  isExpired: boolean;
}

/**
 * Sends a VAPID signed Web Push notification using web-push module
 */
export async function sendWebPushNotification(options: SendPushOptions): Promise<SendPushResult> {
  const { subscription, payload, vapidDetails, ttl = 86400, timeoutMs = 5000 } = options;

  try {
    webPush.setVapidDetails(
      vapidDetails.subject,
      vapidDetails.publicKey,
      vapidDetails.privateKey
    );

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    const pushSub = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };

    await webPush.sendNotification(pushSub, payload, {
      signal: controller.signal,
      TTL: ttl,
    });

    clearTimeout(timeoutId);
    return { success: true, isExpired: false };
  } catch (err: any) {
    const statusCode = err?.statusCode || err?.status || 500;
    const isExpired = statusCode === 404 || statusCode === 410;
    return {
      success: false,
      statusCode,
      error: err?.message || 'Push send error',
      isExpired,
    };
  }
}
