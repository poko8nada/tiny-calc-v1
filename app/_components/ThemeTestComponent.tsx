export function ThemeTestComponent() {
  const colors = [
    { name: "gold", class: "bg-terminal-gold" },
    { name: "amber", class: "bg-terminal-amber" },
    { name: "cyan", class: "bg-terminal-cyan" },
    { name: "mint", class: "bg-terminal-mint" },
    { name: "red", class: "bg-terminal-red" },
    { name: "muted", class: "bg-terminal-muted" },
  ];

  return (
    <div className="min-h-screen bg-terminal-bg p-8 font-mono">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-terminal-gold text-2xl glow-text-strong">Terminal Theme Test</h1>
      </div>

      {/* Color Palette */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-4">Color Palette:</p>
        <div className="flex gap-4 flex-wrap">
          {colors.map((color) => (
            <div
              key={color.name}
              className={`${color.class} w-24 h-16 rounded flex items-center justify-center text-xs text-terminal-bg font-bold`}
            >
              {color.name}
            </div>
          ))}
        </div>
      </div>

      {/* Font Test */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-2">Fira Code Font:</p>
        <p className="text-terminal-amber font-mono">
          ABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789 !@#$%^&*()
        </p>
      </div>

      {/* ASCII Box */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-2">ASCII Box:</p>
        <div className="border border-terminal-border-dim p-4 text-terminal-cyan">
          <pre>┌─────────────────┐</pre>
          <pre>│ ASCII Test Box  │</pre>
          <pre>└─────────────────┘</pre>
        </div>
      </div>

      {/* Cursor Animation */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-2">Cursor Blink:</p>
        <p className="text-terminal-gold">
          user@tiny-calc:~$ <span className="cursor" />
        </p>
      </div>

      {/* Glow Effect */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-2">Glow Effect:</p>
        <div className="space-y-2">
          <p className="text-terminal-gold glow-text text-sm">Normal Glow</p>
          <p className="text-terminal-gold glow-text-strong text-lg font-bold">Strong Glow</p>
        </div>
      </div>

      {/* Interactive Button */}
      <div className="mb-8">
        <p className="text-terminal-muted mb-2">Interactive Glow:</p>
        <button className="px-4 py-2 bg-terminal-surface border border-terminal-gold text-terminal-gold glow-interactive">
          Hover / Focus Me
        </button>
      </div>
    </div>
  );
}
