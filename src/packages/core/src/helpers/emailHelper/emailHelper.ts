export class EmailHelper {
  static maskEmail = (email: string | null | undefined) => {
    if (!email) {
      return "";
    }

    const [name, domain] = email.split("@");

    if (!name || !domain) return email;

    const visible = name.slice(0, 1);
    return `${visible}***@${domain}`;
  };
}
