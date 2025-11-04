import { StyleSheet } from "@react-pdf/renderer";

export const templateStyles = StyleSheet.create({
  page: {
    padding: 0,
    fontSize: 10,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  // Layout
  container: { flexDirection: "row" },
  sidebar: {
    width: 180,
    backgroundColor: "#f8fafc",
    padding: 20,
    minHeight: "100%",
  },
  main: { flex: 1, padding: 30 },

  // Header (in main)
  header: { marginBottom: 16 },
  name: { fontSize: 22, fontWeight: "bold", color: "#0f172a" },
  desiredRole: { fontSize: 12, color: "#334155", marginTop: 4 },

  // Sidebar blocks
  sideSectionTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0f172a",
    marginTop: 12,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  contactItem: { fontSize: 9, color: "#334155", marginBottom: 4 },
  linkItem: {
    fontSize: 9,
    color: "#2563eb",
    textDecoration: "underline",
    marginBottom: 4,
  },
  skillPill: {
    fontSize: 9,
    color: "#0f172a",
    backgroundColor: "#e2e8f0",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 6,
    marginBottom: 6,
  },
  skillsWrap: { flexDirection: "row", flexWrap: "wrap" },
  langItem: { fontSize: 9, color: "#0f172a", marginBottom: 4 },

  // Sections (main)
  section: { marginBottom: 14 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    borderBottomStyle: "solid",
  },
  summary: { fontSize: 10, color: "#334155", lineHeight: 1.4 },

  expBlock: { marginBottom: 10 },
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
  activities: { fontSize: 9, color: "#334155", marginBottom: 3 },
  results: { fontSize: 9, fontStyle: "italic", color: "#059669" },

  eduBlock: { marginBottom: 10 },
  eduTitle: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  eduInst: { fontSize: 9, color: "#64748b", marginBottom: 3 },
  eduDesc: { fontSize: 9, color: "#334155" },

  projBlock: { marginBottom: 10 },
  projName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  projYear: { fontSize: 9, color: "#64748b", marginLeft: 6 },
  projTech: { fontSize: 9, color: "#2563eb", marginBottom: 3 },
  projDesc: { fontSize: 9, color: "#334155" },
  projLink: { fontSize: 9, color: "#2563eb", textDecoration: "underline" },

  certBlock: { marginBottom: 10 },
  certName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  certDate: { fontSize: 9, fontStyle: "italic", color: "#64748b" },
  certIssuer: { fontSize: 9, color: "#64748b" },
  certLink: { fontSize: 9, color: "#2563eb", textDecoration: "underline" },
  certDesc: { fontSize: 9, color: "#334155" },

  volBlock: { marginBottom: 10 },
  volRole: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
  volOrg: { fontSize: 9, color: "#64748b" },
  volDesc: { fontSize: 9, color: "#334155" },
  volImpact: { fontSize: 9, fontStyle: "italic", color: "#059669" },

  link: { color: "#2563eb" },
  pill: { backgroundColor: "#dbeafe" },
  accentText: { color: "#2563eb" },
});
