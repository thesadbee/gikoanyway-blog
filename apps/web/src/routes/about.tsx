import { localizeSiteSettings } from "@repo/core";
import { Button } from "@repo/ui/components/button";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon, ExternalLinkIcon, SparklesIcon } from "lucide-react";
import { useState, useCallback } from "react";

import { AdminItemMenu, useIsAdmin } from "#/components/giko-homepage/admin-item-menu";
import { SiteShell } from "#/components/site-shell";
import { $getAboutPageData } from "#/lib/cms-server";
import { getDocsUrl } from "#/lib/docs-i18n";
import { getCurrentLocale } from "#/lib/i18n";

export const Route = createFileRoute("/about")({
  loader: () => $getAboutPageData(),
  head: () => {
    const locale = getCurrentLocale();

    return {
      meta: [
        {
          title: locale === "zh" ? "关于 giko" : "About giko",
        },
        {
          name: "description",
          content:
            locale === "zh"
              ? "了解 giko 的技术探索、项目复盘与日常生活。"
              : "Learn about giko's tech journey, projects, and daily life.",
        },
      ],
    };
  },
  component: AboutPage,
});

function AboutPage() {
  const data = Route.useLoaderData() as any;
  const locale = getCurrentLocale();
  const siteSettings = localizeSiteSettings(data.siteSettings, locale);
  const copy = getAboutCopy(locale);
  const docsHref = getDocsUrl([], locale);
  const contactLinks = (data.contactLinks ?? []) as import("@repo/core").ContactLink[];
  const [links, setLinks] = useState(contactLinks);
  const isAdmin = useIsAdmin();
  const handleDeleteLink = useCallback(
    (id: string) => setLinks((prev) => prev.filter((l) => l.id !== id)),
    [],
  );
  const handleUpdateLink = useCallback(
    (id: string, values: Record<string, unknown>) =>
      setLinks((prev) => prev.map((l) => (l.id === id ? ({ ...l, ...values } as typeof l) : l))),
    [],
  );

  return (
    <SiteShell siteSettings={siteSettings}>
      <div className="bg-background">
        <section className="border-b border-border">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(280px,0.38fr)] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-semibold tracking-wide text-link uppercase">
                {copy.eyebrow}
              </p>
              <h1 className="mt-5 max-w-4xl text-5xl leading-[0.98] font-semibold text-balance sm:text-6xl">
                {copy.title}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                {copy.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  render={<a href={docsHref} aria-label={copy.primaryAction} />}
                  nativeButton={false}
                >
                  {copy.primaryAction}
                  <ArrowRightIcon />
                </Button>
                <Button
                  render={<a href="https://makerjackie.com" aria-label={copy.secondaryAction} />}
                  variant="outline"
                  nativeButton={false}
                >
                  {copy.secondaryAction}
                  <ExternalLinkIcon />
                </Button>
              </div>
            </div>

            <aside className="group relative border border-border bg-muted/35 p-5">
              <img
                src={siteSettings.avatarUrl || "/og-default.svg"}
                alt={siteSettings.authorName || "giko"}
                className="aspect-square w-full object-cover"
              />
              <div className="mt-5">
                <p className="text-sm font-semibold text-link uppercase">
                  {siteSettings.authorName || "giko"}
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {(siteSettings as any).profileTitle || copy.profileTitle}
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {siteSettings.authorBio || copy.profileBody}
                </p>
              </div>
              {isAdmin && (
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={() => {
                      const url = "/admin/giko-homepage";
                      window.location.href = url;
                    }}
                    className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/80 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted hover:text-foreground"
                    title="编辑个人信息"
                  >
                    ···
                  </button>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section className="border-b border-border bg-muted/35">
          <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.36fr_0.64fr] lg:px-8 lg:py-16">
            <div>
              <p className="text-sm font-semibold text-link uppercase">{copy.whyEyebrow}</p>
              <h2 className="mt-3 text-3xl font-semibold text-balance">{copy.whyTitle}</h2>
            </div>
            <div className="grid gap-4">
              {copy.principles.map((principle) => (
                <article key={principle.title} className="border-t border-border pt-4">
                  <div className="flex items-start gap-3">
                    <SparklesIcon className="mt-1 size-4 shrink-0 text-link" />
                    <div>
                      <h3 className="text-xl font-semibold">{principle.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {principle.description}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
            <div className="grid gap-px border border-border bg-border md:grid-cols-3">
              {copy.paths.map((path) => (
                <a
                  key={path.href}
                  href={path.href}
                  className="bg-background p-5 transition hover:bg-muted/45"
                >
                  <p className="text-xs font-semibold tracking-wide text-link uppercase">
                    {path.eyebrow}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold">{path.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{path.description}</p>
                </a>
              ))}
            </div>

            {links.length > 0 && (
              <div className="mt-8 border-t border-border pt-6">
                <h3 className="mb-4 text-sm font-semibold tracking-wide text-link uppercase">
                  联系方式
                </h3>
                <div className="flex flex-wrap gap-4">
                  {links.map((link) => (
                    <div
                      key={link.id}
                      className="group relative flex min-w-[200px] items-center gap-3 rounded-lg border border-border bg-background p-4"
                    >
                      {link.logoUrl && (
                        <img
                          src={link.logoUrl}
                          alt={link.platform}
                          className="size-9 rounded-md object-contain"
                        />
                      )}
                      <div className="min-w-0">
                        {link.platform && (
                          <p className="text-sm font-semibold text-foreground">{link.platform}</p>
                        )}
                        {link.account && (
                          <p className="truncate text-xs text-muted-foreground">{link.account}</p>
                        )}
                      </div>
                      {link.qrCodeUrl && (
                        <img
                          src={link.qrCodeUrl}
                          alt={`${link.platform} QR`}
                          className="ml-auto size-16 rounded-md border border-border"
                        />
                      )}
                      {isAdmin && (
                        <AdminItemMenu
                          table="contact_links"
                          itemId={link.id}
                          currentValues={link as unknown as Record<string, unknown>}
                          fields={[
                            { label: "平台名称", key: "platform" },
                            { label: "Logo URL", key: "logoUrl", type: "url" },
                            { label: "账号", key: "account" },
                            { label: "二维码 URL", key: "qrCodeUrl", type: "url" },
                            { label: "排序", key: "sortOrder", type: "number" },
                          ]}
                          onDeleted={handleDeleteLink}
                          onUpdated={handleUpdateLink}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </SiteShell>
  );
}

function getAboutCopy(locale: ReturnType<typeof getCurrentLocale>) {
  if (locale === "zh") {
    return {
      eyebrow: "关于我",
      title: "写代码，也写生活。",
      description: "这里是 giko 的个人博客。记录技术探索、日常思考、旅行风景和厨房实验。",
      primaryAction: "阅读博客",
      secondaryAction: "GitHub",
      profileTitle: "北航准研究生 · 机器人工程",
      profileBody:
        "giko，2026 届本科毕业生，即将赴北京航空航天大学攻读研究生。热衷于仿生机器人、数字孪生和视觉伺服。业余时间喜欢摄影、烹饪和开源。",
      whyEyebrow: "免责声明",
      whyTitle: "阅读须知",
      principles: [
        {
          title: "试图在这篇故事里寻找动机者将被起诉",
          description: "",
        },
        {
          title: "试图寻找寓意者将被放逐",
          description: "",
        },
        {
          title: "试图从中寻找阴谋者将被枪毙",
          description: "",
        },
      ],
      paths: [
        {
          eyebrow: "Blog",
          title: "浏览文章",
          description: "技术笔记、项目复盘和生活记录。",
          href: "/blog",
        },
        {
          eyebrow: "Project",
          title: "GitHub 项目",
          description: "我发布的开源项目和实验代码。",
          href: "https://github.com/thesadbee",
        },
        {
          eyebrow: "Photos",
          title: "风景与美食",
          description: "用镜头记录走过的路和做过的菜。",
          href: "/",
        },
      ],
    };
  }

  return {
    eyebrow: "About Me",
    title: "Code, and life.",
    description:
      "This is giko’s personal blog — a space for tech exploration, daily thoughts, travel snapshots, and kitchen experiments.",
    primaryAction: "Read Blog",
    secondaryAction: "GitHub",
    profileTitle: "Beihang Grad Student · Robotics Engineering",
    profileBody:
      "giko, Class of 2026, heading to Beihang University for graduate studies. Passionate about bionic robotics, digital twins, and visual servoing. Enjoys photography, cooking, and open source in spare time.",
    whyEyebrow: "Disclaimer",
    whyTitle: "A Note to Readers",
    principles: [
      {
        title: "Persons attempting to find a motive in this narrative will be prosecuted",
        description: "",
      },
      {
        title: "Persons attempting to find a moral in it will be banished",
        description: "",
      },
      {
        title: "Persons attempting to find a plot in it will be shot",
        description: "",
      },
    ],
    paths: [
      {
        eyebrow: "Blog",
        title: "Read Articles",
        description: "Tech notes, project retrospectives, and life updates.",
        href: "/blog",
      },
      {
        eyebrow: "Project",
        title: "GitHub Projects",
        description: "Open source projects and experimental code.",
        href: "https://github.com/thesadbee",
      },
      {
        eyebrow: "Photos",
        title: "Landscape & Food",
        description: "Places I’ve been and dishes I’ve made, captured through the lens.",
        href: "/",
      },
    ],
  };
}
