import type {
  Post,
  LandscapePhoto,
  FoodPhoto,
  FoodSuggestion,
  LifeGoal,
  GithubProject,
  SupportedLocale,
} from "@repo/core";

import { BlogPostsFeed } from "./blog-posts-feed";
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
  locale: SupportedLocale;
}

export function GikoHomepage({
  posts,
  landscapePhotos,
  foodPhotos,
  foodSuggestions,
  lifeGoals,
  githubProjects,
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
    </div>
  );
}
