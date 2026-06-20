import { authQueryOptions } from "@repo/auth/tanstack/queries";
import { getSiteSettingsForLocale } from "@repo/core";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { ThemeToggle } from "#/components/theme-toggle";
import { redirectForRole, safeAccountRedirectPath } from "#/lib/account-routing";
import { getCurrentLocale } from "#/lib/i18n";
import { getServerAuthUser } from "#/lib/route-auth";

export const Route = createFileRoute("/_guest")({
  validateSearch: (search): { redirectTo?: string } => {
    const redirectTo = safeAccountRedirectPath(search.redirectTo);

    return redirectTo === "/app" ? {} : { redirectTo };
  },
  component: RouteComponent,
  beforeLoad: async ({ context, search }) => {
    // Redirect path when user is already present,
    // or after successful login/signup
    const REDIRECT_URL = safeAccountRedirectPath(search.redirectTo);
    const serverUser = await getServerAuthUser();

    if (serverUser !== undefined) {
      if (serverUser) {
        throw redirect({
          to: redirectForRole(serverUser, REDIRECT_URL),
        });
      }

      return {
        redirectUrl: REDIRECT_URL,
      };
    }

    const user = await context.queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    if (user) {
      throw redirect({
        to: redirectForRole(user, REDIRECT_URL),
      });
    }

    return {
      redirectUrl: REDIRECT_URL,
    };
  },
});

function RouteComponent() {
  const locale = getCurrentLocale();
  const siteSettings = getSiteSettingsForLocale(locale);

  return (
    <div
      data-theme-preset={siteSettings.themePreset}
      data-layout-preset={siteSettings.layoutPreset}
      className="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10"
    >
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle locale={locale} />
      </div>
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
