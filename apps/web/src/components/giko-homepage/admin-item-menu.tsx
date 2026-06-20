import { authQueryOptions, type AuthQueryResult } from "@repo/auth/tanstack/queries";
import { useQuery } from "@tanstack/react-query";
import { useState, useCallback, useRef } from "react";

type TableName = "landscape_photos" | "food_photos" | "life_goals" | "github_projects";

interface AdminItemMenuProps {
  table: TableName;
  itemId: string;
  currentValues: Record<string, unknown>;
  fields: { label: string; key: string; type?: string }[];
  onDeleted: (id: string) => void;
  onUpdated: (id: string, values: Record<string, unknown>) => void;
}

/** Hover menu shown at the top-right of each admin-editable item */
export function AdminItemMenu({
  table,
  itemId,
  currentValues,
  fields,
  onDeleted,
  onUpdated,
}: AdminItemMenuProps) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setOpen(false), 600);
  };

  const cancelClose = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const handleDelete = useCallback(async () => {
    if (!confirm("确认删除？此操作不可撤销。")) return;
    setOpen(false);
    try {
      const resp = await fetch("/api/giko-homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "delete", table, id: itemId }),
      });
      if (!resp.ok) throw new Error("Delete failed");
      onDeleted(itemId);
    } catch {
      alert("删除失败");
    }
  }, [table, itemId, onDeleted]);

  return (
    <>
      <div
        className="absolute top-1 right-1 z-10 opacity-0 transition-opacity group-hover:opacity-100"
        onMouseLeave={scheduleClose}
        onMouseEnter={cancelClose}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            cancelClose();
            setOpen(!open);
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background/80 text-xs leading-none text-muted-foreground hover:bg-muted hover:text-foreground"
          title="更多操作"
        >
          ···
        </button>
        {open && (
          <div
            className="absolute top-0 right-full mr-1 min-w-[100px] rounded-md border border-border bg-card py-1 text-xs shadow-lg"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cancelClose();
                setOpen(false);
                setEditing(true);
              }}
              className="w-full px-3 py-1.5 text-left text-foreground hover:bg-muted"
            >
              编辑
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                cancelClose();
                setOpen(false);
                handleDelete();
              }}
              className="w-full px-3 py-1.5 text-left text-red-500 hover:bg-muted"
            >
              删除
            </button>
          </div>
        )}
      </div>

      {editing && (
        <EditModal
          table={table}
          itemId={itemId}
          currentValues={currentValues}
          fields={fields}
          onClose={() => setEditing(false)}
          onUpdated={(values) => {
            onUpdated(itemId, values);
            setEditing(false);
          }}
        />
      )}
    </>
  );
}

/** Inline edit modal dialog */
function EditModal({
  table,
  itemId,
  currentValues,
  fields,
  onClose,
  onUpdated,
}: {
  table: TableName;
  itemId: string;
  currentValues: Record<string, unknown>;
  fields: { label: string; key: string; type?: string }[];
  onClose: () => void;
  onUpdated: (values: Record<string, unknown>) => void;
}) {
  const [status, setStatus] = useState("");

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
    setStatus("保存中…");
    try {
      const resp = await fetch("/api/giko-homepage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ action: "update", table, id: itemId, data: payload }),
      });
      if (!resp.ok) throw new Error("Update failed");
      onUpdated(payload);
    } catch {
      alert("编辑失败");
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[85vh] w-full max-w-md space-y-4 overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-xl"
      >
        <h3 className="text-base font-semibold">编辑条目</h3>
        {fields.map((field) => (
          <label key={field.key} className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-muted-foreground">{field.label}</span>
            <input
              name={field.key}
              defaultValue={String(currentValues[field.key] ?? (field.type === "number" ? 0 : ""))}
              type={
                field.type === "number"
                  ? "number"
                  : field.type === "checkbox"
                    ? "checkbox"
                    : field.type === "url"
                      ? "url"
                      : "text"
              }
              className={`rounded-md border border-border bg-background px-3 py-2 text-foreground ${
                field.type === "checkbox" ? "h-5 w-5" : ""
              }`}
            />
          </label>
        ))}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            取消
          </button>
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            保存
          </button>
        </div>
        {status && <p className="text-xs text-muted-foreground">{status}</p>}
      </form>
    </div>
  );
}

/** Hook to check if current user is an admin */
export function useIsAdmin(): boolean {
  const { data: user } = useQuery(authQueryOptions()) as { data: AuthQueryResult };
  return (user as any)?.role === "admin";
}
