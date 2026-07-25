export const PulsingDot = (): React.JSX.Element => (
  <span
    style={{ position: 'relative', display: 'inline-flex', width: 7, height: 7, marginLeft: 6 }}
  >
    <span className="absolute inset-0 rounded-full bg-primary-container opacity-50 animate-ping" />
    <span className="block w-[7px] h-[7px] rounded-full bg-primary" />
  </span>
);
