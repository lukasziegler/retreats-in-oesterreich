/**
 * Cookie-Consent + Google Tag Manager.
 * GTM wird ausschließlich nach expliziter Zustimmung geladen (DSGVO).
 */

const COOKIE_NAME = "cookie-notice-option";

function setCookie(name: string, value: string, days: number): void {
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1] ?? null;
}

function loadGtm(gtmId: string): void {
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`;
  document.head.appendChild(script);
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function initCookieConsent(): void {
  const notice = document.getElementById("cookie-notice");
  const gtmId = notice?.dataset.gtmId;
  if (!notice || !gtmId) return;

  const accept = document.getElementById("cookie-notice-accept");
  const deny = document.getElementById("cookie-notice-deny");
  const consent = getCookie(COOKIE_NAME);

  if (consent === "true") {
    loadGtm(gtmId);
  } else if (consent !== "false") {
    notice.hidden = false;
  }

  accept?.addEventListener("click", () => {
    setCookie(COOKIE_NAME, "true", 31);
    notice.hidden = true;
    loadGtm(gtmId);
  });

  deny?.addEventListener("click", () => {
    setCookie(COOKIE_NAME, "false", 31);
    notice.hidden = true;
  });
}
