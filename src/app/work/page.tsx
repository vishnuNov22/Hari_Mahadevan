import { projects, showcaseCategories } from "@/content/work";
import { ventureHref } from "@/content/ventures";
import { buildMetadata } from "@/lib/metadata";
import { Container } from "@/components/ui/Container";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ProjectCard } from "@/components/ventures/ProjectCard";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Work",
  description: "Selected projects from Hari Mahadevan’s ventures — published only once they are real, complete and approved.",
  path: "/work",
});

export default function WorkPage() {
  const hasWork = projects.length > 0;

  return (
    <>
      <section aria-labelledby="work-title" className="bg-stone">
        <Container className="pb-16 pt-10 sm:pb-24 sm:pt-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work", href: "/work" }]} />
          <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:items-end">
            <h1 id="work-title" className="display-xl anim-rise lg:col-span-7">
              The <span className="italic text-teal">work.</span>
            </h1>
            <p className="lede text-muted lg:col-span-5">
              {hasWork
                ? "Campaigns, celebrations, properties and more — shared with the permission of the people involved."
                : "This showcase is being assembled from real projects. Each one will appear here once it is complete and approved for publication."}
            </p>
          </div>
        </Container>
      </section>

      {hasWork ? (
        <section aria-label="Projects" className="bg-paper py-20 sm:py-28">
          <Container>
            <ul className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <li key={p.slug}>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : (
        <section aria-labelledby="coming-title" className="bg-paper py-20 sm:py-28">
          <Container>
            <SectionHeading
              id="coming-title"
              index="—"
              eyebrow="Coming together"
              title="What will appear here."
              intro="Nothing on this page is invented. Until real projects are ready, here is how the showcase is organised."
            />
            <ol className="mt-16 border-t border-line">
              {showcaseCategories.map((c, i) => (
                <Reveal
                  as="li"
                  key={c.slug}
                  className="grid gap-4 border-b border-line py-8 sm:grid-cols-[5rem_1fr_1.2fr_auto] sm:items-baseline sm:gap-8"
                >
                  <span className="eyebrow text-muted">0{i + 1}</span>
                  <h2 className="font-display text-[1.8rem] leading-tight tracking-tight">{c.label}</h2>
                  <p className="text-[1rem] leading-relaxed text-muted">{c.expects}</p>
                  <Link href={ventureHref(c.slug)} className="link-underline justify-self-start text-[0.95rem] font-semibold text-teal">
                    View venture
                  </Link>
                </Reveal>
              ))}
            </ol>
            <div className="mt-14 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href="/contact">Discuss a project</ButtonLink>
              <ButtonLink href="/ventures" variant="secondary">
                Explore the ventures
              </ButtonLink>
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
