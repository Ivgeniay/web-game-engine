interface SpinnerProps {
  size?: number;
  borderWidth?: number;
  className?: string;
}

export function Spinner({
  size = 50,
  borderWidth = 10,
  className = "",
}: SpinnerProps) {
  const innerSize = size * 0.6;

  return (
    <div
      className={`flex items-center justify-center w-full h-full bg-primary ${className}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <div
          className="absolute rounded-full border-transparent animate-spin-cw"
          style={{
            width: size,
            height: size,
            borderWidth,
            borderTopColor: "var(--color-accent)",
          }}
        />
        <div
          className="absolute rounded-full border-transparent animate-spin-ccw"
          style={{
            width: innerSize,
            height: innerSize,
            borderWidth,
            borderTopColor: "var(--color-text-secondary)",
            top: (size - innerSize) / 2,
            left: (size - innerSize) / 2,
          }}
        />
      </div>
    </div>
  );
}

// export function Spinner() {
//   return (
//     <div className="flex items-center justify-center w-full h-full bg-primary">
//       <div className="relative w-10 h-10">
//         <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent animate-spin-cw"></div>
//         <div className="absolute inset-1.5 rounded-full border-2 border-transparent border-t-secondary animate-spin-ccw"></div>
//       </div>
//     </div>
//   );
// }
