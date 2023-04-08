import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

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

const useQuery = () => {
  const { search } = useLocation();
  return React.useMemo(() => new URLSearchParams(search), [search]);
};

export { useLocalStorage, useQuery };
