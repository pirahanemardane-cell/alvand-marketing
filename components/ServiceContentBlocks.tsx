import type { ServiceBlock, ServiceTable } from "@/lib/services";

export function ServiceTableView({ table }: { table: ServiceTable }) {
  return (
    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
      <table className="w-full min-w-[28rem] text-sm text-right">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {table.headers.map((h) => (
              <th
                key={h}
                className="px-3 py-2.5 font-bold text-foreground whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {table.rows.map((row, i) => (
            <tr
              key={`${row[0]}-${i}`}
              className="border-b border-border last:border-0"
            >
              {row.map((cell, j) => (
                <td
                  key={`${i}-${j}`}
                  className="px-3 py-2.5 text-caption text-muted-foreground leading-persian align-top"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ServiceContentBlocks({
  blocks,
}: {
  blocks: ServiceBlock[];
}) {
  if (!blocks.length) return null;

  return (
    <div className="space-y-10 w-full mb-12">
      {blocks.map((block, idx) => {
        const HeadingTag = block.level === 3 ? "h3" : "h2";
        const headingClass =
          block.level === 3
            ? "text-lg font-bold mb-3 leading-persian-tight"
            : "text-xl font-bold mb-4 leading-persian-tight";

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
                {p}
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
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}
            {block.table ? <ServiceTableView table={block.table} /> : null}
          </section>
        );
      })}
    </div>
  );
}
