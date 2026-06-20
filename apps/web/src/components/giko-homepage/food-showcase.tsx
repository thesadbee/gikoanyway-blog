import type { FoodPhoto, FoodSuggestion } from "@repo/core";
import { useState, useCallback } from "react";

import { AdminItemMenu, useIsAdmin } from "./admin-item-menu";
import { FoodSuggestionArea } from "./food-suggestion-area";

const FOOD_FIELDS = [
  { label: "图片URL", key: "imageKey", type: "url" },
  { label: "标题", key: "title" },
  { label: "描述", key: "description" },
  { label: "排序", key: "sortOrder", type: "number" },
];

export function FoodShowcase({
  photos: initialPhotos,
  suggestions,
}: {
  photos: FoodPhoto[];
  suggestions: FoodSuggestion[];
}) {
  const [selected, setSelected] = useState<FoodPhoto | null>(null);
  const [photos, setPhotos] = useState(initialPhotos);
  const isAdmin = useIsAdmin();

  const handleDelete = useCallback((id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const handleUpdate = useCallback((id: string, values: Record<string, unknown>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? ({ ...p, ...values } as FoodPhoto) : p)));
  }, []);

  return (
    <>
      <SectionCard title=" 最近做了哪些美食" accent="bg-orange-500">
        {photos.length === 0 ? (
          <p className="py-8 text-center text-xs text-muted-foreground">还没有上传美食照</p>
        ) : (
          <div className="giko-scroll-container max-h-[380px] space-y-3 overflow-y-auto pr-1">
            {photos.map((p) => (
              <div key={p.id} className="group relative">
                <PhotoThumb photo={p} onClick={() => setSelected(p)} />
                {isAdmin && (
                  <AdminItemMenu
                    table="food_photos"
                    itemId={p.id}
                    currentValues={p as unknown as Record<string, unknown>}
                    fields={FOOD_FIELDS}
                    onDeleted={handleDelete}
                    onUpdated={handleUpdate}
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 border-t border-border pt-3">
          <FoodSuggestionArea suggestions={suggestions} />
        </div>
      </SectionCard>
      {selected && <PhotoModal photo={selected} onClose={() => setSelected(null)} />}
    </>
  );
}

function PhotoThumb({ photo, onClick }: { photo: FoodPhoto; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full cursor-pointer rounded-md text-left transition-colors hover:bg-muted/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <img
        src={photo.imageKey}
        alt={photo.title || "Photo"}
        className="aspect-[4/3] w-full rounded-md border border-border object-cover"
        loading="lazy"
      />
      <div className="mt-1.5 px-0.5">
        {photo.title && (
          <p className="truncate text-xs font-semibold text-foreground">{photo.title}</p>
        )}
        {photo.description && (
          <p className="mt-0.5 line-clamp-2 text-[11px] leading-tight text-muted-foreground">
            {photo.description}
          </p>
        )}
      </div>
    </button>
  );
}

function PhotoModal({ photo, onClose }: { photo: FoodPhoto; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="relative flex max-h-[92vh] max-w-[92vw] flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={photo.imageKey}
          alt={photo.title}
          className="max-h-[75vh] max-w-[90vw] rounded-lg object-contain"
        />
        <div className="mt-4 max-w-lg text-center text-white">
          {photo.title && <p className="text-base font-bold">{photo.title}</p>}
          {photo.description && (
            <p className="mt-1.5 text-sm leading-relaxed text-white/75">{photo.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="absolute -top-3 -right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl leading-none font-bold text-black hover:bg-gray-200"
          aria-label="Close"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  accent,
  children,
}: {
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className={`px-3 py-2 text-sm font-semibold text-white ${accent}`}>{title}</div>
      <div className="p-3">{children}</div>
    </div>
  );
}
