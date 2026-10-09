import Image from "next/image";
import type { Project } from "@/content/work";
import { getVenture } from "@/content/ventures";

/** Renders an approved project. Only used when real entries exist in content/work.ts. */
export function ProjectCard({ project }: { project: Project }) {
  const cover = project.images[0];
  const venture = getVenture(project.category);
  return (
    <article className="flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone">
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        ) : null}
      </div>
      <p className="eyebrow mt-5 text-teal">
        {venture.chapter}
        {project.year ? ` · ${project.year}` : ""}
      </p>
      <h3 className="mt-3 font-display text-[1.6rem] leading-tight tracking-tight">{project.title}</h3>
      <p className="mt-3 text-[0.97rem] leading-relaxed text-muted">{project.summary}</p>
      <dl className="mt-5 grid gap-2 border-t border-line pt-4 text-[0.9rem]">
        <div className="flex gap-3">
          <dt className="w-28 shrink-0 text-muted">Role</dt>
          <dd>{project.role}</dd>
        </div>
        <div className="flex gap-3">
          <dt className="w-28 shrink-0 text-muted">Deliverables</dt>
          <dd>{project.deliverables.join(", ")}</dd>
        </div>
        {project.results?.length ? (
          <div className="flex gap-3">
            <dt className="w-28 shrink-0 text-muted">Results</dt>
            <dd>{project.results.join("; ")}</dd>
          </div>
        ) : null}
      </dl>
    </article>
  );
}
