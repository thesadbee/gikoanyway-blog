import type { LandscapePhoto, FoodPhoto, LifeGoal, GithubProject } from "@repo/core";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_auth/admin/giko-homepage")({
  component: GikoHomepageAdmin,
});

type Section = "landscape_photos" | "food_photos" | "life_goals" | "github_projects";

const SECTION_LABELS: Record<Section, string> = {
  landscape_photos: " 风景照",
  food_photos: " 美食照",
  life_goals: " 人生计划",
  github_projects: " GitHub 项目",
};

const SECTION_FIELDS: Record<Section, { label: string; key: string; type?: string }[]> = {
  landscape_photos: [
    { label: "图片URL", key: "imageKey", type: "url" },
    { label: "标题", key: "title" },
    { label: "描述", key: "description" },
    { label: "排序", key: "sortOrder", type: "number" },
  ],
  food_photos: [
    { label: "图片URL", key: "imageKey", type: "url" },
    { label: "标题", key: "title" },
    { label: "描述", key: "description" },
    { label: "排序", key: "sortOrder", type: "number" },
  ],
  life_goals: [
    { label: "标题", key: "title" },
    { label: "描述", key: "description" },
    { label: "已完成", key: "completed", type: "checkbox" },
    { label: "完成图URL", key: "completionImageKey", type: "url" },
    { label: "排序", key: "sortOrder", type: "number" },
  ],
  github_projects: [
    { label: "仓库URL", key: "repoUrl", type: "url" },
    { label: "名称", key: "repoName" },
    { label: "描述", key: "description" },
    { label: "Star数", key: "starsCount", type: "number" },
    { label: "排序", key: "sortOrder", type: "number" },
  ],
};

function GikoHomepageAdmin() {
  const [section, setSection] = useState<Section>("landscape_photos");
  const [status, setStatus] = useState("");

  const fields = SECTION_FIELDS[section];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const payload: Record<string, unknown> = {};
    for (const field of fields) {
      const el = form.elements.namedItem(field.key) as HTMLInputElement | null;
      if (!el) continue;
      if (field.type === "checkbox") {
        payload[field.key] = el.checked ? 1 : 0;
      } else if (field.type === "number") {
        payload[field.key] = Number(el.value) || 0;
      } else {
        payload[field.key] = el.value;
      }
    }
    setStatus("Saving...");
    try {
      const resp = await fetch("/api/giko-homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "create", table: section, data: payload }),
      });
      if (!resp.ok) throw new Error("Failed");
      setStatus("✅ Created!");
      form.reset();
    } catch {
      setStatus("❌ Error");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">编辑首页内容</h1>

      {/* Section tabs */}
      <div className="mb-6 flex flex-wrap gap-2">
        {(Object.keys(SECTION_LABELS) as Section[]).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => {
              setSection(s);
              setStatus("");
            }}
            className={`rounded-md border px-4 py-2 text-sm font-medium ${
              s === section
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-foreground hover:bg-muted"
            }`}
          >
            {SECTION_LABELS[s]}
          </button>
        ))}
      </div>

      {/* Create form */}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-border p-6">
        <h2 className="text-lg font-semibold">新增{SECTION_LABELS[section]}条目</h2>
        {fields.map((field) => (
          <label key={field.key} className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">{field.label}</span>
            <input
              name={field.key}
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "checkbox"
                    ? "checkbox"
                    : field.type === "url"
                      ? "url"
                      : "text"
              }
              className={`rounded-md border border-border bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground/50 ${
                field.type === "checkbox" ? "h-5 w-5" : ""
              }`}
              placeholder={field.label}
            />
          </label>
        ))}
        <button
          type="submit"
          className="mt-4 rounded-md bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
        >
          创建
        </button>
        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>

      {/* Management note */}
      <div className="mt-6 rounded-lg border border-border p-4 text-sm text-muted-foreground">
        <p>
          {" "}
          提示：图片上传请先到{" "}
          <a href="/admin/assets" className="underline">
            资源管理
          </a>{" "}
          上传至 R2，复制得到的 URL 填入上方表单的「图片URL」字段。
        </p>
        <p className="mt-1">
          {" "}
          编辑/删除已有条目：目前通过 D1 控制台或 API 操作。如需页面管理界面请告诉我再添加。
        </p>
      </div>
    </div>
  );
}
