import type {
  ContactLink,
  FoodPhoto,
  FoodSuggestion,
  GithubProject,
  LandscapePhoto,
  LifeGoal,
  Post,
  SupportedLocale,
} from "@repo/core";

import { BlogPostsFeed } from "./blog-posts-feed";
import { ContactStrip } from "./contact-strip";
import { FoodShowcase } from "./food-showcase";
import { GithubProjects } from "./github-projects";
import { HomeHeader } from "./home-header";
import { LandscapeShowcase } from "./landscape-showcase";
import { LifeGoalsTodo } from "./life-goals-todo";
import { ThreeColumnLayout } from "./three-column-layout";

interface GikoHomepageProps {
  posts: Post[];
  landscapePhotos: LandscapePhoto[];
  foodPhotos: FoodPhoto[];
  foodSuggestions: FoodSuggestion[];
  lifeGoals: LifeGoal[];
  githubProjects: GithubProject[];
  contactLinks: ContactLink[];
  locale: SupportedLocale;
}

export function GikoHomepage({
  posts,
  landscapePhotos,
  foodPhotos,
  foodSuggestions,
  lifeGoals,
  githubProjects,
  contactLinks,
  locale,
}: GikoHomepageProps) {
  return (
    <div data-giko-homepage>
      <HomeHeader />
      <ThreeColumnLayout
        left={
          <>
            <LandscapeShowcase photos={landscapePhotos} />
            <FoodShowcase photos={foodPhotos} suggestions={foodSuggestions} />
          </>
        }
        center={<BlogPostsFeed posts={posts} locale={locale} />}
        right={
          <>
            <LifeGoalsTodo goals={lifeGoals} />
            <GithubProjects projects={githubProjects} />
          </>
        }
      />
      <div className="mt-8 pb-12">
        <ContactStrip links={contactLinks} />
      </div>
    </div>
  );
}
