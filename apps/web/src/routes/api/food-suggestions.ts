import { createFileRoute } from "@tanstack/react-router";

import { jsonResponse, readJsonBody } from "#/lib/cms-api";
import { createFoodSuggestion, listFoodSuggestions } from "#/lib/cms-d1-giko";
import { getCommentUserFromRequest } from "#/lib/comment-auth";

export const Route = createFileRoute("/api/food-suggestions")({
  server: {
    handlers: {
      GET: async () => {
        const suggestions = await listFoodSuggestions(50);
        return jsonResponse({ data: suggestions });
      },
      POST: async ({ request }: { request: Request }) => {
        const user = await getCommentUserFromRequest(request);
        if (!user) {
          return jsonResponse(
            { error: "Login is required to submit a food suggestion." },
            { status: 401 },
          );
        }

        const body = await readJsonBody(request);
        const suggestionText =
          typeof (body as Record<string, unknown>).suggestionText === "string"
            ? (body as Record<string, string>).suggestionText.trim()
            : "";

        if (!suggestionText || suggestionText.length < 2 || suggestionText.length > 500) {
          return jsonResponse(
            { error: "Suggestion must be between 2 and 500 characters." },
            { status: 400 },
          );
        }

        const suggestion = await createFoodSuggestion({
          userId: user.id,
          authorName: user.name ?? user.email ?? "Anonymous",
          suggestionText,
        });

        return jsonResponse({ data: suggestion }, { status: 201 });
      },
    },
  },
});
