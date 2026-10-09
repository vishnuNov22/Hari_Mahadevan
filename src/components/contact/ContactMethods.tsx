import { Mail, Phone } from "lucide-react";
import { mailtoHref, site } from "@/content/site";

export function ContactMethods() {
  return (
    <ul className="grid gap-px border border-line-dark bg-line-dark">
      <li className="bg-ink">
        <a href={mailtoHref("Website enquiry")} className="group flex items-center gap-5 p-6 transition-colors hover:bg-ink-2">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-brass-soft/50 text-brass-soft">
            <Mail aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="eyebrow block text-muted-dark">Email</span>
            <span className="mt-1 block break-all text-[1.05rem] text-ivory group-hover:underline group-hover:underline-offset-4">
              {site.contact.email}
            </span>
          </span>
        </a>
      </li>
      <li className="bg-ink">
        <a href={site.contact.phoneHref} className="group flex items-center gap-5 p-6 transition-colors hover:bg-ink-2">
          <span className="grid size-12 shrink-0 place-items-center rounded-full border border-brass-soft/50 text-brass-soft">
            <Phone aria-hidden="true" className="size-5" />
          </span>
          <span>
            <span className="eyebrow block text-muted-dark">Phone</span>
            <span className="mt-1 block text-[1.05rem] text-ivory group-hover:underline group-hover:underline-offset-4">
              {site.contact.phoneDisplay}
            </span>
          </span>
        </a>
      </li>
      {site.contact.whatsappHref ? (
        <li className="bg-ink">
          <a href={site.contact.whatsappHref} target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 p-6 hover:bg-ink-2">
            <span className="eyebrow text-muted-dark">WhatsApp</span>
          </a>
        </li>
      ) : null}
    </ul>
  );
}
