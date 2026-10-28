export class EmailHelper {
  static maskEmail = (email: string | null | undefined): string => {
    const trimmedEmail = email?.trim();

    if (!trimmedEmail) {
      return "";
    }

    const separatorIndex = trimmedEmail.indexOf("@");
    const hasSingleSeparator =
      separatorIndex > 0 &&
      separatorIndex === trimmedEmail.lastIndexOf("@") &&
      separatorIndex < trimmedEmail.length - 1;

    if (!hasSingleSeparator) {
      throw new TypeError("email must contain one @ and a local part and domain.");
    }

    const name = trimmedEmail.slice(0, separatorIndex);
    const domain = trimmedEmail.slice(separatorIndex + 1);
    const [firstCodePoint] = Array.from(name);

    return `${firstCodePoint}***@${domain}`;
  };
}
