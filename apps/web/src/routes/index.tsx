import { localizePost, localizeSiteSettings } from "@repo/core";
import { createFileRoute } from "@tanstack/react-router";

import { GikoHomepage } from "#/components/giko-homepage/giko-homepage";
import { SiteShell } from "#/components/site-shell";
import { $getHomePageData, type HomePageData } from "#/lib/cms-server";
import { getCurrentLocale } from "#/lib/i18n";

export const Route = createFileRoute("/")({
  loader: (): Promise<HomePageData> => $getHomePageData(),
  component: HomePage,
});

function HomePage() {
  const data: HomePageData = Route.useLoaderData();
  const locale = getCurrentLocale();
  const posts = data.posts.map((post) => localizePost(post, locale)).filter(isReaderFacingPost);
  const siteSettings = localizeSiteSettings(data.siteSettings, locale);

  return (
    <SiteShell siteSettings={siteSettings}>
      <GikoHomepage
        posts={posts}
        landscapePhotos={data.landscapePhotos}
        foodPhotos={data.foodPhotos}
        foodSuggestions={data.foodSuggestions}
        lifeGoals={data.lifeGoals}
        githubProjects={data.githubProjects}
        locale={locale}
      />
    </SiteShell>
  );
}

function isReaderFacingPost(post: { title: string; slug: string }) {
  // Filter out e2e test posts
  return !/e2e-.*test/i.test(post.slug) && !/e2e[-_]test/i.test(post.title);
}
