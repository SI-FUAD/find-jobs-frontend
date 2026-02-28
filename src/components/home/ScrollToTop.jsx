import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollContainer = document.getElementById("company-scroll");

    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: 0,
        behavior: "auto",
      });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}