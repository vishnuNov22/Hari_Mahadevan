import { z } from "zod";
import { enquiryTopics } from "@/content/site";

const phonePattern = /^[+()\-\s\d]{7,20}$/;

export const enquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(80, "Please keep your name under 80 characters."),
  email: z.string().trim().min(1, "Please enter your email address.").email("Please enter a valid email address.").max(120),
  phone: z
    .string()
    .trim()
    .max(20, "Please enter a shorter phone number.")
    .refine((v) => v === "" || phonePattern.test(v), "Please enter a valid phone number, or leave it blank.")
    .optional()
    .default(""),
  topic: z.enum(enquiryTopics, { errorMap: () => ({ message: "Please choose an area of interest." }) }),
  message: z
    .string()
    .trim()
    .min(10, "Please tell us a little more (at least 10 characters).")
    .max(2000, "Please keep your message under 2,000 characters."),
  consent: z.literal(true, { errorMap: () => ({ message: "Please tick the box to agree before sending." }) }),
  /** Honeypot — real visitors never see or fill this field. */
  company: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;
export type EnquiryField = "name" | "email" | "phone" | "topic" | "message" | "consent";
export type FieldErrors = Partial<Record<EnquiryField, string>>;

export function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && key !== "company" && !(key in out)) {
      out[key as EnquiryField] = issue.message;
    }
  }
  return out;
}

/** Response contract between /api/enquiry and the form. */
export type EnquiryResponse =
  | { status: "sent" }
  | { status: "not_configured" }
  | { status: "invalid"; errors: FieldErrors }
  | { status: "error"; message: string };
