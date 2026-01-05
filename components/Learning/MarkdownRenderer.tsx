type Props = { content: string };

function toHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, "\n").split("\n");
  const parts: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (/^\s*$/.test(line)) {
      i++;
      continue;
    }
    // Check for tables (starts with |)
    if (/^\|/.test(line)) {
      const tableRows: string[] = [];
      let isHeader = true;
      while (i < lines.length && /^\|/.test(lines[i])) {
        const row = lines[i].trim();
        if (/^\|[-:]+\|/.test(row)) {
          // Skip separator row
          i++;
          continue;
        }
        const cells = row
          .split("|")
          .map((c) => c.trim())
          .filter((c) => c.length > 0);
        if (cells.length > 0) {
          const cellTags = cells.map((cell) => {
            const content = inline(cell);
            return isHeader
              ? `<th class="px-4 py-2 text-left font-semibold border-b">${content}</th>`
              : `<td class="px-4 py-2 border-b">${content}</td>`;
          });
          tableRows.push(`<tr>${cellTags.join("")}</tr>`);
          isHeader = false;
        }
        i++;
      }
      if (tableRows.length > 0) {
        parts.push(
          `<div class="overflow-x-auto my-6"><table class="min-w-full border-collapse border border-slate-200 rounded-lg">${tableRows.join("")}</table></div>`
        );
      }
      continue;
    }
    if (/^###\s+/.test(line)) {
      parts.push(`<h3 class="text-xl font-display font-semibold mt-8 mb-3 text-slate-900">${inline(line.replace(/^###\s+/, ""))}</h3>`);
      i++;
      continue;
    }
    if (/^##\s+/.test(line)) {
      parts.push(`<h2 class="text-2xl font-display font-bold mt-10 mb-4 text-slate-900 border-b border-slate-200 pb-2">${inline(line.replace(/^##\s+/, ""))}</h2>`);
      i++;
      continue;
    }
    if (/^#\s+/.test(line)) {
      parts.push(`<h1 class="text-3xl font-display font-bold mt-12 mb-6 text-slate-900">${inline(line.replace(/^#\s+/, ""))}</h1>`);
      i++;
      continue;
    }
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li class="mb-1">${inline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i++;
      }
      parts.push(`<ul class="list-disc ml-6 my-5 space-y-2 text-slate-700">${items.join("")}</ul>`);
      continue;
    }
    const para: string[] = [];
    while (i < lines.length && !/^\s*$/.test(lines[i]) && !/^\|/.test(lines[i])) {
      para.push(lines[i]);
      i++;
    }
    if (para.length > 0) {
      const text = inline(para.join(" "));
      parts.push(`<p class="my-5 leading-8 text-slate-700 text-base">${text}</p>`);
    }
  }
  return parts.join("\n");
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function inline(s: string) {
  let out = escapeHtml(s);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  // Handle links - check if internal or external
  out = out.replace(/\[(.+?)\]\((.+?)\)/g, (match, text, url) => {
    const isExternal = url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
    if (isExternal) {
      return `<a href="${url}" class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium" target="_blank" rel="noreferrer noopener">${text}</a>`;
    } else {
      return `<a href="${url}" class="text-primary underline underline-offset-4 hover:text-primary/80 transition-colors font-medium">${text}</a>`;
    }
  });
  return out;
}

export default function MarkdownRenderer({ content }: Props) {
  const html = toHtml(content);
  return (
    <div
      className="article-content max-w-none"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
