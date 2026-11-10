import Link from "next/link";
import type { ReactNode } from "react";

const TOKEN =
  /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|\*[^*]+\*)/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const parts = text.split(TOKEN).filter((p) => p !== "");
  return parts.map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    const bold = part.match(/^\*\*([^*]+)\*\*$/);
    if (bold) {
      return (
        <strong key={key} className="font-bold text-foreground/90">
          {bold[1]}
        </strong>
      );
    }
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      const internal = href.startsWith("/");
      if (internal) {
        return (
          <Link
            key={key}
            href={href}
            className="text-accent font-medium underline-offset-4 hover:underline"
          >
            {label}
          </Link>
        );
      }
      return (
        <a
          key={key}
          href={href}
          className="text-accent font-medium underline-offset-4 hover:underline"
          rel="noopener noreferrer"
        >
          {label}
        </a>
      );
    }
    const italic = part.match(/^\*([^*]+)\*$/);
    if (italic) {
      return <em key={key}>{italic[1]}</em>;
    }
    return <span key={key}>{part}</span>;
  });
}

/** Renders markdown-lite: **bold**, *italic*, [exact title](/path). */
export default function RichText({
  text,
  className,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  as?: "span" | "p" | "li";
}) {
  return <Tag className={className}>{renderInline(text, "t")}</Tag>;
}

export function richTextNodes(text: string): ReactNode[] {
  return renderInline(text, "n");
}
