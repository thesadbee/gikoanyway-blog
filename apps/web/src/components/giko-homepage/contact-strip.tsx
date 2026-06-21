import type { ContactLink } from "@repo/core";

export function ContactStrip({ links }: { links: ContactLink[] }) {
  if (!links.length) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-5">
      {links.map((link) => (
        <div key={link.id} className="group relative">
          {/* Logo button */}
          <div className="flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-border bg-background transition-colors hover:bg-muted">
            {link.logoUrl ? (
              <img
                src={link.logoUrl}
                alt={link.platform || ""}
                className="size-full object-cover"
              />
            ) : (
              <span className="truncate px-1 text-xl font-semibold text-muted-foreground">
                {link.platform?.charAt(0) || "?"}
              </span>
            )}
          </div>

          {/* Hover popup */}
          <div className="pointer-events-none absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
            <div className="flex min-w-[140px] flex-col items-center gap-2 rounded-lg border border-border bg-card p-3 shadow-xl">
              {link.qrCodeUrl && (
                <img
                  src={link.qrCodeUrl}
                  alt={`${link.platform} QR`}
                  className="size-32 rounded-md border border-border"
                />
              )}
              {link.platform && (
                <p className="text-sm font-semibold text-foreground">{link.platform}</p>
              )}
              {link.account && <p className="text-xs text-muted-foreground">{link.account}</p>}
            </div>
            {/* Arrow */}
            <div className="absolute top-full left-1/2 -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b border-border bg-card" />
          </div>
        </div>
      ))}
    </div>
  );
}
