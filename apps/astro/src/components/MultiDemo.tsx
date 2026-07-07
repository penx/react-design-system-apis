import TabsDemo from "./TabsDemo";

// Two instances in ONE React tree with no explicit id: useId() must give each a
// distinct base so they stay independent.
export default function MultiDemo() {
  return (
    <div>
      <TabsDemo />
      <TabsDemo />
    </div>
  );
}
