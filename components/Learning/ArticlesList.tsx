"use client";

import { useState, useMemo } from "react";
import { getAllPostsMeta, type Category } from "@/lib/learning";
import { categoryToIntent } from "@/lib/learning-utils";
import PostCard from "@/components/Learning/PostCard";
import StartCta from "@/components/Learning/StartCta";
import CategoryFilter from "@/components/Learning/CategoryFilter";

type Props = {
  initialCategory?: Category | "all";
};

export default function ArticlesList({ initialCategory = "all" }: Props) {
  const allPosts = getAllPostsMeta();
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">(initialCategory);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === "all") {
      return allPosts;
    }
    return allPosts.filter((post) => post.category === selectedCategory);
  }, [allPosts, selectedCategory]);

  return (
    <>
      <div className="flex justify-center max-w-7xl mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {filteredPosts.map((p) => (
            <PostCard key={p.slug} post={p} />
          ))}
        </div>
      </div>
      {/* CTA at the end of articles */}
      {filteredPosts.length > 0 && (
        <div className="max-w-7xl mx-auto mt-10">
          <div className="bg-linear-to-br from-primaryColor to-secondaryColor rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <h3 className="text-xl font-display font-semibold text-slate-900 mb-3 text-center">
              Ready to get started?
            </h3>
            <p className="text-slate-600 mb-6 text-center">
              Let us help you navigate the process and get your business compliant.
            </p>
            <div className="flex justify-center">
              <StartCta
                leadSourceDetail={`learning_articles_end_${selectedCategory === "all" ? "all" : selectedCategory}`}
                intentPrimary={selectedCategory !== "all" ? categoryToIntent(selectedCategory) : undefined}
                className="w-full sm:w-auto"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}


