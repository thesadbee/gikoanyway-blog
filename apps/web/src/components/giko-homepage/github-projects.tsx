import type { GithubProject } from "@repo/core";
import { useState, useCallback } from "react";

import { AdminItemMenu, useIsAdmin } from "./admin-item-menu";

const PROJECT_FIELDS = [
  { label: "仓库URL", key: "repoUrl", type: "url" },
  { label: "名称", key: "repoName" },
  { label: "描述", key: "description" },
  { label: "Star数", key: "starsCount", type: "number" },
  { label: "排序", key: "sortOrder", type: "number" },
];

export function GithubProjects({ projects: initialProjects }: { projects: GithubProject[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const isAdmin = useIsAdmin();

  const handleDelete = useCallback((id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleUpdate = useCallback((id: string, values: Record<string, unknown>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? ({ ...p, ...values } as GithubProject) : p)),
    );
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="bg-purple-600 px-3 py-2 text-sm font-semibold text-white">我的GitHub项目</div>
      <div className="space-y-2 p-3">
        {projects.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            后续发布开源项目后，管理员可在此处添加链接
          </p>
        )}
        {projects.map((proj) => (
          <div key={proj.id} className="group relative">
            <a
              href={proj.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-md border border-border p-2 text-xs transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="truncate font-medium text-foreground">{proj.repoName}</span>
                {proj.starsCount > 0 && (
                  <span className="shrink-0 text-muted-foreground">⭐ {proj.starsCount}</span>
                )}
              </div>
              {proj.description && (
                <p className="mt-0.5 line-clamp-2 text-muted-foreground">{proj.description}</p>
              )}
            </a>
            {isAdmin && (
              <AdminItemMenu
                table="github_projects"
                itemId={proj.id}
                currentValues={proj as unknown as Record<string, unknown>}
                fields={PROJECT_FIELDS}
                onDeleted={handleDelete}
                onUpdated={handleUpdate}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
