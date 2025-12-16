export class TextHelper {
  static getPascalCase = (text: string) => {
    return text.replace(/\w+/g, function (w) {
      return w[0].toUpperCase() + w.slice(1).toLowerCase();
    });
  };

  static isEqual = (text1: string, text2: string, caseSensitive = true) => {
    if (caseSensitive) {
      return text1 === text2;
    }

    return text1.toUpperCase() === text2.toUpperCase();
  };

  static isEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  static isPhoneNumber = (value: string) => {
    const phoneRegex = /^\+?\d{9,15}$/;
    return phoneRegex.test(value);
  };

  static isValidName = (value: string) => {
    const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ]+(?:[ '-][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/;
    return nameRegex.test(value);
  };
}
