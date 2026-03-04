interface Props {
  color?: string;
  size?: number;
  className?: string;
}

const OptimistBoat = ({ color = 'currentColor', size = 48, className = '' }: Props) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    fill="none"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Mast */}
    <line x1="40" y1="15" x2="40" y2="75" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    {/* Sail - triangular */}
    <path
      d="M42 18 L42 65 L75 65 Z"
      fill={color}
      fillOpacity="0.2"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    {/* Hull - boxy optimist shape */}
    <path
      d="M15 75 L20 90 L80 90 L85 75 Z"
      fill={color}
      fillOpacity="0.3"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    {/* Boom */}
    <line x1="40" y1="65" x2="75" y2="65" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default OptimistBoat;
