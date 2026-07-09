import * as React from "react";

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
        <link rel="stylesheet" href="/assets/ds/style.css" />
        <link rel="stylesheet" href="/assets/ds/tabs.css" />
      </head>
      <body>
        {children}
        {withTabsRuntime ? (
          <script type="module" src="/assets/ds/define.js"></script>
        ) : null}
      </body>
    </html>
  );
}
