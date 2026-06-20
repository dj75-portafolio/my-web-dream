// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - tanstackStart, viteReact, tailwindcss, tsConfigPaths, nitro (build-only using cloudflare as a default target),
//     componentTagger (dev-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

const repoBase = "/my-web-dream";
const isGitHubPages = process.env.GITHUB_PAGES === "true";
const isLovableSandbox =
  process.env.LOVABLE_SANDBOX === "1" || !!process.env.DEV_SERVER__PROJECT_PATH;

export default defineConfig({
  // In Lovable, leave nitro unset so the sandbox uses its default Cloudflare build.
  // Outside Lovable: Vercel preset for Vercel, or static prerender for GitHub Pages.
  nitro: isLovableSandbox
    ? undefined
    : isGitHubPages
      ? false
      : { preset: "vercel" },
  vite: {
    base: isGitHubPages ? `${repoBase}/` : "/",
  },
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
    ...(isGitHubPages
      ? {
          prerender: {
            enabled: true,
            crawlLinks: true,
          },
        }
      : {}),
  },
});
