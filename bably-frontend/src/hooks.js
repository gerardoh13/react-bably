import { useEffect, useState } from "react";

const useLocalStorage = (key, defaultVal = null) => {
  const [state, setState] = useState(() => {
    let lsVal = localStorage.getItem(key);
    return lsVal ? lsVal : defaultVal;
  });
  useEffect(() => {
    if (!state) localStorage.removeItem(key);
    else localStorage.setItem(key, state);
  }, [key, state]);
  return [state, setState];
};

export { useLocalStorage };
