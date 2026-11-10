import type { ServiceBlock, ServiceTable } from "@/lib/services";
import type { ServiceImageAsset } from "@/lib/service-images";
import { ServiceInlineImage } from "@/components/ServiceImages";
import { richTextNodes } from "@/components/RichText";

export function ServiceTableView({ table }: { table: ServiceTable }) {
  const { headers, rows } = table;
  const [leadHeader, ...fieldHeaders] = headers;

  return (
    <div className="service-table-root mt-4 w-full">
      {/* Mobile / narrow: stacked labeled cards */}
      <div className="md:hidden space-y-3" role="list">
        {rows.map((row, i) => {
          const [lead, ...fields] = row;
          return (
            <article
              key={`${lead}-${i}`}
              role="listitem"
              className="service-table-card overflow-hidden rounded-2xl border border-border bg-card"
            >
              <header className="service-table-card__head border-b border-border px-4 py-3">
                <p className="text-[0.7rem] font-bold tracking-wide text-accent/90 mb-1">
                  {leadHeader}
                </p>
                <h4 className="text-base font-bold text-foreground leading-persian-tight">
                  {lead}
                </h4>
              </header>
              {fieldHeaders.length > 0 ? (
                <dl className="divide-y divide-border">
                  {fieldHeaders.map((header, j) => (
                    <div
                      key={`${i}-${header}`}
                      className="grid gap-1 px-4 py-3 sm:grid-cols-[minmax(6.5rem,9rem)_1fr] sm:gap-4"
                    >
                      <dt className="text-[0.7rem] font-bold text-muted-foreground/80 leading-persian">
                        {header}
                      </dt>
                      <dd className="text-sm text-muted-foreground leading-persian">
                        {fields[j] ?? "—"}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </article>
          );
        })}
      </div>

      {/* Tablet / desktop: elegant bordered table + sticky first column */}
      <div className="service-table-frame hidden md:block">
        <div className="service-table-scroll" tabIndex={0}>
          <table className="service-table">
            <caption className="sr-only">
              جدول مقایسه‌ای خدمات و مشخصات
            </caption>
            <thead>
              <tr>
                {headers.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={`${row[0]}-${i}`}>
                  {row.map((cell, j) =>
                    j === 0 ? (
                      <th key={`${i}-${j}`} scope="row">
                        {cell}
                      </th>
                    ) : (
                      <td key={`${i}-${j}`}>{cell}</td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function ServiceContentBlocks({
  blocks,
  /** Optional related image placed under the first headed block (inline, not a gallery). */
  inlineImageAfterFirst,
}: {
  blocks: ServiceBlock[];
  inlineImageAfterFirst?: ServiceImageAsset;
}) {
  if (!blocks.length) return null;

  const firstHeadedIdx = blocks.findIndex((b) => !!b.heading);

  return (
    <div className="space-y-10 w-full mb-12">
      {blocks.map((block, idx) => {
        const HeadingTag = block.level === 3 ? "h3" : "h2";
        const headingClass =
          block.level === 3
            ? "text-lg font-bold mb-3 leading-persian-tight"
            : "text-xl font-bold mb-4 leading-persian-tight";
        const showInline =
          !!inlineImageAfterFirst && idx === firstHeadedIdx;

        return (
          <section key={`${block.heading || "block"}-${idx}`} className="w-full">
            {block.heading ? (
              <HeadingTag className={headingClass}>{block.heading}</HeadingTag>
            ) : null}
            {block.paragraphs?.map((p) => (
              <p
                key={p.slice(0, 48)}
                className="text-caption text-muted-foreground leading-persian mb-3"
              >
                {richTextNodes(p)}
              </p>
            ))}
            {block.items && block.items.length > 0 ? (
              <ul className="space-y-3">
                {block.items.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-caption text-muted-foreground leading-persian"
                  >
                    <span className="text-accent shrink-0">●</span>
                    <span>{richTextNodes(item)}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {block.table ? <ServiceTableView table={block.table} /> : null}
            {showInline && inlineImageAfterFirst ? (
              <ServiceInlineImage image={inlineImageAfterFirst} />
            ) : null}
          </section>
        );
      })}
    </div>
  );
}
