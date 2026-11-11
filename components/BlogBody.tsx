import { ServiceInlineImage, ServiceFeaturedImage } from "@/components/ServiceImages";
import { ServiceTableView } from "@/components/ServiceContentBlocks";
import { richTextNodes } from "@/components/RichText";
import type { ServiceImageSet } from "@/lib/service-images";
import { mediaUrl } from "@/lib/media";

type InlineBlock =
  | { type: "h3"; text: string; id: string }
  | { type: "p"; text: string }
  | { type: "ul" | "ol"; items: string[] }
  | { type: "checklist"; items: { checked: boolean; text: string }[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][] };

/** Package PLP assets live on R2 under media/; bodies keep /images/plp/… paths. */
function resolveBodyImageSrc(src: string): string {
  if (src.startsWith("/images/plp/")) {
    return mediaUrl(src.replace(/^\//, ""));
  }
  if (src.startsWith("images/plp/")) {
    return mediaUrl(src);
  }
  return src;
}

type Section = {
  heading?: string;
  id?: string;
  level: 2 | 3;
  blocks: InlineBlock[];
};

function slugifyHeading(text: string, idx: number): string {
  const base = text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "")
    .slice(0, 60);
  return base || `s-${idx}`;
}

function parseSections(body: string): Section[] {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const sections: Section[] = [];
  let current: Section = { level: 2, blocks: [] };
  sections.push(current);
  let i = 0;
  let hIdx = 0;

  const pushPara = (text: string) => {
    current.blocks.push({ type: "p", text });
  };

  while (i < lines.length) {
    const trimmed = lines[i].trim();
    if (!trimmed) {
      i++;
      continue;
    }
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      hIdx++;
      current = {
        heading: trimmed.slice(3).trim(),
        id: slugifyHeading(trimmed.slice(3), hIdx),
        level: 2,
        blocks: [],
      };
      sections.push(current);
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      hIdx++;
      current.blocks.push({
        type: "h3",
        text: trimmed.slice(4).trim(),
        id: slugifyHeading(trimmed.slice(4), hIdx),
      });
      i++;
      continue;
    }
    if (trimmed.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i].trim());
        i++;
      }
      const rows = tableLines
        .filter((l) => !/^\|\s*-/.test(l))
        .map((l) =>
          l
            .replace(/^\|/, "")
            .replace(/\|$/, "")
            .split("|")
            .map((c) => c.trim())
        );
      if (rows.length >= 2) {
        current.blocks.push({
          type: "table",
          headers: rows[0],
          rows: rows.slice(1),
        });
      }
      continue;
    }
    const img = trimmed.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (img) {
      let caption: string | undefined;
      if (i + 1 < lines.length) {
        const next = lines[i + 1].trim();
        const cap = next.match(/^\*(.+)\*$/);
        if (cap) {
          caption = cap[1].trim();
          i += 1;
        }
      }
      current.blocks.push({
        type: "image",
        alt: img[1],
        src: img[2],
        caption,
      });
      i++;
      continue;
    }
    if (/^[-*] \[[ xX]\] /.test(trimmed)) {
      const items: { checked: boolean; text: string }[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        const m = t.match(/^[-*] \[([ xX])\] (.+)$/);
        if (!m) break;
        items.push({ checked: m[1].toLowerCase() === "x", text: m[2] });
        i++;
      }
      current.blocks.push({ type: "checklist", items });
      continue;
    }
    if (/^[-*] /.test(trimmed) || /^\d+\. /.test(trimmed)) {
      const ordered = /^\d+\. /.test(trimmed);
      const items: string[] = [];
      while (i < lines.length) {
        const t = lines[i].trim();
        if (!t) break;
        if (ordered && /^\d+\. /.test(t)) {
          items.push(t.replace(/^\d+\.\s+/, ""));
          i++;
          continue;
        }
        // Checklist items (`- [ ]` / `- [x]`) are handled above. Markdown
        // link bullets (`- [label](/path)`) must still count as list items —
        // excluding `^[-*] \[` here caused an infinite loop (i never advanced).
        if (!ordered && /^[-*] /.test(t) && !/^[-*] \[[ xX]\] /.test(t)) {
          items.push(t.replace(/^[-*]\s+/, ""));
          i++;
          continue;
        }
        break;
      }
      current.blocks.push({ type: ordered ? "ol" : "ul", items });
      continue;
    }
    const paras: string[] = [trimmed];
    i++;
    while (i < lines.length) {
      const t = lines[i].trim();
      if (!t) break;
      if (
        t.startsWith("#") ||
        t.startsWith("|") ||
        /^[-*] /.test(t) ||
        /^\d+\. /.test(t)
      ) {
        break;
      }
      paras.push(t);
      i++;
    }
    pushPara(paras.join(" "));
  }

  return sections.filter((s) => s.heading || s.blocks.length > 0);
}

