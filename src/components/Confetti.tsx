const COLORS = ['#D97757', '#2A6FDB', '#3a7d5e', '#c08a3e', '#1a1714']

export default function Confetti() {
  const pieces = Array.from({ length: 32 }, (_, i) => {
    const angle = (Math.random() - 0.5) * Math.PI * 1.4 - Math.PI / 2
    const dist  = 220 + Math.random() * 200
    return {
      i,
      cx:    Math.cos(angle) * dist,
      cy:    Math.sin(angle) * dist + Math.random() * 60,
      cr:    (Math.random() - 0.5) * 720,
      color: COLORS[i % COLORS.length],
      delay: Math.random() * 0.15,
    }
  })

  return (
    <div
      className="absolute pointer-events-none z-[200]"
      style={{ left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: 0, height: 0 }}
    >
      {pieces.map(p => (
        <span
          key={p.i}
          className="confetti-piece"
          style={{
            background:     p.color,
            '--cx':         `${p.cx}px`,
            '--cy':         `${p.cy}px`,
            '--cr':         `${p.cr}deg`,
            animationDelay: `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
