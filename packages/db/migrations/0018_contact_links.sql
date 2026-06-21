CREATE TABLE IF NOT EXISTS contact_links (
  id TEXT PRIMARY KEY NOT NULL,
  platform TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  account TEXT NOT NULL DEFAULT '',
  qr_code_url TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS contact_links_sort_idx ON contact_links (sort_order, platform);
