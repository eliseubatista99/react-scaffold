import { useEffect, type EffectCallback } from "react";

export const useDidMount = (callback: EffectCallback): void => {
  useEffect(callback, []);
};
