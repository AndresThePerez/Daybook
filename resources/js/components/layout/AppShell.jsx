export default function AppShell({ rail, children }) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-[248px_1fr]">
      {rail}
      <main className="px-6 py-8 md:px-10 md:py-9">
        <div className="mx-auto max-w-[920px]">{children}</div>
      </main>
    </div>
  );
}
