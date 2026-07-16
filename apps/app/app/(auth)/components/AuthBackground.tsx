/**
 * Institutional background treatment.
 *
 * Layers (bottom → top):
 * 1. Near-black canvas (handled by body bg-canvas in global.css)
 * 2. Very faint blue-black radial glow at top-right
 * 3. Hairline blueprint grid — ~3% opacity
 * 4. Large circular construction guides — ~2% opacity
 * 5. Strong edge vignette
 *
 * All layers are pointer-events-none and aria-hidden.
 * Nothing animates; nothing glows brightly.
 */
export function AuthBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-canvas">
      {/* Radial glow — top-right, extremely restrained */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 55% at 75% -5%, color-mix(in oklab, #0B8CFF 5%, transparent), transparent 65%)"
        }}
      />

      {/* Blueprint grid — ~3% opacity */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(11,140,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(11,140,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px"
        }}
      />

      {/* Large circular construction guides — 2–3% opacity */}
      <svg
        className="absolute inset-0 h-full w-full"
        xmlns="http://www.w3.org/2000/svg"
        style={{ opacity: 0.025 }}
      >
        <circle cx="50%" cy="45%" r="28%" fill="none" stroke="#0B8CFF" strokeWidth="1" />
        <circle cx="50%" cy="45%" r="42%" fill="none" stroke="#0B8CFF" strokeWidth="1" />
        <circle cx="50%" cy="45%" r="58%" fill="none" stroke="#0B8CFF" strokeWidth="0.5" />
      </svg>

      {/* Edge vignette — keeps the deep borders */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 85% at 50% 50%, transparent 30%, rgba(4,7,11,0.82) 100%)"
        }}
      />
    </div>
  );
}

