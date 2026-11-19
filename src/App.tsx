import { useState, useEffect } from "react";
import { ArrowLeftRight, DollarSign } from "lucide-react";
import CenterGrowInput from "./components/input";

type Mode = "rial-to-dollar" | "dollar-to-rial";

const App = () => {
  const welcome_text = "Pouya Halavat Task";

  const [amount, setAmount] = useState<number>(0);
  const [usdToToman, setUsdToToman] = useState<number>(0);
  const [manualRate, setManualRate] = useState("");
  const [isManualRate, setIsManualRate] = useState(false);

  const [mode, setMode] = useState<Mode>("dollar-to-rial");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [swap, setSwap] = useState(false);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "https://raw.githubusercontent.com/HosseinOdd/Navasan-API/main/data/fiat.json",
        );

        if (!res.ok) {
          throw new Error("Failed to fetch exchange rate");
        }

        const data = await res.json();

        const rawRate = data?.usd?.value ?? data?.usd?.sell ?? data?.usd;

        const usdToman =
          typeof rawRate === "number" ? rawRate : Number(rawRate);

        if (!Number.isFinite(usdToman) || usdToman <= 0) {
          throw new Error("Invalid USD exchange rate");
        }

        setUsdToToman(usdToman);
        setError(null);
      } catch (err) {
        console.error("Exchange rate error:", err);
        setError("Unable to load live rate. You can enter the rate manually.");
      } finally {
        setLoading(false);
      }
    };

    fetchRate();

    const id = setInterval(fetchRate, 60_000);

    return () => clearInterval(id);
  }, []);

  const effectiveRateToman = isManualRate ? Number(manualRate) : usdToToman;

  const usdToRial =
    Number.isFinite(effectiveRateToman) && effectiveRateToman > 0
      ? effectiveRateToman * 10
      : 0;

  const result = (() => {
    if (usdToRial <= 0) return 0;

    return mode === "rial-to-dollar" ? amount / usdToRial : amount * usdToRial;
  })();

  // Dynamic labels
  const resultLabel = mode === "rial-to-dollar" ? "USD" : "Rial";

  const inputPlaceholder =
    mode === "rial-to-dollar" ? "Amount in Rial" : "Amount in USD";

  const fromLabel = mode === "rial-to-dollar" ? "Rial" : "USD";

  const toLabel = mode === "rial-to-dollar" ? "USD" : "Rial";

  const handleSwap = () => {
    setSwap(true);

    setMode((m) =>
      m === "rial-to-dollar" ? "dollar-to-rial" : "rial-to-dollar",
    );

    setAmount(0);

    setTimeout(() => setSwap(false), 500);
  };

  const handleUseApi = () => {
    setIsManualRate(false);
    setManualRate("");
  };

  const handleManualRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setManualRate(e.target.value);
    setIsManualRate(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-mauve-700 flex flex-col overflow-x-hidden">
      <div className="fixed inset-0">
        <img
          src="/Background.png"
          alt="background"
          className="w-full h-full object-cover object-center select-none pointer-events-none"
        />

        <div className="absolute inset-0 bg-mauve-700/30" />
      </div>

      <header className="relative pt-6 sm:pt-10 px-4 shrink-0">
        <div className="flex justify-center text-stone-700 relative">
          {welcome_text.split("").map((word, index) => (
            <p
              key={`letter-${index}`}
              className="letter text-3xl sm:text-4xl md:text-6xl font-serif font-thin"
              style={{
                animationDelay: `${index * 0.08}s`,
              }}>
              {word === " " ? "\u00A0" : word}
            </p>
          ))}

          <h2 className="animate-one text-2xl sm:text-3xl md:text-5xl font-serif font-thin absolute -bottom-8 sm:-bottom-10">
            Currency Exchange
          </h2>
        </div>
      </header>

      <div className="relative flex flex-col items-center justify-center mt-12 sm:mt-14 px-4 gap-3 shrink-0">
        <p className="relative text-lg sm:text-2xl md:text-4xl text-stone-700 font-serif py-2 flex items-center gap-1 overflow-hidden">
          <span className="relative z-10 flex items-center gap-1">
            1 <DollarSign className="w-4 h-4 sm:w-6 sm:h-6 text-stone-700" /> =
            {usdToRial > 0
              ? usdToRial.toLocaleString("en-US")
              : loading
                ? "..."
                : "Unavailable"}{" "}
            Rial
          </span>

          <span className="absolute bottom-0 left-0 w-full h-0.5 bg-stone-700/20" />

          <span className="absolute bottom-0 left-0 h-0.5 w-1/3 bg-linear-to-r from-transparent via-stone-700 to-transparent animate-sweep" />
        </p>

        <div className="w-full max-w-sm flex flex-col gap-2">
          <label
            htmlFor="exchange-rate"
            className="text-sm sm:text-base text-stone-700 font-serif text-center">
            USD Price (Toman)
          </label>

          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-600 pointer-events-none" />

              <input
                id="exchange-rate"
                type="number"
                min="0"
                step="any"
                value={
                  isManualRate
                    ? manualRate
                    : usdToToman > 0
                      ? String(usdToToman)
                      : ""
                }
                onChange={handleManualRateChange}
                placeholder="Enter USD price in Toman"
                className="w-full bg-stone-300/40 backdrop-blur-sm border border-stone-700/20 rounded-xl pl-10 pr-3 py-3 text-stone-800 font-serif outline-none focus:border-mauve-900 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={handleUseApi}
              disabled={!isManualRate || usdToToman <= 0}
              className="shrink-0 px-3 py-3 rounded-xl bg-mauve-900 text-white text-xs sm:text-sm font-serif transition-all hover:bg-mauve-800 disabled:opacity-40 disabled:cursor-not-allowed">
              Use API
            </button>
          </div>

          <p className="text-xs text-stone-700/70 font-serif text-center">
            {isManualRate
              ? "Using your custom exchange rate"
              : loading
                ? "Loading live exchange rate..."
                : usdToToman > 0
                  ? "Using live API exchange rate"
                  : "Enter an exchange rate manually"}
          </p>
        </div>
      </div>

      {/* Exchange Section 💱💱💱💱💱*/}
      <main className="relative flex-1 flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10">
        <div className="relative w-full max-w-3xl h-full min-h-100 sm:min-h-112 bg-stone-300/40 backdrop-blur-xs rounded-3xl sm:rounded-4xl flex flex-col shadow-lg">
          <div
            key={mode}
            className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 font-serif text-sm sm:text-lg text-mauve-900/80 whitespace-nowrap"
            style={{
              animation: "fadeSlide 0.4s ease-out",
            }}>
            {fromLabel} to {toLabel}
          </div>

          <div className="flex-1 flex items-center justify-center pt-8 pb-2 px-4">
            <CenterGrowInput
              value={amount}
              setValue={setAmount}
              placeholder={inputPlaceholder}
              maxDecimals={mode === "dollar-to-rial" ? 2 : 0}
            />
          </div>

          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <button
              onClick={handleSwap}
              aria-label="Swap currency"
              className={`group flex items-center justify-center
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                rounded-full bg-mauve-900 text-white shadow-xl
                transition-all duration-300
                hover:scale-110 hover:bg-mauve-800
                active:scale-90 active:shadow-md
                focus:outline-none focus:ring-4 focus:ring-mauve-400/50`}>
              <ArrowLeftRight
                size={22}
                className={`transition-transform duration-500 sm:w-7 sm:h-7 ${
                  swap ? "rotate-180" : "rotate-0"
                } group-active:rotate-180`}
              />
            </button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-1 sm:gap-2 px-5 sm:px-10 pb-6 text-center">
            <span
              key={`label-${mode}-${amount}`}
              className="text-xs sm:text-sm uppercase tracking-widest text-mauve-900/60 font-serif"
              style={{
                animation: "fadeSlide 0.35s ease-out",
              }}>
              Exchanged · {fromLabel} → {toLabel}
            </span>

            <p
              key={`result-${mode}-${result}`}
              className="text-2xl sm:text-3xl md:text-4xl font-serif scale-y-125 sm:scale-y-150 text-mauve-900"
              style={{
                animation: "fadeSlide 0.35s ease-out",
              }}>
              {result.toLocaleString("en-US", {
                maximumFractionDigits: mode === "rial-to-dollar" ? 2 : 0,
              })}{" "}
              {resultLabel}
            </p>
          </div>

          {error && (
            <p className="absolute bottom-2 right-4 text-[10px] sm:text-sm text-red-800 font-serif">
              {error}
            </p>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
