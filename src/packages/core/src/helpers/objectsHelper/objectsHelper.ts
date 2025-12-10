export class ObjectsHelper {
  static isSameObject = (o1: any, o2: any): boolean => {
    if (o1 === null || o1 === undefined) {
      return o2 === null || o2 === undefined;
    }

    if (o2 === null || o2 === undefined) {
      return o1 === null || o1 === undefined;
    }

    const k1 = Object.keys(o1);
    const k2 = Object.keys(o2);

    if (k1.length !== k2.length) return false;

    return k1.every(
      (key) =>
        Object.prototype.hasOwnProperty.call(o2, key) &&
        (o1 as any)[key] === (o2 as any)[key]
    );
  };
}
