export function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-primary">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin-cw"></div>
        <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-secondary animate-spin-ccw"></div>
      </div>
    </div>
  );
}
