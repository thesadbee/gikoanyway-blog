import * as schema from "@repo/db/schema/cms";
import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { jsonResponse, readJsonBody } from "#/lib/cms-api";
import { requireAdminSession } from "#/lib/cms-authz";
import { getCmsDb } from "#/lib/cms-db";

// ── Shared helpers ──

async function guard(request: Request) {
  const err = await requireAdminSession(request);
  if (err) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  return getCmsDb();
}

function now() {
  return new Date().toISOString();
}

// ── Unified CRUD handler ──
// POST /api/giko-homepage — action in body: { action, table, data?, id? }

export const Route = createFileRoute("/api/giko-homepage")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const db = await guard(request);
        const body = (await readJsonBody(request)) as Record<string, unknown>;
        const action = String(body.action ?? "");
        const table = String(body.table ?? "");
        const payload = (body.data ?? body.payload ?? {}) as Record<string, unknown>;
        const id = typeof body.id === "string" ? body.id : undefined;

        // Map table name to Drizzle table object and ID column
        const tables: Record<string, { table: typeof schema.landscapePhotos; idCol: any }> = {
          landscape_photos: { table: schema.landscapePhotos, idCol: schema.landscapePhotos.id },
          food_photos: { table: schema.foodPhotos, idCol: schema.foodPhotos.id },
          life_goals: { table: schema.lifeGoals, idCol: schema.lifeGoals.id },
          github_projects: { table: schema.githubProjects, idCol: schema.githubProjects.id },
        };

        const target = tables[table];
        if (!target) return jsonResponse({ error: "Invalid table" }, { status: 400 });

        try {
          switch (action) {
            case "create": {
              const rowId = id ?? crypto.randomUUID();
              const values: Record<string, unknown> = {
                id: rowId,
                createdAt: now(),
                updatedAt: now(),
              };
              // Copy allowed fields from payload
              for (const [k, v] of Object.entries(payload)) {
                if (v !== undefined) values[k] = v;
              }
              await db.insert(target.table as any).values(values as any);
              return jsonResponse({ data: { id: rowId } }, { status: 201 });
            }

            case "update": {
              if (!id) return jsonResponse({ error: "id required" }, { status: 400 });
              const updates: Record<string, unknown> = { updatedAt: now() };
              for (const [k, v] of Object.entries(payload)) {
                if (v !== undefined) updates[k] = v;
              }
              await db
                .update(target.table as any)
                .set(updates as any)
                .where(eq(target.idCol, id));
              return jsonResponse({ data: { id } });
            }

            case "delete": {
              if (!id) return jsonResponse({ error: "id required" }, { status: 400 });
              await db.delete(target.table as any).where(eq(target.idCol, id));
              return jsonResponse({ data: { id } });
            }

            default:
              return jsonResponse({ error: `Unknown action: ${action}` }, { status: 400 });
          }
        } catch (err) {
          return jsonResponse({ error: String(err) }, { status: 500 });
        }
      },
    },
  },
});