export function blogTocFromBody(body: string): { id: string; title: string }[] {
  return parseSections(body)
    .filter((s) => s.level === 2 && s.heading && s.id)
    .map((s) => ({ id: s.id!, title: s.heading! }));
}

function renderInlineBlocks(blocks: InlineBlock[]) {
  return blocks.map((block, idx) => {
    if (block.type === "h3") {
      return (
        <h3
          key={`${block.id}-${idx}`}
          id={block.id}
          className="text-lg font-bold leading-persian-tight scroll-mt-28 mt-6 mb-3"
        >
          {block.text}
        </h3>
      );
    }
    if (block.type === "p") {
      return (
        <p
          key={`p-${idx}`}
          className="text-muted-foreground leading-persian text-justify mb-3"
        >
          {richTextNodes(block.text)}
        </p>
      );
    }
    if (block.type === "ul" || block.type === "ol") {
      const Tag = block.type;
      return (
        <Tag
          key={`list-${idx}`}
          className={
            block.type === "ol"
              ? "list-decimal list-inside space-y-2 text-muted-foreground leading-persian mb-3"
              : "list-disc list-inside space-y-2 text-muted-foreground leading-persian mb-3"
          }
        >
          {block.items.map((item, j) => (
            <li key={`${idx}-${j}`}>{richTextNodes(item)}</li>
          ))}
        </Tag>
      );
    }
    if (block.type === "checklist") {
      return (
        <ul
          key={`check-${idx}`}
          className="space-y-2 text-muted-foreground leading-persian mb-3 list-none"
        >
          {block.items.map((item, j) => (
            <li key={`${idx}-${j}`} className="flex gap-2">
              <span aria-hidden className="text-accent shrink-0">
                {item.checked ? "✓" : "○"}
              </span>
              <span>{richTextNodes(item.text)}</span>
            </li>
          ))}
        </ul>
      );
    }
    if (block.type === "image") {
      const caption = block.caption || block.alt;
      return (
        <figure
          key={`img-${idx}`}
          className="my-6 mx-auto flex w-full max-w-3xl flex-col items-center"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveBodyImageSrc(block.src)}
            alt={block.alt}
            className="mx-auto h-auto w-full object-contain"
            loading="lazy"
          />
          {caption ? (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground leading-persian">
              {caption}
            </figcaption>
          ) : null}
        </figure>
      );
    }
    if (block.type === "table") {
      return (
        <ServiceTableView
          key={`tbl-${idx}`}
          table={{ headers: block.headers, rows: block.rows }}
        />
      );
    }
    return null;
  });
}

export default function BlogBody({
  body,
  images,
  showFeatured = true,
}: {
  body: string;
  images?: ServiceImageSet;
  /** When false, parent already rendered ServicePdpFeatured / hub hero. */
  showFeatured?: boolean;
}) {
  const sections = parseSections(body);
  const hasPackagePlpImages = /\/images\/plp\//.test(body);
  let headedIdx = 0;

  return (
    <div className="space-y-10">
      {showFeatured && images?.featured && (
        <ServiceFeaturedImage image={images.featured} priority className="mb-2" />
      )}
      {sections.map((section, idx) => {
        const isHeaded = !!section.heading;
        if (isHeaded) headedIdx += 1;
        // Package PLP markdown already places unique images under headings —
        // do not also inject Unsplash/related stock (would duplicate).
        const inline =
          !hasPackagePlpImages &&
          images &&
          isHeaded &&
          headedIdx >= 1 &&
          headedIdx <= images.related.length
            ? images.related[headedIdx - 1]
            : undefined;
        return (
          <section
            key={section.id || `sec-${idx}`}
            id={section.id}
            className="scroll-mt-28"
          >
            {section.heading ? (
              <h2 className="text-xl md:text-2xl font-bold leading-persian-tight mb-4">
                {section.heading}
              </h2>
            ) : null}
            {renderInlineBlocks(section.blocks)}
            {inline ? <ServiceInlineImage image={inline} /> : null}
          </section>
        );
      })}
    </div>
  );
}
