import isEqual from "lodash/isEqual";

export class ObjectsHelper {
  static isSameObject = (o1: unknown, o2: unknown): boolean => {
    const firstIsNullish = o1 === null || o1 === undefined;
    const secondIsNullish = o2 === null || o2 === undefined;

    if (firstIsNullish || secondIsNullish) {
      return firstIsNullish && secondIsNullish;
    }

    return isEqual(o1, o2);
  };
}
