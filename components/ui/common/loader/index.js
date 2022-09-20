const SIZES = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
};

export default function Loader({ size = "md" }) {
  return (
    <div className={`sk-cube-grid ${SIZES[size]}`}>
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className={`sk-cube sk-cube${i + 1}`} />
      ))}
    </div>
  );
}
