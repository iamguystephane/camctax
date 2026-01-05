import fs from "fs";
import path from "path";

export type Category = "registration" | "taxes" | "merchant-accounts" | "compliance";

export type LearningPostMeta = {
  title: string;
  slug: string;
  category: Category;
  summary: string;
  publishedAt: string;
  readingTimeMinutes: number;
};

export type LearningPost = LearningPostMeta & { content: string };

const CONTENT_DIR = path.join(process.cwd(), "content", "learning");
export const CATEGORIES: Category[] = [
  "registration",
  "taxes",
  "merchant-accounts",
  "compliance",
];

function listMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files: string[] = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...listMarkdownFiles(full));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".md")) files.push(full);
  }
  return files;
}

function parseFrontmatter(raw: string): { meta: Partial<LearningPostMeta>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\n+/, "");
  const meta: Record<string, any> = {};
  for (const line of fm.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (key === "readingTimeMinutes") {
      const num = Number(val);
      meta[key] = Number.isFinite(num) ? num : undefined;
    } else {
      meta[key] = val;
    }
  }
  return { meta, body };
}

function computeReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function ensureCategory(val: any): Category | undefined {
  return CATEGORIES.includes(val as Category) ? (val as Category) : undefined;
}

export function getAllPostsMeta(): LearningPostMeta[] {
  const files = listMarkdownFiles(CONTENT_DIR);
  const posts: LearningPostMeta[] = [];
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const category = ensureCategory(meta.category);
    const slug = (meta.slug as string) || path.basename(file, ".md");
    const reading = meta.readingTimeMinutes ?? computeReadingTime(body);
    if (!meta.title || !category || !meta.summary || !meta.publishedAt || !slug) continue;
    posts.push({
      title: String(meta.title),
      slug,
      category,
      summary: String(meta.summary),
      publishedAt: String(meta.publishedAt),
      readingTimeMinutes: Number(reading),
    });
  }
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getRecentPosts(limit = 6): LearningPostMeta[] {
  return getAllPostsMeta().slice(0, limit);
}

export function getPostsByCategory(category: Category): LearningPostMeta[] {
  return getAllPostsMeta().filter((p) => p.category === category);
}

export function getCategoriesWithCounts(): { category: Category; count: number }[] {
  return CATEGORIES.map((c) => ({ category: c, count: getPostsByCategory(c).length }));
}

export function getPostBySlug(slug: string): LearningPost | undefined {
  const files = listMarkdownFiles(CONTENT_DIR);
  for (const file of files) {
    const raw = fs.readFileSync(file, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    const fmSlug = (meta.slug as string) || path.basename(file, ".md");
    if (fmSlug === slug) {
      const category = ensureCategory(meta.category);
      if (!meta.title || !category || !meta.summary || !meta.publishedAt) return undefined;
      const reading = meta.readingTimeMinutes ?? computeReadingTime(body);
      return {
        title: String(meta.title),
        slug: fmSlug,
        category,
        summary: String(meta.summary),
        publishedAt: String(meta.publishedAt),
        readingTimeMinutes: Number(reading),
        content: body,
      };
    }
  }
  return undefined;
}

export function getAllSlugs(): string[] {
  return getAllPostsMeta().map((p) => p.slug);
}

export function getRelatedPosts(currentSlug: string, category: Category, limit = 3): LearningPostMeta[] {
  return getAllPostsMeta()
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit);
}

export function categoryToIntent(category: Category): "registration_fix" | "tax_records" | "merchant_account" {
  if (category === "merchant-accounts") return "merchant_account";
  if (category === "taxes") return "tax_records";
  if (category === "compliance") return "tax_records";
  return "registration_fix";
}
