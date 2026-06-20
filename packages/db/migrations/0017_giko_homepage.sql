PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS landscape_photos (
  id TEXT PRIMARY KEY NOT NULL,
  image_key TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS landscape_photos_sort_idx ON landscape_photos (sort_order, created_at);

CREATE TABLE IF NOT EXISTS food_photos (
  id TEXT PRIMARY KEY NOT NULL,
  image_key TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS food_photos_sort_idx ON food_photos (sort_order, created_at);

CREATE TABLE IF NOT EXISTS food_suggestions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL REFERENCES user(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  suggestion_text TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS food_suggestions_created_idx ON food_suggestions (created_at);

CREATE TABLE IF NOT EXISTS life_goals (
  id TEXT PRIMARY KEY NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  completed INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  completion_image_key TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS life_goals_sort_idx ON life_goals (completed, sort_order, completed_at);

CREATE TABLE IF NOT EXISTS github_projects (
  id TEXT PRIMARY KEY NOT NULL,
  repo_url TEXT NOT NULL,
  repo_name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  stars_count INTEGER NOT NULL DEFAULT 0,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS github_projects_sort_idx ON github_projects (sort_order, repo_name);
