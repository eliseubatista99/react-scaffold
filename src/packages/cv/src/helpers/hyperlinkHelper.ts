import { Link } from "../types";

export class LinkHelper {
  static getSocialUrl(link: Link) {
    if (!link.value) return "";
    const val = link.value.trim();
    const hasProtocol = /^https?:\/\//i.test(val);

    if (link.type === "email") return `mailto:${val}`;
    if (link.type === "phone") return `tel:${val}`;

    // If the value already includes a known domain but lacks protocol, prefix https
    if (!hasProtocol) {
      if (/linkedin\.com/i.test(val)) return `https://${val}`;
      if (/github\.com/i.test(val)) return `https://${val}`;
      if (/gitlab\.com/i.test(val)) return `https://${val}`;
    }

    if (!hasProtocol) {
      if (link.type === "linkedin") return `https://www.linkedin.com/in/${val}`;
      if (link.type === "github") return `https://github.com/${val}`;
      return `https://${val}`; // portfolio/other
    }
    return val;
  }

  static formatPhone(countryCode: string, phone: string) {
    return countryCode && phone
      ? `${countryCode.match(/\(([^)]+)\)/)?.[1] || countryCode} ${phone}`
      : phone;
  }
}
