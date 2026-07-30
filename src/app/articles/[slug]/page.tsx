import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRightIcon } from "@/components/ui/icons";
import { createServerPublicClient } from "@/lib/api/server-client";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

function client() { return createServerPublicClient(); }

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await client().getArticle(slug);
  return article ? { title: article.title, description: article.excerpt } : { title: "Article not found" };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await client().getArticle(slug);
  if (!article) notFound();

  return (
    <article className="article-detail">
      <header className="article-detail__header shell">
        <p>{article.category} · {article.readTime}</p>
        <h1>{article.title}</h1>
        <span>{article.excerpt}</span>
        <small>{article.publishedLabel} · Published field note</small>
      </header>
      <div className="article-detail__image shell"><Image src={article.image} alt={article.imageAlt} fill priority sizes="100vw" /></div>
      <div className="article-detail__body shell">
        <aside><span>In this note</span>{article.body.map((section) => <a href={`#${section.heading.toLowerCase().replaceAll(" ", "-")}`} key={section.heading}>{section.heading}</a>)}</aside>
        <div>
          {article.body.map((section) => (
            <section id={section.heading.toLowerCase().replaceAll(" ", "-")} key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </section>
          ))}
          <Link href="/articles">Back to field notes <ArrowRightIcon /></Link>
        </div>
      </div>
    </article>
  );
}
