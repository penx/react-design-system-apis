import * as React from "react";
import { Layout } from "./_components/Layout";
import { TabsDemo } from "./_components/TabsDemo";

export default function TabsPage() {
  return (
    <Layout title="Tabs - 11ty" withTabsRuntime>
      <h1>Tabs</h1>
      <p>
        Server-rendered as a radio-group fallback (tabs switch with no
        JavaScript), then upgraded to an accessible WAI-ARIA tablist by the{" "}
        <code>&lt;ds-tabs&gt;</code> custom element. No React runs on the
        client.
      </p>

      <TabsDemo id="one" />
      <TabsDemo id="two" />
    </Layout>
  );
}
