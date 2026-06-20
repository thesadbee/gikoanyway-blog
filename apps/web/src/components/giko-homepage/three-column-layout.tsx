import type { ReactNode } from "react";

export function ThreeColumnLayout({
  left,
  center,
  right,
}: {
  left: ReactNode;
  center: ReactNode;
  right: ReactNode;
}) {
  return (
    <div
      className="3xl:grid-cols-[280px_minmax(0,860px)_280px] 3xl:gap-10 grid grid-cols-1 gap-4 px-4 pb-12 sm:gap-5 sm:px-6 lg:mx-auto lg:max-w-6xl lg:grid-cols-[200px_1fr_200px] lg:gap-5 xl:max-w-7xl xl:grid-cols-[240px_1fr_240px] xl:gap-6 2xl:grid-cols-[260px_minmax(0,720px)_260px] 2xl:justify-center 2xl:gap-8"
    >
      <aside className="order-2 space-y-5 lg:order-1 lg:space-y-6">{left}</aside>
      <main className="order-1 min-w-0 lg:order-2">{center}</main>
      <aside className="order-3 space-y-5 lg:space-y-6">{right}</aside>
    </div>
  );
}
