"use client";

import { useState, useMemo } from "react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import type { LearningPostMeta, Category } from "@/lib/learning";
import { categoryToIntent } from "@/lib/learning-utils";
import PostCard from "@/components/Learning/PostCard";
import StartCta from "@/components/Learning/StartCta";
import CategoryFilter from "@/components/Learning/CategoryFilter";

type Props = {
  initialPosts: LearningPostMeta[];
};

export default function LearningPageClient({ initialPosts }: Props) {
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return initialPosts;
    }
    return initialPosts.filter((post) => post.category === selectedCategory);
  }, [initialPosts, selectedCategory]);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-background">
      <Nav />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative border-b bg-linear-to-br from-primaryColor via-secondaryColor to-primaryColor overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-primaryColor/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondaryColor/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20 py-8 sm:py-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-8 max-w-7xl mx-auto">
              <div className="flex-1 max-w-3xl">
                {/* Badge and Filter */}
                <div className="flex items-center gap-3 mb-4 flex-wrap">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-sm text-green-300 rounded-full text-sm font-medium border border-primary/20 shadow-sm">
                    <span className="w-2 h-2 bg-secondaryColor rounded-full animate-pulse"></span>
                    Free Learning Resources
                  </div>
                  <CategoryFilter
                    selectedCategory={selectedCategory}
                    onCategoryChange={setSelectedCategory}
                  />
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-slate-900 mb-3 leading-tight tracking-tight">
                  Learning Hub
                </h1>

                {/* Description */}
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed mb-4 max-w-2xl">
                  Practical, plain-language guides to help you register your business, stay compliant on taxes, and set up merchant accounts in Cameroon.
                </p>

                {/* Features list */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Step-by-step guides</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Plain language</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Updated regularly</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Articles Section */}
        <section className="py-6 sm:py-8">
          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-16 2xl:px-20">
            <div className="mb-4 text-center max-w-7xl mx-auto">
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-slate-900 mb-2">
                {selectedCategory === "all" ? "All Articles" : `${filteredPosts.length} Article${filteredPosts.length === 1 ? "" : "s"}`}
              </h2>
              <p className="text-slate-600">Browse our collection of guides and resources</p>
            </div>
            {filteredPosts.length > 0 ? (
              <>
                <div className="flex justify-center max-w-7xl mx-auto">
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
                    {filteredPosts.map((p) => (
                      <PostCard key={p.slug} post={p} />
                    ))}
                  </div>
                </div>
                {/* Main CTA at the end of articles section */}
                {/* <div className="max-w-7xl mx-auto mt-8">
                  <div className="bg-gradient-to-br from-primaryColor to-secondaryColor rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-display font-semibold text-slate-900 mb-3 text-center">
                      Ready to get started?
                    </h3>
                    <p className="text-slate-600 mb-6 text-center">
                      Let us help you navigate the process and get your business compliant.
                    </p>
                    <div className="flex justify-center">
                      <StartCta
                        leadSourceDetail={`learning_landing_articles_end_${selectedCategory === "all" ? "all" : selectedCategory}`}
                        intentPrimary={selectedCategory !== "all" ? categoryToIntent(selectedCategory) : undefined}
                        className="w-full sm:w-auto"
                      />
                    </div>
                  </div>
                </div> */}
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-500 mb-4">No articles available in this category yet. Check back soon!</p>
                <StartCta
                  leadSourceDetail={`learning_landing_empty_${selectedCategory === "all" ? "all" : selectedCategory}`}
                  intentPrimary={selectedCategory !== "all" ? categoryToIntent(selectedCategory) : undefined}
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
}

