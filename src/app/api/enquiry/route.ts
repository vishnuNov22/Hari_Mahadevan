import { NextResponse } from "next/server";
import { enquirySchema, toFieldErrors, type EnquiryResponse } from "@/lib/validation";
import { deliverEnquiry } from "@/lib/enquiry-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function reply(body: EnquiryResponse, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return reply({ status: "error", message: "The request could not be read." }, 400);
  }

  const parsed = enquirySchema.safeParse(json);
  if (!parsed.success) {
    // A filled honeypot means a bot: answer neutrally without delivering.
    const honeypot = (json as { company?: unknown } | null)?.company;
    if (typeof honeypot === "string" && honeypot.length > 0) {
      return reply({ status: "error", message: "The enquiry could not be sent." }, 400);
    }
    return reply({ status: "invalid", errors: toFieldErrors(parsed.error) }, 422);
  }

  const result = await deliverEnquiry(parsed.data);
  if (result.ok) return reply({ status: "sent" });
  if (result.reason === "not_configured") return reply({ status: "not_configured" }, 503);
  return reply({ status: "error", message: "The enquiry service did not respond. Please try again or email directly." }, 502);
}
