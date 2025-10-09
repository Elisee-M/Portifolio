const CircuitBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-5 z-0">
      <svg width="100%" height="100%" viewBox="0 0 1200 800" className="absolute inset-0">
        <defs>
          <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
            {/* Horizontal lines */}
            <line x1="0" y1="25" x2="100" y2="25" stroke="hsl(var(--neon-cyan))" strokeWidth="1"/>
            <line x1="0" y1="75" x2="100" y2="75" stroke="hsl(var(--neon-cyan))" strokeWidth="1"/>
            
            {/* Vertical lines */}
            <line x1="25" y1="0" x2="25" y2="100" stroke="hsl(var(--neon-cyan))" strokeWidth="1"/>
            <line x1="75" y1="0" x2="75" y2="100" stroke="hsl(var(--neon-cyan))" strokeWidth="1"/>
            
            {/* Circuit nodes */}
            <circle cx="25" cy="25" r="3" fill="hsl(var(--neon-cyan))"/>
            <circle cx="75" cy="25" r="3" fill="hsl(var(--neon-cyan))"/>
            <circle cx="25" cy="75" r="3" fill="hsl(var(--neon-cyan))"/>
            <circle cx="75" cy="75" r="3" fill="hsl(var(--neon-cyan))"/>
            
            {/* Corner connections */}
            <line x1="20" y1="25" x2="30" y2="25" stroke="hsl(var(--neon-cyan))" strokeWidth="2"/>
            <line x1="70" y1="25" x2="80" y2="25" stroke="hsl(var(--neon-cyan))" strokeWidth="2"/>
            <line x1="25" y1="20" x2="25" y2="30" stroke="hsl(var(--neon-cyan))" strokeWidth="2"/>
            <line x1="75" y1="70" x2="75" y2="80" stroke="hsl(var(--neon-cyan))" strokeWidth="2"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#circuit)"/>
      </svg>
    </div>
  );
};

export default CircuitBackground;