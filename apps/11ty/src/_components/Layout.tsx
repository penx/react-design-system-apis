import * as React from "react";

// Shared document shell. renderToStaticMarkup emits no doctype, so the compile
// function in eleventy.config.js prepends it.
export function Layout({
  title,
  children,
  withTabsRuntime = false,
}: {
  title: string;
  children: React.ReactNode;
  withTabsRuntime?: boolean;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title}</title>
        {/* The DS components import their own CSS (stubbed out during SSR), so
            we link the copied stylesheets here instead. */}
        <link rel="stylesheet" href="/assets/ds/style.css" />
        <link rel="stylesheet" href="/assets/ds/tabs.css" />
      </head>
      <body>
        {children}
        {/* Upgrades the SSR'd radio fallback to an accessible tablist. */}
        {withTabsRuntime ? (
          <script type="module" src="/assets/ds/define.js"></script>
        ) : null}
      </body>
    </html>
  );
}
