import type {
  LandscapePhoto,
  FoodPhoto,
  FoodSuggestion,
  LifeGoal,
  GithubProject,
} from "@repo/core";
import * as schema from "@repo/db/schema/cms";
import { eq, asc, desc } from "drizzle-orm";

import { getCmsDb } from "./cms-db";

// ── Landscape Photos ──

export async function listLandscapePhotos(): Promise<LandscapePhoto[]> {
  const db = getCmsDb();
  const rows = await db
    .select()
    .from(schema.landscapePhotos)
    .orderBy(asc(schema.landscapePhotos.sortOrder), desc(schema.landscapePhotos.createdAt));
  return rows.map(drizzleRowToLandscapePhoto);
}

function drizzleRowToLandscapePhoto(
  row: typeof schema.landscapePhotos.$inferSelect,
): LandscapePhoto {
  return {
    id: row.id,
    imageKey: row.imageKey,
    title: row.title,
    description: row.description,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ── Food Photos ──

export async function listFoodPhotos(): Promise<FoodPhoto[]> {
  const db = getCmsDb();
  const rows = await db
    .select()
    .from(schema.foodPhotos)
    .orderBy(asc(schema.foodPhotos.sortOrder), desc(schema.foodPhotos.createdAt));
  return rows.map(drizzleRowToFoodPhoto);
}

function drizzleRowToFoodPhoto(row: typeof schema.foodPhotos.$inferSelect): FoodPhoto {
  return {
    id: row.id,
    imageKey: row.imageKey,
    title: row.title,
    description: row.description,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ── Food Suggestions ──

export async function listFoodSuggestions(limit = 50): Promise<FoodSuggestion[]> {
  const db = getCmsDb();
  const rows = await db
    .select()
    .from(schema.foodSuggestions)
    .orderBy(desc(schema.foodSuggestions.createdAt))
    .limit(limit);
  return rows.map(drizzleRowToFoodSuggestion);
}

export async function createFoodSuggestion(input: {
  userId: string;
  authorName: string;
  suggestionText: string;
}): Promise<FoodSuggestion> {
  const db = getCmsDb();
  const id = `foodsugg_${crypto.randomUUID()}`;
  const now = new Date().toISOString();
  await db.insert(schema.foodSuggestions).values({
    id,
    userId: input.userId,
    authorName: input.authorName,
    suggestionText: input.suggestionText,
    createdAt: now,
  });
  const [row] = await db
    .select()
    .from(schema.foodSuggestions)
    .where(eq(schema.foodSuggestions.id, id));
  if (!row) throw new Error("Failed to create food suggestion");
  return drizzleRowToFoodSuggestion(row);
}

function drizzleRowToFoodSuggestion(
  row: typeof schema.foodSuggestions.$inferSelect,
): FoodSuggestion {
  return {
    id: row.id,
    userId: row.userId,
    authorName: row.authorName,
    suggestionText: row.suggestionText,
    createdAt: row.createdAt,
  };
}

// ── Life Goals ──

export async function listLifeGoals(): Promise<LifeGoal[]> {
  const db = getCmsDb();
  const rows = await db
    .select()
    .from(schema.lifeGoals)
    .orderBy(
      asc(schema.lifeGoals.completed),
      asc(schema.lifeGoals.sortOrder),
      desc(schema.lifeGoals.completedAt),
    );
  return rows.map(drizzleRowToLifeGoal);
}

function drizzleRowToLifeGoal(row: typeof schema.lifeGoals.$inferSelect): LifeGoal {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    completed: row.completed === 1,
    completedAt: row.completedAt,
    completionImageKey: row.completionImageKey,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

// ── Github Projects ──

export async function listGithubProjects(): Promise<GithubProject[]> {
  const db = getCmsDb();
  const rows = await db
    .select()
    .from(schema.githubProjects)
    .orderBy(asc(schema.githubProjects.sortOrder), asc(schema.githubProjects.repoName));
  return rows.map(drizzleRowToGithubProject);
}

function drizzleRowToGithubProject(row: typeof schema.githubProjects.$inferSelect): GithubProject {
  return {
    id: row.id,
    repoUrl: row.repoUrl,
    repoName: row.repoName,
    description: row.description,
    starsCount: row.starsCount,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
