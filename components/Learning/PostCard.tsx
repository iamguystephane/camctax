import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { LearningPostMeta } from "@/lib/learning";
import { ArrowRight, Calendar, Clock } from "lucide-react";

const CATEGORY_LABELS: Record<LearningPostMeta["category"], string> = {
  registration: "Registration",
  taxes: "Taxes",
  "merchant-accounts": "Merchant Accounts",
  compliance: "Compliance",
};

export default function PostCard({ post }: { post: LearningPostMeta }) {
  const date = new Date(post.publishedAt);
  const formattedDate = date.toLocaleDateString(undefined, { 
    year: "numeric", 
    month: "short", 
    day: "numeric" 
  });
  
  return (
    <Link 
      href={`/learning/${post.slug}`} 
      className="block h-full group"
      aria-label={`Read article: ${post.title}`}
    >
      <Card className="h-full flex flex-col bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-lg hover:border-slate-300 transition-all duration-200 overflow-hidden">
        <CardHeader className="pb-3 pt-5 px-5">
          {/* Category Badge */}
          <div className="mb-3">
            <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-secondaryColor text-slate-700 rounded-full">
              {CATEGORY_LABELS[post.category]}
            </span>
          </div>
          
          {/* Title */}
          <CardTitle className="text-lg font-semibold text-slate-900 leading-snug mb-3 line-clamp-2 group-hover:text-slate-800 transition-colors">
            {post.title}
          </CardTitle>
          
          {/* Metadata */}
          <div className="flex items-center gap-3 text-xs text-slate-500 font-normal">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <time dateTime={post.publishedAt} className="text-slate-500">
                {formattedDate}
              </time>
            </div>
            <span className="text-slate-300">•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500">{post.readingTimeMinutes} min read</span>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col px-5 pb-5 pt-0">
          {/* Summary */}
          <p className="text-sm text-slate-600 leading-relaxed mb-4 line-clamp-3 flex-1">
            {post.summary}
          </p>
          
          {/* Read Article Link */}
          <div className="pt-3 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-sm font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
              <span>Read article</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
