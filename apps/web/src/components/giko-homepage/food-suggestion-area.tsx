import { authQueryOptions, type AuthQueryResult } from "@repo/auth/tanstack/queries";
import type { FoodSuggestion } from "@repo/core";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useState, useCallback } from "react";

export function FoodSuggestionArea({
  suggestions: initialSuggestions,
}: {
  suggestions: FoodSuggestion[];
}) {
  const { data: user } = useQuery(authQueryOptions()) as { data: AuthQueryResult };
  const [suggestions, setSuggestions] = useState(initialSuggestions);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.length < 2 || trimmed.length > 500) {
      setError("2-500 characters please");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const resp = await fetch("/api/food-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ suggestionText: trimmed }),
      });
      if (!resp.ok) {
        const body = await resp.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error || "Failed to submit");
      }
      const body = (await resp.json()) as { data: FoodSuggestion };
      setSuggestions((prev) => [body.data, ...prev]);
      setText("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }, [text]);

  return (
    <div className="text-xs">
      <p className="mb-1 font-medium text-foreground"> 留言区</p>
      {user ? (
        <div className="flex items-start gap-1">
          <input
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError("");
            }}
            placeholder="希望我尝试的菜…"
            maxLength={500}
            className="flex-1 rounded-md border border-border bg-background px-2 py-1 text-xs placeholder:text-muted-foreground/60"
          />
          <button
            onClick={() => void handleSubmit()}
            disabled={submitting || !text.trim()}
            className="shrink-0 rounded-md bg-orange-500 px-2 py-1 text-xs text-white hover:bg-orange-600 disabled:opacity-40"
          >
            {submitting ? "..." : "提交"}
          </button>
        </div>
      ) : (
        <p className="text-muted-foreground">
          <Link to="/login" className="underline underline-offset-2">
            登录
          </Link>
          后可以发表希望我尝试的菜
        </p>
      )}
      {error && <p className="mt-1 text-red-500">{error}</p>}
      {suggestions.length > 0 && (
        <ul className="mt-2 max-h-32 space-y-1 overflow-y-auto">
          {suggestions.map((s) => (
            <li key={s.id} className="text-muted-foreground">
              <span className="font-medium text-foreground">{s.authorName}</span>:{" "}
              {s.suggestionText}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
