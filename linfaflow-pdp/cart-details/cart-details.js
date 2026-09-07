(function () {
  'use strict';

  var CART_KEY = 'linfaflow_single_cart_item';
  var CART_CLEARED_KEY = 'linfaflow_single_cart_cleared';

  function cfg() {
    return window.LINFAFLOW_CART_CONFIG || { packages: {}, defaultTier: '3' };
  }

  function money(value) {
    var n = Number(value || 0);
    return '$' + n.toFixed(2);
  }

  function getPackageByTier(tier) {
    var packages = cfg().packages || {};
    return packages[String(tier)] || packages[String(cfg().defaultTier || '3')] || packages['3'] || packages['1'] || null;
  }

  function selectedTier() {
    var active = document.querySelector('.quantity_item.active') || document.querySelector('.quantity_item.variant-check');
    if (!active) return String(cfg().defaultTier || '3');
    var qty = String(active.getAttribute('quantity') || '3');
    if (qty === '1') return '1';
    if (qty === '3') return '3';
    if (qty === '5' || qty === '6') return '6';
    return String(cfg().defaultTier || '3');
  }

  function getCheckoutUrl(item) {
    if (item && item.checkout_url) return item.checkout_url;
    var selected = getPackageByTier(selectedTier());
    return selected && selected.checkout_url ? selected.checkout_url : 'checkout.php';
  }

  function readCart() {
    try {
      var raw = sessionStorage.getItem(CART_KEY) || localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function writeCart(item) {
    try {
      sessionStorage.setItem(CART_KEY, JSON.stringify(item));
      localStorage.setItem(CART_KEY, JSON.stringify(item));
      sessionStorage.removeItem(CART_CLEARED_KEY);
      localStorage.removeItem(CART_CLEARED_KEY);
    } catch (e) {}
  }

  function clearCart() {
    try {
      sessionStorage.removeItem(CART_KEY);
      localStorage.removeItem(CART_KEY);
      sessionStorage.setItem(CART_CLEARED_KEY, '1');
      localStorage.setItem(CART_CLEARED_KEY, '1');
    } catch (e) {}
  }

  function selectedItem() {
    var item = getPackageByTier(selectedTier());
    if (!item) return null;
    return Object.assign({}, item, { cart_quantity: 1 });
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function emptyHtml() {
    return '' +
      '<div id="cart_drawer_content">' +
      '<div class="cart-content linfaflow-cart-content">' +
      '<div class="linfaflow-cart-empty cart_empty_content">' +
      '<div class="cart_empty_heading">Your Cart Is Empty</div>' +
      '<div class="cart_empty_button">Continue Shopping</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function itemHtml(item) {
    var compare = Number(item.compare_total || 0);
    var price = Number(item.price || 0);
    var save = Number(item.save_amount || (compare > price ? compare - price : 0));
    var checkoutUrl = getCheckoutUrl(item);
    return '' +
      '<div id="cart_drawer_content">' +
      '<div class="cart-content linfaflow-cart-content">' +
      '<div class="cart_heading">Your Cart</div>' +
      '<div class="linfaflow-cart-item-wrap">' +
      '<div class="cart_middle">' +
      '<div class="cart_item_single cart_item_single_flex" data-tier="' + escapeHtml(item.tier || '') + '">' +
      '<div class="cart_item_single_left"><img class="item_image" src="' + escapeHtml(item.image || '') + '" alt="' + escapeHtml(item.name || '') + '"></div>' +
      '<div class="cart_item_single_right">' +
      '<div class="product_rating_cart">Rated 4.9 Excellent</div>' +
      '<div class="cart_item_single_title">' + escapeHtml(item.name || '') + '</div>' +
      '<div class="cart_item_single_right_title_right_price">' +
      '<span class="cart_item_single_price">' + money(price) + '</span>' +
      (compare > price ? '<s>' + money(compare) + '</s>' : '') +
      '</div>' +
      '<div class="linfaflow-cart-meta">SKU: ' + escapeHtml(item.sku || item.id || '') + '<br>' + escapeHtml(item.shipping_label || 'Free Shipping') + '</div>' +
      '<div class="cart_quantity_wrapper"><span class="linfaflow-cart-single-qty">Qty: 1 package</span></div>' +
      '<button type="button" class="cart_item_single_right_remove linfaflow-cart-remove" aria-label="Remove item">' +
      '<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/></svg>' +
      '</button>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '</div>' +
      '<div class="cart_footer">' +
      '<div class="cart_footer_top">' +
      '<div class="cart_footer_subtotal_title">Subtotal</div>' +
      '<div class="cart_footer_subtotal_right">' +
      (save > 0 ? '<div class="cart_footer_subtotal_save">Save ' + money(save) + '</div>' : '') +
      '<div class="cart_footer_subtotal_price">' + money(price) + '</div>' +
      '</div>' +
      '</div>' +
      '<a class="checkout_button" href="' + escapeHtml(checkoutUrl) + '">Checkout Now</a>' +
      '<div class="under_cta_texts"><div class="under_cta_text">Free Shipping</div><div class="under_cta_text">Secure Checkout</div></div>' +
      '<div class="linfaflow-cart-secure-note">Only one package is kept in the cart. Selecting another package replaces the previous one.</div>' +
      '</div>' +
      '</div>' +
      '</div>';
  }

  function setCount(hasItem) {
    var count = document.querySelectorAll('.cart_count_js');
    count.forEach(function (el) {
      if (hasItem) {
        el.textContent = '1';
        el.style.display = 'inline-flex';
      } else {
        el.textContent = '0';
        el.style.display = 'none';
      }
    });
  }

  function renderCart(item) {
    var drawer = document.getElementById('cart-drawer');
    var current = document.getElementById('cart_drawer_content');
    if (!drawer || !current) return;
    current.outerHTML = item ? itemHtml(item) : emptyHtml();
    drawer.classList.toggle('is_empty', !item);
    setCount(!!item);
  }

  function replaceWithSelected() {
    var item = selectedItem();
    if (!item) return null;
    writeCart(item);
    renderCart(item);
    return item;
  }

  function isCartCleared() {
    try {
      return sessionStorage.getItem(CART_CLEARED_KEY) === '1' || localStorage.getItem(CART_CLEARED_KEY) === '1';
    } catch (e) {
      return false;
    }
  }

  function openCart() {
    renderCart(readCart() || (isCartCleared() ? null : selectedItem()));
    var drawer = document.getElementById('cart-drawer');
    var overlay = document.querySelector('.custom_overlay2');
    if (drawer) drawer.classList.add('open');
    if (overlay) overlay.classList.add('active');
  }

  document.addEventListener('DOMContentLoaded', function () {
    replaceWithSelected();

    document.addEventListener('click', function (e) {
      var packageButton = e.target.closest('.quantity_item');
      if (packageButton) {
        setTimeout(replaceWithSelected, 0);
      }

      var cartToggle = e.target.closest('#cart-toggle');
      if (cartToggle) {
        e.preventDefault();
        e.stopPropagation();
        openCart();
      }

      var removeButton = e.target.closest('.linfaflow-cart-remove');
      if (removeButton) {
        e.preventDefault();
        clearCart();
        renderCart(null);
      }

      var continueButton = e.target.closest('.cart_empty_button');
      if (continueButton) {
        var drawer = document.getElementById('cart-drawer');
        var overlay = document.querySelector('.custom_overlay2');
        if (drawer) drawer.classList.remove('open');
        if (overlay) overlay.classList.remove('active');
      }

      var checkoutButton = e.target.closest('.custom_checkout_button, .custom_checkout_button_landing_page, .custom_lp_button');
      if (checkoutButton) {
        replaceWithSelected();
      }
    }, true);
  });
})();
