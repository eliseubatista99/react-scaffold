import { useEffect } from "react";

export const useDidMount = (arg: () => void) => useEffect(arg, []);
