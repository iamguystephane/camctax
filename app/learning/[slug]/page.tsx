export const dynamic = "force-dynamic";

import { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  CATEGORIES,
  categoryToIntent,
  getAllSlugs,
  getPostBySlug,
  getPostsByCategory,
  getRelatedPosts,
  type Category,
} from "@/lib/learning";
import MarkdownRenderer from "@/components/Learning/MarkdownRenderer";
import StartCta from "@/components/Learning/StartCta";
import LearningSourceTracker from "@/components/Learning/LearningSourceTracker";
import { notFound } from "next/navigation";
import PostCard from "@/components/Learning/PostCard";
import { ChevronRight, Calendar, Clock } from "lucide-react";

export const dynamicParams = true; // Allow dynamic params in dev mode

export async function generateStaticParams() {
  const articleSlugs = getAllSlugs().map((slug) => ({ slug }));
  const categorySlugs = CATEGORIES.map((slug) => ({ slug }));
  return [...categorySlugs, ...articleSlugs];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (CATEGORIES.includes(slug as Category)) {
    const label = slug === "merchant-accounts" ? "Merchant Accounts" : slug === "taxes" ? "Taxes" : slug === "compliance" ? "Compliance" : "Registration";
    const posts = getPostsByCategory(slug as Category);
    return {
      title: `${label} | Learning Hub | Cameroon Tax Assistant`,
      description: `Explore ${posts.length} article${posts.length === 1 ? "" : "s"} about ${label.toLowerCase()} in Cameroon. Practical guides for business compliance and registration.`,
      openGraph: {
        title: `${label} | Learning Hub`,
        description: `Articles about ${label.toLowerCase()} in Cameroon.`,
        type: "website",
      },
    };
  } else {
    const post = getPostBySlug(slug);
    if (!post) return {};
    const categoryLabel = post.category === "merchant-accounts" ? "Merchant Accounts" : post.category === "taxes" ? "Taxes" : post.category === "compliance" ? "Compliance" : "Registration";
    return {
      title: `${post.title} | Learning Hub | Cameroon Tax Assistant`,
      description: post.summary,
      openGraph: {
        title: post.title,
        description: post.summary,
        type: "article",
        publishedTime: post.publishedAt,
        section: categoryLabel,
      },
    };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (CATEGORIES.includes(slug as Category)) {
    const category = slug as Category;
    const posts = getPostsByCategory(category);
    const label = category === "merchant-accounts" ? "Merchant Accounts" : category === "taxes" ? "Taxes" : category === "compliance" ? "Compliance" : "Registration";
    const intent = categoryToIntent(category);
    return (
      <div className="min-h-screen flex flex-col font-sans bg-background">
        <Nav />
        <LearningSourceTracker slug={category} category={category} />
        <main className="flex-1">
          {/* Category Header */}
          <section className="border-b bg-linear-to-br from-slate-50 to-white">
            <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 py-6 sm:py-8 bg-linear-to-br from-primaryColor via-secondaryColor to-primaryColor overflow-hidden">
              <div className="flex flex-col max-w-7xl mx-auto gap-4">
                <nav className="flex items-center text-sm text-slate-500">
                  <Link
                    href="/learning"
                    className="hover:text-primary transition-colors"
                  >
                    Learning Hub
                  </Link>
                  <ChevronRight className="w-4 h-4 mx-2" />
                  <span className="text-slate-700">{label}</span>
                </nav>
                <h1 className="text-3xl sm:text-4xl font-display font-bold text-slate-900">
                  {label}
                </h1>
                <p className="text-base sm:text-lg text-slate-600">
                  {posts.length} article{posts.length === 1 ? "" : "s"}{" "}
                  available
                </p>
              </div>
            </div>
          </section>

          {/* Articles Grid */}
          <section className="py-6 sm:py-8">
            <div className="w-full px-4 max-w-7xl mx-auto">
              {posts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {posts.map((p) => (
                      <PostCard key={p.slug} post={p} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-slate-500 mb-4">
                    No articles in this category yet.
                  </p>
                  <StartCta
                    leadSourceDetail={`learning_category_${category}_empty`}
                    intentPrimary={intent}
                    className="justify-center"
                  />
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  } else {
    const post = getPostBySlug(slug);
    if (!post) return notFound();
    const intent = categoryToIntent(post.category);
    const categoryLabel = post.category === "merchant-accounts" ? "Merchant Accounts" : post.category === "taxes" ? "Taxes" : post.category === "compliance" ? "Compliance" : "Registration";
    const publishedDate = new Date(post.publishedAt);
    const relatedPosts = getRelatedPosts(post.slug, post.category, 3);
    
    return (
      <div className="min-h-screen flex flex-col font-sans bg-background">
        <Nav />
        <LearningSourceTracker slug={post.slug} />
        <main className="flex-1">
          <article className="w-full">
            {/* Breadcrumb */}
            <div className="bg-linear-to-br from-primaryColor via-secondaryColor to-primaryColor overflow-hidden py-8 px-4">
              <nav className="flex items-center text-sm text-slate-500 mb-8 max-w-7xl mx-auto ">
                <Link
                  href="/learning"
                  className="hover:text-primary transition-colors"
                >
                  Learning Hub
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <Link
                  href={`/learning/${post.category}`}
                  className="hover:text-primary transition-colors"
                >
                  {categoryLabel}
                </Link>
                <ChevronRight className="w-4 h-4 mx-2" />
                <span className="text-slate-700 line-clamp-1">{post.title}</span>
              </nav>
              {/* Article Header */}
              <header className="">
                <div className="max-w-7xl mx-auto">
                  <div className="">
                    <Link
                      href={`/learning/${post.category}`}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-medium bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors"
                    >
                      {categoryLabel}
                    </Link>
                  </div>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                    {post.title}
                  </h1>
                  <p className="text-lg sm:text-xl text-slate-600 mb-4 leading-relaxed">
                    {post.summary}
                  </p>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={post.publishedAt}>
                        {publishedDate.toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>
                    </div>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{post.readingTimeMinutes} min read</span>
                    </div>
                  </div>
              
                </div>
              </header>
            </div>

            {/* Article Content */}
            <div className="prose-wrapper mb-6 mt-2">
              <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
                  <div className="max-w-6xl mx-auto px-4">
                    <MarkdownRenderer content={post.content} />
                  </div>
                </div>
              </div>
            </div>

            {/* Main CTA at the end of article content */}
            {/* <div className="max-w-7xl mx-auto mb-6 px-4">
              <div className="bg-gradient-to-br from-primaryColor to-secondaryColor rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                <h3 className="text-xl font-display font-semibold text-slate-900 mb-3 text-center">
                  Ready to get started?
                </h3>
                <p className="text-slate-600 mb-6 text-center">
                  Let us help you navigate the process and get your business compliant.
                </p>
                <div className="flex justify-center">
                  <StartCta
                    leadSourceDetail={`learning_article_${post.slug}`}
                    intentPrimary={intent}
                    className="w-full sm:w-auto"
                  />
                </div>
              </div>
            </div> */}

            {/* Related Articles */}
            {relatedPosts.length > 0 && (
              <div className="border-t border-slate-200 py-6 mt-6">
                <div className="max-w-7xl mx-auto px-4">
                  <h2 className="text-2xl font-display font-bold text-slate-900 mb-4">
                    More from {categoryLabel}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {relatedPosts.map((relatedPost) => (
                      <PostCard key={relatedPost.slug} post={relatedPost} />
                    ))}
                  </div>
                  <div className="mt-4 text-center">
                    <Link
                      href={`/learning/${post.category}`}
                      className="inline-flex items-center text-primary font-medium hover:underline"
                    >
                      View all {categoryLabel.toLowerCase()} articles
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                  
                
                </div>
              </div>
            )}
          </article>
        </main>
        <Footer />
      </div>
    );
  }
}
