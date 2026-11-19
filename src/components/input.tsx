import React, { useState, useEffect, type SetStateAction } from "react";

interface Input_Props {
  value: number;
  setValue: React.Dispatch<SetStateAction<number>>;
  placeholder?: string;
  maxDecimals?: number;
}

export default function CenterGrowInput({
  value,
  setValue,
  placeholder = "0",
  maxDecimals = 0,
}: Input_Props) {
  const [focused, setFocused] = useState<boolean>(false);
  const [display, setDisplay] = useState<string>("");

  useEffect(() => {
    const parsed = display === "" ? 0 : Number(display);
    if (!Number.isNaN(parsed) && parsed !== value) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplay(value === 0 ? "" : String(value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const decimalRegex =
    maxDecimals === 0 ? /^\d*$/ : new RegExp(`^\\d*\\.?\\d{0,${maxDecimals}}$`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/,/g, "");

    if (raw === "") {
      setDisplay("");
      setValue(0);
      return;
    }

    if (decimalRegex.test(raw)) {
      setDisplay(raw);
      const num = Number(raw);
      setValue(Number.isNaN(num) ? 0 : num);
    }
  };

  const formatted = (() => {
    if (display === "" || display === ".") return display;
    const [intPart, decPart] = display.split(".");
    const withCommas = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decPart !== undefined ? `${withCommas}.${decPart}` : withCommas;
  })();

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm mx-auto">
      <input
        type="text"
        inputMode={maxDecimals > 0 ? "decimal" : "numeric"}
        value={formatted}
        onChange={handleChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-transparent border-0 border-b-2 border-mauve-500 outline-none
         placeholder-mauve-800 text-xl sm:text-2xl md:text-3xl transition-colors
         focus:border-transparent text-center font-serif"
      />

      <span
        className={`absolute bottom-0 left-1/2 h-0.5 bg-mauve-700 transition-all duration-300 ease-out origin-center ${
          focused ? "w-full -translate-x-1/2" : "w-0 -translate-x-1/2"
        }`}
      />
    </div>
  );
}
