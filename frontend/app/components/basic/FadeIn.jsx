"use client";

import { useEffect, useState } from "react";

function FadeIn({ children }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`w-full fade-in ${isVisible ? "active" : ""}`}>
      {children}
    </div>
  );
}

export default FadeIn;
