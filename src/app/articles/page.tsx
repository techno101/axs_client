import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ArrowUpRightIcon } from "@/components/ui/icons";
import { configuredApiOrigin, createHttpPublicClient } from "@/lib/api/http-client";
import { images } from "@/lib/content";

export const metadata: Metadata = {
  title: "Field notes",
  description: "Published ArmourXSports booking guides and field notes.",
};
export const dynamic = "force-dynamic";

export default async function ArticlesPage() {
  const articles = await createHttpPublicClient(configuredApiOrigin()).getArticles();
  return (
    <>
      <PageHero
        eyebrow="Field notes"
        title={<>Ideas beyond<br />the touchline.</>}
        intro="Booking guides and operational notes published through the structured ArmourXSports CMS."
        image={images.texturedPitch}
        imageAlt="Aerial view of a football pitch"
      />
      <section className="articles-section">
        <div className="shell article-grid">
          {articles.map((article, index) => (
            <article className={index === 0 ? "article-card article-card--featured" : "article-card"} key={article.slug}>
              <Link href={`/articles/${article.slug}`}>
                <div className="article-card__image"><Image src={article.image} alt={article.imageAlt} fill sizes={index === 0 ? "70vw" : "40vw"} /></div>
                <div className="article-card__copy">
                  <p>{article.category}<span>{article.readTime}</span></p>
                  <h2>{article.title}</h2>
                  <span>{article.excerpt}</span>
                  <i><ArrowUpRightIcon /></i>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
