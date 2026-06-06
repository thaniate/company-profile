import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { constructMetadata } from "@/lib/metadata";
import { PortfolioItem } from "@/lib/types";
import { ArrowLeft, ArrowRight, Calendar, Tag } from "lucide-react";
import type { Metadata } from "next";

// ─── Static params ────────────────────────────────────────────────────────────
export async function generateStaticParams() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("slug")
    .not("slug", "is", null);

  return (data ?? []).map((item) => ({ slug: item.slug }));
}

// ─── Dynamic metadata ─────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("title, description, image_url")
    .eq("slug", params.slug)
    .single();

  if (!data) return constructMetadata();

  return constructMetadata({
    title: data.title,
    description: data.description,
    image: data.image_url ?? undefined,
  });
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────
async function getProject(slug: string): Promise<PortfolioItem | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolio_items")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

async function getAdjacentProjects(currentId: string, orderIndex: number) {
  const supabase = await createClient();

  const [prev, next] = await Promise.all([
    supabase
      .from("portfolio_items")
      .select("title, slug")
      .lt("order_index", orderIndex)
      .not("slug", "is", null)
      .order("order_index", { ascending: false })
      .limit(1)
      .single(),
    supabase
      .from("portfolio_items")
      .select("title, slug")
      .gt("order_index", orderIndex)
      .not("slug", "is", null)
      .neq("id", currentId)
      .order("order_index", { ascending: true })
      .limit(1)
      .single(),
  ]);

  return {
    prev: prev.data ?? null,
    next: next.data ?? null,
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function ProjectPage({
  params,
}: {
  params: { slug: string };
}) {
  const project = await getProject(params.slug);
  if (!project) notFound();

  const { prev, next } = await getAdjacentProjects(
    project.id,
    project.order_index
  );

  const formattedDate = new Date(project.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" }
  );

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative min-h-[60vh] flex items-end overflow-hidden bg-surface">
        {project.image_url ? (
          <>
            <Image
              src={project.image_url}
              alt={project.title}
              fill
              priority
              className="object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 border border-border rotate-45" />
          </div>
        )}

        {/* Back button */}
        <div className="absolute top-8 left-6 z-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-muted hover:text-cream text-xs tracking-widest uppercase font-mono transition-colors group"
          >
            <ArrowLeft
              size={13}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
            Back to Work
          </Link>
        </div>

        {/* Title block */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          {/* Tags */}
          {project.tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <Tag size={11} className="text-gold" />
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-gold text-xs tracking-widest uppercase font-mono"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display text-5xl md:text-7xl text-cream leading-tight max-w-3xl">
            {project.title}
          </h1>

          {/* Meta row */}
          <div className="flex items-center gap-6 mt-5">
            <div className="flex items-center gap-2 text-muted text-xs font-mono">
              <Calendar size={12} />
              {formattedDate}
            </div>
            <span className="w-px h-3 bg-border" />
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold" />
              <span className="text-muted text-xs font-mono tracking-wide">
                Case Study
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-10">
            {/* Divider */}
            <div className="flex items-center gap-4">
              <span className="gold-line" />
              <span className="text-gold text-xs tracking-[0.3em] uppercase font-mono">
                Project Overview
              </span>
            </div>

            {/* Description */}
            <div className="space-y-5">
              {project.description.split("\n").map((para, i) =>
                para.trim() ? (
                  <p
                    key={i}
                    className="text-muted text-lg leading-relaxed"
                  >
                    {para}
                  </p>
                ) : null
              )}
            </div>

            {/* Full image */}
            {project.image_url && (
              <div className="relative aspect-video border border-border overflow-hidden bg-surface mt-10">
                <Image
                  src={project.image_url}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-gold" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-gold" />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="border border-border p-6 space-y-6 sticky top-24">
              <h3 className="font-display text-xl text-cream">
                Project Details
              </h3>

              <div className="w-full h-px bg-border" />

              {/* Tags */}
              {project.tags.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs tracking-widest uppercase font-mono text-muted/50">
                    Categories
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="border border-border text-muted text-xs font-mono px-3 py-1 tracking-wide"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="space-y-2">
                <p className="text-xs tracking-widest uppercase font-mono text-muted/50">
                  Published
                </p>
                <p className="text-cream text-sm font-mono">{formattedDate}</p>
              </div>

              {/* CTA */}
              <div className="pt-2 border-t border-border">
                <Link
                  href="/#contact"
                  className="w-full flex items-center justify-center gap-2 border border-gold text-gold hover:bg-gold hover:text-background px-4 py-3 text-xs tracking-widest uppercase font-mono transition-all duration-300 group"
                >
                  Start a Similar Project
                  <ArrowRight
                    size={12}
                    className="group-hover:translate-x-0.5 transition-transform"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Adjacent projects ── */}
      {(prev || next) && (
        <section className="border-t border-border">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 divide-x divide-border">
              {/* Prev */}
              <div>
                {prev ? (
                  <Link
                    href={`/projects/${prev.slug}`}
                    className="flex flex-col gap-2 p-8 group hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center gap-2 text-muted text-xs font-mono tracking-widest uppercase">
                      <ArrowLeft
                        size={12}
                        className="group-hover:-translate-x-0.5 transition-transform"
                      />
                      Previous
                    </div>
                    <p className="font-display text-xl text-cream group-hover:text-gold transition-colors line-clamp-1">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <div className="p-8" />
                )}
              </div>

              {/* Next */}
              <div>
                {next ? (
                  <Link
                    href={`/projects/${next.slug}`}
                    className="flex flex-col gap-2 p-8 text-right group hover:bg-surface transition-colors"
                  >
                    <div className="flex items-center justify-end gap-2 text-muted text-xs font-mono tracking-widest uppercase">
                      Next
                      <ArrowRight
                        size={12}
                        className="group-hover:translate-x-0.5 transition-transform"
                      />
                    </div>
                    <p className="font-display text-xl text-cream group-hover:text-gold transition-colors line-clamp-1">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <div className="p-8" />
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
