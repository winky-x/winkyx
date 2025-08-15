export default function AppLayout({ children }: { children: React.ReactNode }) {
  // This layout is now a simple pass-through for a mobile-first fullscreen experience.
  return <div className="h-svh w-full bg-black">{children}</div>;
}
