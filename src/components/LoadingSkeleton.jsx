// Shimmer placeholders while images decode.
export default function LoadingSkeleton({ count = 12 }) {
  const heights = [220, 300, 260, 340, 200, 280, 320, 240];
  return (
    <div className="masonry">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="skeleton animate-shimmer rounded-2xl"
          style={{ height: heights[i % heights.length] }}
        />
      ))}
    </div>
  );
}
