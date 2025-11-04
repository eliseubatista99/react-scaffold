import { StyleSheet } from "@react-pdf/renderer";

export const templateStyles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  // Header
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: "bold", color: "#0f172a" },
  desiredRole: { fontSize: 12, color: "#334155", marginTop: 2 },

  accentBar: {
    height: 3,
    marginTop: 10,
    marginBottom: 10,
    backgroundColor: "#2563eb",
  },

  // Contact & links
  contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  contactItem: { fontSize: 9, color: "#475569", marginRight: 12 },
  separator: { fontSize: 9, color: "#cbd5e1", marginHorizontal: 8 },
  linksRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 4 },
  linkItem: {
    fontSize: 9,
    color: "#2563eb",
    textDecoration: "underline",
    marginRight: 14,
    marginBottom: 2,
  },

  // Sections
  section: { marginBottom: 14 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionAccent: {
    width: 3,
    height: 12,
    marginRight: 6,
    backgroundColor: "#2563eb",
    borderRadius: 2,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    letterSpacing: 0.3,
  },
  summary: { fontSize: 10, color: "#334155", lineHeight: 1.4 },

  // Experience
  expBlock: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },
  roleAndDate: {
    fontSize: 9,
    color: "#64748b",
    marginBottom: 3,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  roleAndCompany: { fontSize: 10, color: "#0f172a", flexDirection: "row" },
  jobRole: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  companyName: { fontSize: 10, color: "#64748b" },
  companySeparator: { fontSize: 10, color: "#64748b" },
  dateRange: { fontSize: 9, color: "#64748b" },
  tech: { fontSize: 9, color: "#2563eb", marginBottom: 3, fontWeight: "bold" },
  activities: { fontSize: 9, color: "#334155", marginBottom: 2, marginLeft: 8 },
  results: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#059669",
    marginLeft: 8,
  },

  // Education
  eduBlock: { marginBottom: 10 },
  eduTitle: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  eduInst: { fontSize: 9, color: "#64748b", marginBottom: 2 },
  eduDesc: { fontSize: 9, color: "#334155", marginLeft: 8 },

  // Skills & Languages
  skillsLangRow: { flexDirection: "row", gap: 24 },
  skillsCol: { flex: 1 },
  langCol: { flex: 1 },
  skillText: { fontSize: 9, color: "#0f172a" },
  langItem: { fontSize: 9, color: "#0f172a", marginBottom: 2 },

  // Projects
  projBlock: { marginBottom: 10 },
  projName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  projYear: { fontSize: 9, color: "#64748b", marginLeft: 6 },
  projTech: { fontSize: 9, color: "#2563eb", marginBottom: 2 },
  projDesc: { fontSize: 9, color: "#334155", marginLeft: 8 },
  projLink: { fontSize: 9, color: "#2563eb", textDecoration: "underline" },

  // Certifications
  certBlock: { marginBottom: 10 },
  certName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  certDate: { fontSize: 9, fontStyle: "italic", color: "#64748b" },
  certIssuer: { fontSize: 9, color: "#64748b" },
  certLink: { fontSize: 9, color: "#2563eb", textDecoration: "underline" },
  certDesc: { fontSize: 9, color: "#334155" },

  // Volunteer
  volBlock: { marginBottom: 10 },
  volRole: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  volOrg: { fontSize: 9, color: "#64748b" },
  volDesc: { fontSize: 9, color: "#334155" },
  volImpact: { fontSize: 9, fontStyle: "italic", color: "#059669" },
});
