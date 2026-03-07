import { useEffect } from "react";

// Capitalize only first character of each word if not already
function formatTitle(text) {
  if (!text) return "";

  return text
    .split(" ")
    .map(word => {
      const firstChar = word.charAt(0);
      if (firstChar === firstChar.toUpperCase()) {
        return word; // already capitalized, leave as-is
      }
      return firstChar.toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export default function usePageTitle(title) {
  useEffect(() => {
    const formatted = formatTitle(title);

    document.title = formatted
      ? `${formatted} | Find Jobs`
      : "Find Jobs";
  }, [title]);
}