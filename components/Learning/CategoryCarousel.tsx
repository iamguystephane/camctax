"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import CategoryTile from "./CategoryTile";
import type { Category } from "@/lib/learning";

type CategoryWithCount = {
  category: Category;
  count: number;
};

export default function CategoryCarousel({ categories }: { categories: CategoryWithCount[] }) {
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const checkScrollability = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => {
    checkScrollability();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
      window.addEventListener("resize", checkScrollability);
      return () => {
        container.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [categories]);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    // Get the first card element to calculate its actual width
    const firstCard = container.querySelector('div[class*="flex-shrink-0"]') as HTMLElement;
    if (!firstCard) return;
    
    const cardWidth = firstCard.offsetWidth;
    const gap = window.innerWidth >= 1024 ? 24 : window.innerWidth >= 640 ? 24 : 16;
    const scrollAmount = cardWidth + gap;
    
    const targetScroll = direction === "left" 
      ? container.scrollLeft - scrollAmount 
      : container.scrollLeft + scrollAmount;
    
    container.scrollTo({
      left: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group">
      {/* Left Arrow */}
      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent z-10 flex items-center pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg pointer-events-auto ml-2"
            onClick={() => scroll("left")}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </div>
      )}

      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x snap-mandatory justify-center lg:justify-start"
      >
        {categories.map((c) => (
          <div key={c.category} className="flex-shrink-0 w-[85%] sm:w-[48%] lg:w-[calc((100%-3rem)/3)] snap-start">
            <CategoryTile category={c.category} count={c.count} />
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent z-10 flex items-center justify-end pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full shadow-lg pointer-events-auto mr-2"
            onClick={() => scroll("right")}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      )}

    </div>
  );
}

