/**
 * Static — no motion at all. A single, very low-opacity wash, not a light
 * source that moves. Quiet infrastructure, not ambient decoration.
 */
export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, color-mix(in oklab, var(--color-accent-primary) 3%, transparent), transparent 60%)"
        }}
      />
      <div
        className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse 90% 65% at 50% 0%, transparent 45%, var(--color-canvas) 100%)" }}
      />
    </div>
  );
}
