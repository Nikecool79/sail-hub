import OptimistBoat from './OptimistBoat';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-40 overflow-hidden">
    <div className="loading-boat">
      <OptimistBoat color="hsl(var(--primary))" size={40} />
    </div>
  </div>
);

export default LoadingSpinner;
