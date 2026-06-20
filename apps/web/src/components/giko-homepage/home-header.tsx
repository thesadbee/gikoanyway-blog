import { Link } from "@tanstack/react-router";

export function HomeHeader() {
  return (
    <div className="py-8 text-center md:py-10">
      <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
        GIKO喜欢您来！
      </h1>
      <div className="mx-auto mt-3 h-[3px] w-24 rounded-full bg-blue-500" />
      <p className="mt-3 text-sm text-muted-foreground">
        Welcome to GIKO-Anyway —{" "}
        <Link to="/blog" className="underline underline-offset-2 hover:text-foreground">
          博客文章
        </Link>{" "}
        ·{" "}
        <Link to="/about" className="underline underline-offset-2 hover:text-foreground">
          关于我
        </Link>
      </p>
    </div>
  );
}
