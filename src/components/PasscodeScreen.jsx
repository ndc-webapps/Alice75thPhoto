import { useState } from "react";
import { motion } from "framer-motion";
import { site, passcodeValue } from "../config/site.js";
import { Lock, Sparkle } from "./icons.jsx";

export default function PasscodeScreen({ onUnlock }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    if (value.trim() === String(passcodeValue)) {
      sessionStorage.setItem("g75_unlocked", "1");
      onUnlock();
    } else {
      setError(true);
      setValue("");
    }
  };

  return (
    <div className="app-bg grid min-h-screen place-items-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass w-full max-w-sm rounded-3xl p-8 text-center shadow-card"
      >
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full bg-gold-sheen text-ink shadow-glow">
          <Lock size={28} />
        </div>
        <div className="mb-1 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.25em] text-gold-bright">
          <Sparkle size={13} /> Family Only
        </div>
        <h1 className="font-display text-3xl text-cream">{site.title}</h1>
        <p className="mt-2 text-sm text-champagne/70">
          Please enter the family passcode to view the memories.
        </p>

        <input
          type="password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          placeholder="Family passcode"
          autoFocus
          className={`mt-6 w-full rounded-full border bg-ink/40 px-5 py-3 text-center text-cream outline-none transition
            ${error ? "border-rose-500" : "border-champagne/25 focus:border-gold/60"}`}
        />
        {error && <p className="mt-2 text-sm text-rose-400">That code didn’t work. Try again.</p>}

        <button type="submit" className="btn-gold mt-5 w-full">Enter</button>
        <p className="mt-4 text-xs text-champagne/50">{site.passcode.hint}</p>
      </motion.form>
    </div>
  );
}
