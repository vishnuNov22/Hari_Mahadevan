import { enquiryTopics, site, type EnquiryTopic } from "@/content/site";
import { ventures } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { EnquiryForm } from "@/components/contact/EnquiryForm";
import { ContactMethods } from "@/components/contact/ContactMethods";

export const metadata = buildMetadata({
  title: "Contact",
  description:
    "Contact Hari Mahadevan about digital marketing, events, real estate, financial services or a collaboration. Email, phone or send an enquiry.",
  path: "/contact",
});

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function parseTopic(value: string | string[] | undefined): EnquiryTopic | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  return enquiryTopics.find((t) => t === v);
}

export default async function ContactPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const initialTopic = parseTopic(params.topic);

  return (
    <div className="lg:grid lg:min-h-[calc(100vh-72px)] lg:grid-cols-12">
      {/* Invitation column */}
      <section aria-labelledby="contact-title" className="on-dark grain bg-ink text-ivory lg:col-span-5">
        <div className="px-5 py-12 sm:px-8 sm:py-16 lg:sticky lg:top-[72px] lg:px-12 lg:py-20 xl:pl-[max(3rem,calc((100vw-1320px)/2+3rem))]">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Contact", href: "/contact" }]} dark />
          <h1 id="contact-title" className="display-lg mt-10 lg:text-[clamp(2.6rem,4.2vw,4.4rem)]">
            Let’s <span className="italic text-brass-soft">start</span> a conversation.
          </h1>
          <p className="lede mt-6 max-w-md text-muted-dark">
            Tell me what you need — a campaign, a celebration, a property or a question about protection. Pick the closest area; it doesn’t have to be
            exact.
          </p>

          <div className="mt-10">
            <ContactMethods />
          </div>

          <div className="mt-10">
            <p className="eyebrow text-muted-dark">Areas</p>
            <ul className="mt-4 grid gap-1 text-[0.95rem] text-ivory/80">
              {ventures.map((v) => (
                <li key={v.slug}>
                  {v.number} — {v.label}
                </li>
              ))}
            </ul>
          </div>

          <p className="mt-12 font-display text-[1.3rem] italic text-brass-soft">{site.signature}</p>
        </div>
      </section>

      {/* Form column */}
      <section aria-labelledby="form-title" className="bg-paper lg:col-span-7">
        <div className="max-w-3xl px-5 py-14 sm:px-8 sm:py-20 lg:px-14 lg:py-20">
          <h2 id="form-title" className="display-md">
            Send an enquiry
          </h2>
          <p className="mt-4 max-w-xl text-[1rem] leading-relaxed text-muted">
            Only what’s needed to reply. Your details are used to answer this enquiry and nothing else.
          </p>
          <div className="mt-12">
            <EnquiryForm initialTopic={initialTopic} />
          </div>
        </div>
      </section>
    </div>
  );
}
