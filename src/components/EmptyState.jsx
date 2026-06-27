import { Images } from "./icons.jsx";

export default function EmptyState({
  title = "No photos yet",
  message = "Run the photo scanner to fill this gallery.",
  showCommand = true
}) {
  return (
    <div className="mx-auto max-w-xl text-center py-20 px-6">
      <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full glass text-gold-bright">
        <Images size={34} />
      </div>
      <h3 className="font-display text-2xl text-cream mb-2">{title}</h3>
      <p className="text-champagne/70 mb-6">{message}</p>
      {showCommand && (
        <div className="glass-dark inline-block rounded-xl px-5 py-3 text-left font-mono text-sm text-gold-soft">
          <div className="text-champagne/50 text-xs mb-1">Run in your terminal:</div>
          npm install<br />
          npm run generate:photos<br />
          npm run dev
        </div>
      )}
    </div>
  );
}
