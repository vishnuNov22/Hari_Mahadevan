"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode, type Ref } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, RotateCcw } from "lucide-react";
import { enquiryTopics, mailtoHref, site, type EnquiryTopic } from "@/content/site";
import {
  enquirySchema,
  toFieldErrors,
  type EnquiryField,
  type EnquiryResponse,
  type FieldErrors,
} from "@/lib/validation";
import { cn } from "@/lib/cn";

type Status = "idle" | "submitting" | "sent" | "not_configured" | "error";

type Values = {
  name: string;
  email: string;
  phone: string;
  topic: EnquiryTopic | "";
  message: string;
  consent: boolean;
  company: string;
};

const FIELD_ORDER: EnquiryField[] = ["name", "email", "phone", "topic", "message", "consent"];
const MAX_MESSAGE = 2000;

function buildMailBody(v: Values) {
  return [
    `Name: ${v.name}`,
    `Email: ${v.email}`,
    v.phone ? `Phone: ${v.phone}` : null,
    `Area of interest: ${v.topic || "Not specified"}`,
    "",
    v.message,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function EnquiryForm({ initialTopic }: { initialTopic?: EnquiryTopic }) {
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const inFlight = useRef(false);

  const [values, setValues] = useState<Values>({
    name: "",
    email: "",
    phone: "",
    topic: initialTopic ?? "",
    message: "",
    consent: false,
    company: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string>("");

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key in errors) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const focusFirstError = (errs: FieldErrors) => {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (first) document.getElementById(id(first))?.focus();
  };

  const focusStatus = () => requestAnimationFrame(() => statusRef.current?.focus());

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return; // duplicate-submit protection

    const parsed = enquirySchema.safeParse(values);
    if (!parsed.success) {
      const errs = toFieldErrors(parsed.error);
      setErrors(errs);
      focusFirstError(errs);
      return;
    }

    inFlight.current = true;
    setStatus("submitting");
    setServerMessage("");

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await res.json().catch(() => null)) as EnquiryResponse | null;

      if (data?.status === "sent") {
        setStatus("sent");
      } else if (data?.status === "not_configured") {
        setStatus("not_configured");
      } else if (data?.status === "invalid") {
        setErrors(data.errors);
        setStatus("idle");
        focusFirstError(data.errors);
        return;
      } else {
        setServerMessage(data?.status === "error" ? data.message : "The enquiry could not be sent.");
        setStatus("error");
      }
    } catch {
      setServerMessage("We couldn’t reach the server. Please check your connection and try again.");
      setStatus("error");
    } finally {
      inFlight.current = false;
    }
    focusStatus();
  }

  const mailFallback = mailtoHref(`Website enquiry — ${values.topic || "General"} — ${values.name}`.trim(), buildMailBody(values));

  if (status === "sent") {
    return (
      <StatusPanel ref={statusRef} tone="success" icon={<CheckCircle2 aria-hidden="true" className="size-6" />} title="Thank you — your enquiry has been sent.">
        <p>
          Hari will reply to <strong>{values.email}</strong>. If it’s urgent, call{" "}
          <a className="underline underline-offset-4" href={site.contact.phoneHref}>
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
        <Link href="/ventures" className="mt-6 inline-flex min-h-11 items-center font-semibold text-teal underline underline-offset-4">
          Explore the ventures while you wait
        </Link>
      </StatusPanel>
    );
  }

  if (status === "not_configured") {
    return (
      <StatusPanel ref={statusRef} tone="info" icon={<Mail aria-hidden="true" className="size-6" />} title="Your message hasn’t been sent yet.">
        <p>
          Online sending isn’t switched on for this website yet, so nothing has been delivered. Your details are ready in an email — open it in your
          email app and press send.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href={mailFallback}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-teal px-6 font-semibold text-ivory hover:bg-[#0b4a47]"
          >
            <Mail aria-hidden="true" className="size-4" /> Open pre-filled email
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/20 px-6 font-semibold hover:border-ink"
          >
            Edit my message
          </button>
        </div>
        <p className="mt-4 text-[0.9rem] text-muted">
          Or write to{" "}
          <a className="underline underline-offset-4" href={`mailto:${site.contact.email}`}>
            {site.contact.email}
          </a>{" "}
          / call{" "}
          <a className="underline underline-offset-4" href={site.contact.phoneHref}>
            {site.contact.phoneDisplay}
          </a>
          .
        </p>
      </StatusPanel>
    );
  }

  const submitting = status === "submitting";
  const messageLeft = MAX_MESSAGE - values.message.length;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id("intro")}`} className="grid gap-7">
      <p id={id("intro")} className="text-[0.95rem] text-muted">
        Fields marked <span aria-hidden="true">*</span>
        <span className="sr-only">with an asterisk</span> are required.
      </p>

      {status === "error" ? (
        <div ref={statusRef} tabIndex={-1} role="alert" className="flex gap-3 border border-[#9b2c2c]/30 bg-[#fbeeee] p-5 text-[#7a1f1f] outline-none">
          <AlertCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
          <div>
            <p className="font-semibold">Your enquiry was not sent.</p>
            <p className="mt-1 text-[0.95rem]">{serverMessage}</p>
            <p className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-[0.95rem]">
              <button type="submit" className="inline-flex items-center gap-1.5 font-semibold underline underline-offset-4">
                <RotateCcw aria-hidden="true" className="size-4" /> Try again
              </button>
              <a href={mailFallback} className="font-semibold underline underline-offset-4">
                Send by email instead
              </a>
            </p>
          </div>
        </div>
      ) : null}

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id={id("name")} label="Your name" required error={errors.name}>
          <input
            id={id("name")}
            name="name"
            type="text"
            autoComplete="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${id("name")}-error` : undefined}
            aria-required="true"
            className={inputClass(Boolean(errors.name))}
          />
        </Field>
        <Field id={id("email")} label="Email address" required error={errors.email}>
          <input
            id={id("email")}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${id("email")}-error` : undefined}
            aria-required="true"
            className={inputClass(Boolean(errors.email))}
          />
        </Field>
      </div>

      <div className="grid gap-7 sm:grid-cols-2">
        <Field id={id("phone")} label="Phone" hint="Optional" error={errors.phone}>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${id("phone")}-error` : undefined}
            className={inputClass(Boolean(errors.phone))}
          />
        </Field>
        <Field id={id("topic")} label="Area of interest" required error={errors.topic}>
          <select
            id={id("topic")}
            name="topic"
            value={values.topic}
            onChange={(e) => set("topic", e.target.value as EnquiryTopic | "")}
            aria-invalid={Boolean(errors.topic)}
            aria-describedby={errors.topic ? `${id("topic")}-error` : undefined}
            aria-required="true"
            className={cn(inputClass(Boolean(errors.topic)), "appearance-none bg-[length:12px] bg-[right_0.25rem_center] bg-no-repeat pr-8")}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' fill='none' stroke='%230d1322' stroke-width='1.5'/%3E%3C/svg%3E\")",
            }}
          >
            <option value="" disabled>
              Choose one…
            </option>
            {enquiryTopics.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field id={id("message")} label="Your requirement" required error={errors.message}>
        <textarea
          id={id("message")}
          name="message"
          rows={6}
          maxLength={MAX_MESSAGE}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${id("message")}-count${errors.message ? ` ${id("message")}-error` : ""}`}
          aria-required="true"
          className={cn(inputClass(Boolean(errors.message)), "resize-y leading-relaxed")}
          placeholder="What do you need, and roughly when?"
        />
        <p id={`${id("message")}-count`} className="mt-2 text-right text-[0.8rem] text-muted">
          {messageLeft} characters left
        </p>
      </Field>

      {/* Honeypot: hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={id("company")}>Company</label>
        <input
          id={id("company")}
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-start gap-3">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
            className="mt-1 size-5 shrink-0 accent-[#0e5b57]"
          />
          <label htmlFor={id("consent")} className="text-[0.95rem] leading-relaxed">
            I agree that Hari Mahadevan may use these details to reply to my enquiry, as described in the{" "}
            <Link href="/privacy" className="underline underline-offset-4">
              privacy notice
            </Link>
            . <span aria-hidden="true">*</span>
          </label>
        </div>
        {errors.consent ? <ErrorText id={`${id("consent")}-error`}>{errors.consent}</ErrorText> : null}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={submitting}
          aria-disabled={submitting}
          className="inline-flex min-h-13 items-center justify-center gap-2 rounded-full bg-teal px-8 py-3.5 text-[1rem] font-semibold text-ivory transition-colors hover:bg-[#0b4a47] disabled:cursor-wait disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 aria-hidden="true" className="size-4 animate-spin" /> Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
        <p className="text-[0.9rem] text-muted">
          Prefer email?{" "}
          <a href={mailtoHref("Website enquiry")} className="underline underline-offset-4">
            Write directly
          </a>
        </p>
      </div>

      <p aria-live="polite" className="sr-only">
        {submitting ? "Sending your enquiry…" : ""}
      </p>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return cn(
    "block w-full border-0 border-b bg-transparent px-0 py-3 text-[1.05rem] text-ink placeholder:text-ink/35 focus:outline-none focus-visible:outline-none focus:ring-0 transition-colors",
    invalid ? "border-[#9b2c2c] focus:border-[#9b2c2c]" : "border-ink/25 hover:border-ink/50 focus:border-teal",
    "focus:shadow-[0_2px_0_0_var(--teal)]",
  );
}

function ErrorText({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1.5 text-[0.88rem] text-[#9b2c2c]">
      <AlertCircle aria-hidden="true" className="size-4 shrink-0" />
      {children}
    </p>
  );
}

function Field({
  id,
  label,
  required,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="eyebrow flex items-center gap-2 text-ink/70">
        {label}
        {required ? <span aria-hidden="true">*</span> : null}
        {hint ? <span className="font-normal normal-case tracking-normal text-muted">({hint})</span> : null}
      </label>
      {children}
      {error ? <ErrorText id={`${id}-error`}>{error}</ErrorText> : null}
    </div>
  );
}

const StatusPanel = ({
  ref,
  tone,
  icon,
  title,
  children,
}: {
  ref: Ref<HTMLDivElement>;
  tone: "success" | "info";
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) => (
  <div
    ref={ref}
    tabIndex={-1}
    role="status"
    className={cn("border p-8 outline-none sm:p-10", tone === "success" ? "border-teal/30 bg-[#e6f0ee]" : "border-brass/40 bg-[#f6efe1]")}
  >
    <div className="flex items-center gap-3 text-teal">{icon}</div>
    <h2 className="mt-4 font-display text-[1.9rem] leading-tight tracking-tight">{title}</h2>
    <div className="mt-4 text-[1rem] leading-relaxed text-ink/85">{children}</div>
  </div>
);
