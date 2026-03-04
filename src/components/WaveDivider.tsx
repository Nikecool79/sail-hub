interface Props {
  className?: string;
  flip?: boolean;
}

const WaveDivider = ({ className = '', flip = false }: Props) => (
  <div className={`wave-divider ${className}`} style={flip ? { transform: 'scaleY(-1)' } : undefined}>
    <svg viewBox="0 0 1440 40" preserveAspectRatio="none" className="wave-sway">
      <path
        d="M0,20 C240,35 480,5 720,20 C960,35 1200,5 1440,20 L1440,40 L0,40 Z"
        fill="hsl(var(--primary) / 0.1)"
      />
      <path
        d="M0,25 C300,38 600,10 900,25 C1200,38 1350,12 1440,25 L1440,40 L0,40 Z"
        fill="hsl(var(--primary) / 0.06)"
      />
    </svg>
  </div>
);

export default WaveDivider;
