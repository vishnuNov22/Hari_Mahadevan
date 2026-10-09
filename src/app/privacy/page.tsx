import { site } from "@/content/site";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

export const metadata = buildMetadata({
  title: "Privacy notice",
  description: "How enquiry details sent through this website are used.",
  path: "/privacy",
});

const sections = [
  {
    title: "What is collected",
    body: [
      "When you send an enquiry, the form asks for your name, email address, an optional phone number, the area you are interested in and your message.",
      "This website does not use advertising trackers or analytics cookies.",
    ],
  },
  {
    title: "How it is used",
    body: [
      "Your details are used only to read and reply to your enquiry and to continue the conversation you started. They are not sold or shared for marketing.",
    ],
  },
  {
    title: "How it is delivered",
    body: [
      "If online sending is enabled, your enquiry is delivered by email through a transactional email service acting on Hari’s behalf. If it is not enabled, the form opens a pre-filled email in your own email app and nothing is sent until you press send.",
    ],
  },
  {
    title: "How long it is kept",
    body: ["Enquiry emails are kept only as long as needed to respond and maintain the working relationship, then deleted on request or when no longer needed."],
  },
  {
    title: "Your choices",
    body: [
      `You can ask to see, correct or delete the details you sent at any time by writing to ${site.contact.email}.`,
    ],
  },
];

export default function PrivacyPage() {
  return (
    <section aria-labelledby="privacy-title" className="bg-paper pb-24 pt-10 sm:pb-32 sm:pt-14">
      <Container>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy notice", href: "/privacy" }]} />
        <div className="mt-12 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h1 id="privacy-title" className="display-md">
              Privacy notice
            </h1>
            <p className="mt-4 text-[0.95rem] text-muted">Plain-language summary of how enquiry details are handled.</p>
          </div>
          <div className="max-w-[68ch] lg:col-span-8">
            {sections.map((s) => (
              <div key={s.title} className="border-t border-line py-8">
                <h2 className="text-[1.15rem] font-semibold tracking-tight">{s.title}</h2>
                {s.body.map((p) => (
                  <p key={p} className="mt-3 text-[1.02rem] leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
              </div>
            ))}
            <p className="border-t border-line pt-8 text-[0.9rem] text-muted">
              Questions about this notice:{" "}
              <a href={`mailto:${site.contact.email}`} className="underline underline-offset-4">
                {site.contact.email}
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
