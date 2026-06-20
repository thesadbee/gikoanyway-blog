import type { Post, SupportedLocale } from "@repo/core";
import { Link } from "@tanstack/react-router";
import { useRef, type WheelEvent } from "react";

function extractImageUrls(html: string): string[] {
  if (!html) return [];
  const urls: string[] = [];
  const regex = /<img[^>]+src=["']([^"']+)["']/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function ThumbnailStrip({ images }: { images: string[] }) {
  const stripRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: WheelEvent) => {
    if (!stripRef.current) return;
    e.preventDefault();
    stripRef.current.scrollLeft += e.deltaY;
  };

  if (images.length === 0) return null;

  return (
    <div
      ref={stripRef}
      onWheel={handleWheel}
      className="giko-scroll-container mt-3 flex gap-2 overflow-x-auto pb-1"
    >
      {images.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Post image ${i + 1}`}
          className="h-24 w-auto flex-shrink-0 rounded-md border border-border object-cover"
          loading="lazy"
        />
      ))}
    </div>
  );
}

export function BlogPostsFeed({ posts, locale }: { posts: Post[]; locale: SupportedLocale }) {
  return (
    <div className="space-y-8">
      {posts.map((post) => {
        const images = extractImageUrls(post.contentHtml);
        return (
          <Link
            key={post.id}
            to="/blog/$slug"
            params={{ slug: post.slug }}
            className="block rounded-lg border border-border bg-card p-5 shadow-sm transition-colors hover:border-foreground/20"
          >
            <div className="mb-1 flex items-center gap-2 text-xs text-muted-foreground">
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString(
                  locale === "zh" ? "zh-CN" : "en-US",
                  { year: "numeric", month: "short", day: "numeric" },
                )}
              </time>
              {post.tags.length > 0 && (
                <>
                  <span>·</span>
                  <span className="flex flex-wrap gap-1">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag.slug}
                        to="/tags/$slug"
                        params={{ slug: tag.slug }}
                        className="underline underline-offset-2 hover:text-foreground"
                        onClick={(e) => e.stopPropagation()}
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </span>
                </>
              )}
              {post.pinned && <span className="ml-auto font-medium text-orange-500"> Pinned</span>}
            </div>
            <h2 className="text-lg leading-snug font-semibold">{post.title}</h2>
            {post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
            )}
            <ThumbnailStrip images={images} />
          </Link>
        );
      })}
      {posts.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">还没有文章，去后台写第一篇吧。</p>
      )}
    </div>
  );
}
