import { useEffect, useRef, useState } from "react";

export default function useComponentVisible<T extends HTMLElement>() {
  const [isComponentVisible, setIsComponentVisible] = useState(false);
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleClickOutside(e: Event) {
      if (ref.current) {
        if (!ref.current.contains(e.target as HTMLElement)) {
          setIsComponentVisible(false);
        } else {
          setIsComponentVisible(true);
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  return { ref, isComponentVisible };
}
