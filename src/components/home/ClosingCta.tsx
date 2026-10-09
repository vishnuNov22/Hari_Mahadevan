import Link from "next/link";
import { enquiryTopics } from "@/content/site";
import { Container } from "@/components/ui/Container";

export function ClosingCta() {
  return (
    <section aria-labelledby="closing-title" className="on-teal bg-teal py-20 text-ivory sm:py-28">
      <Container className="grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="eyebrow text-ivory/70">Your requirement</p>
          <h2 id="closing-title" className="display-lg mt-6">
            Tell me what you need. I’ll point you to the right place.
          </h2>
        </div>
        <div className="lg:col-span-5">
          <p className="text-[1rem] leading-relaxed text-ivory/80">Choose an area to begin — you can change it on the form.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {enquiryTopics.map((topic) => (
              <li key={topic}>
                <Link
                  href={`/contact?topic=${encodeURIComponent(topic)}`}
                  className="inline-flex min-h-11 items-center rounded-full border border-ivory/35 px-5 text-[0.92rem] transition-colors duration-200 hover:border-ivory hover:bg-ivory hover:text-teal"
                >
                  {topic}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
