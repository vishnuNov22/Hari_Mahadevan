import "server-only";
import type { EnquiryInput } from "./validation";

/**
 * Enquiry delivery adapter. Isolated so another provider can replace it.
 * Uses Resend's HTTP API via fetch (no SDK dependency).
 *
 * Env: RESEND_API_KEY, ENQUIRY_FROM_EMAIL, ENQUIRY_TO_EMAIL
 */
export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "provider_error" };

export function isDeliveryConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.ENQUIRY_FROM_EMAIL && process.env.ENQUIRY_TO_EMAIL);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function deliverEnquiry(input: EnquiryInput): Promise<DeliveryResult> {
  if (!isDeliveryConfigured()) return { ok: false, reason: "not_configured" };

  const lines = [
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone || "—"],
    ["Area of interest", input.topic],
  ] as const;

  const html = `
    <h2 style="font-family:Georgia,serif">New website enquiry</h2>
    <table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px">
      ${lines.map(([k, v]) => `<tr><td><strong>${k}</strong></td><td>${escapeHtml(v)}</td></tr>`).join("")}
    </table>
    <p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(input.message)}</p>`;

  const text = `${lines.map(([k, v]) => `${k}: ${v}`).join("\n")}\n\n${input.message}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.ENQUIRY_FROM_EMAIL,
        to: [process.env.ENQUIRY_TO_EMAIL],
        reply_to: input.email,
        subject: `Website enquiry — ${input.topic} — ${input.name}`,
        html,
        text,
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error("[enquiry] provider responded with", res.status);
      return { ok: false, reason: "provider_error" };
    }
    return { ok: true };
  } catch (err) {
    console.error("[enquiry] delivery failed", err);
    return { ok: false, reason: "provider_error" };
  }
}
