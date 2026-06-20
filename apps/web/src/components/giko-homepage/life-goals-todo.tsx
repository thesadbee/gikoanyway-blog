import type { LifeGoal } from "@repo/core";
import { useState, useCallback } from "react";

import { AdminItemMenu, useIsAdmin } from "./admin-item-menu";

const LIFE_GOAL_FIELDS = [
  { label: "标题", key: "title" },
  { label: "描述", key: "description" },
  { label: "已完成", key: "completed", type: "checkbox" },
  { label: "完成图URL", key: "completionImageKey", type: "url" },
  { label: "排序", key: "sortOrder", type: "number" },
];

export function LifeGoalsTodo({ goals: initialGoals }: { goals: LifeGoal[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const isAdmin = useIsAdmin();
  const incomplete = goals.filter((g) => !g.completed);
  const completed = goals.filter((g) => g.completed);

  const handleDelete = useCallback((id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
  }, []);

  const handleUpdate = useCallback((id: string, values: Record<string, unknown>) => {
    setGoals((prev) =>
      prev.map((g) =>
        g.id === id
          ? ({
              ...g,
              ...values,
              completed: values.completed === 1 || values.completed === true,
            } as LifeGoal)
          : g,
      ),
    );
  }, []);

  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="bg-blue-600 px-3 py-2 text-sm font-semibold text-white">人生计划</div>
      <div className="p-3">
        {goals.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">还没有目标</p>
        )}

        {/* Incomplete goals */}
        {incomplete.map((goal) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            isAdmin={isAdmin}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}

        {/* Completed goals (reversed chronological) */}
        {completed.length > 0 && (
          <div className="mt-3">
            <p className="mb-2 text-xs font-medium text-muted-foreground"> 已完成</p>
            {[...completed]
              .sort(
                (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime(),
              )
              .map((goal) => (
                <GoalRow
                  key={goal.id}
                  goal={goal}
                  isAdmin={isAdmin}
                  onDelete={handleDelete}
                  onUpdate={handleUpdate}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}

function GoalRow({
  goal,
  isAdmin,
  onDelete,
  onUpdate,
}: {
  goal: LifeGoal;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onUpdate: (id: string, v: Record<string, unknown>) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group relative cursor-pointer rounded-md px-2 py-1.5 text-xs transition-colors hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        <span className={goal.completed ? "text-green-500" : "text-muted-foreground"}>
          {goal.completed ? "✅" : "⬜"}
        </span>
        <span
          className={
            goal.completed ? "text-muted-foreground line-through" : "font-medium text-foreground"
          }
        >
          {goal.title}
        </span>
      </div>
      {expanded && (
        <div className="mt-2 ml-6 space-y-1 text-muted-foreground">
          {goal.description && <p>{goal.description}</p>}
          {goal.completedAt && (
            <p>完成于 {new Date(goal.completedAt).toLocaleDateString("zh-CN")}</p>
          )}
          {goal.completionImageKey && (
            <img
              src={goal.completionImageKey}
              alt={`${goal.title} 完成图`}
              className="mt-1 max-h-32 rounded-md border border-border"
              loading="lazy"
            />
          )}
        </div>
      )}
      {isAdmin && (
        <AdminItemMenu
          table="life_goals"
          itemId={goal.id}
          currentValues={goal as unknown as Record<string, unknown>}
          fields={LIFE_GOAL_FIELDS}
          onDeleted={onDelete}
          onUpdated={onUpdate}
        />
      )}
    </div>
  );
}
