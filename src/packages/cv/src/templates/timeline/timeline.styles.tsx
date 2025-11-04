import { StyleSheet } from "@react-pdf/renderer";
import { BaseTheme } from "../../theme";
import { CvTheme } from "../../types";

export const getStyles = (theme?: CvTheme) => {
  const finalTheme = { ...BaseTheme, ...theme };

  return StyleSheet.create({
    page: {
      padding: 30,
      fontSize: 10,
      fontFamily: "Helvetica",
      backgroundColor: "#ffffff",
    },
    header: {
      marginBottom: 18,
      paddingBottom: 10,
      borderBottomWidth: 2,
      borderBottomColor: "#e5e7eb",
      borderBottomStyle: "solid",
    },
    name: { fontSize: 24, fontWeight: "bold", color: "#0f172a" },
    desiredRole: {
      fontSize: 12,
      color: finalTheme.color,
      fontWeight: "bold",
      marginTop: 4,
    },
    contactRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
    contactItem: { fontSize: 9, color: "#475569", marginRight: 12 },
    separator: { fontSize: 9, color: "#cbd5e1", marginHorizontal: 8 },
    linksRow: { flexDirection: "row", flexWrap: "wrap", marginTop: 6 },
    linkItem: {
      fontSize: 9,
      color: finalTheme.color,
      textDecoration: "none",
      marginRight: 14,
      marginBottom: 2,
    },

    section: { marginBottom: 16 },
    sectionTitle: {
      fontSize: 12,
      fontWeight: "bold",
      color: "#0f172a",
      marginBottom: 10,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },

    // Timeline layout
    timelineRow: { flexDirection: "row" },
    rail: { width: 14, alignItems: "center" },
    railLine: { width: 2, backgroundColor: "#e5e7eb", flex: 1 },
    nodeWrap: {
      position: "absolute",
      left: 3,
      width: 8,
      height: 8,
      borderRadius: 4,
      backgroundColor: finalTheme.color,
    },
    content: { flex: 1, paddingLeft: 14, paddingBottom: 12 },
    date: { fontSize: 9, color: "#64748b", marginBottom: 2 },
    role: { fontSize: 11, fontWeight: "bold", color: "#0f172a" },
    meta: { fontSize: 9, color: "#64748b", marginBottom: 2 },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 2,
    },
    tech: {
      fontSize: 9,
      color: finalTheme.color,
      marginBottom: 3,
      fontWeight: "bold",
    },
    activities: { fontSize: 9, color: "#334155", marginBottom: 3 },
    results: { fontSize: 9, fontStyle: "italic", color: finalTheme.color },

    // Other blocks
    summary: { fontSize: 10, color: "#334155", lineHeight: 1.4 },
    eduTitle: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    eduInst: { fontSize: 9, color: "#64748b", marginBottom: 3 },
    eduDesc: { fontSize: 9, color: "#334155" },
    skillsWrap: { flexDirection: "row", flexWrap: "wrap" },
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
    langItem: { fontSize: 9, color: "#0f172a", marginBottom: 4 },

    projName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    projYear: { fontSize: 9, color: "#64748b", marginLeft: 6 },
    projTech: { fontSize: 9, color: finalTheme.color, marginBottom: 3 },
    projDesc: { fontSize: 9, color: "#334155" },
    projLink: {
      fontSize: 9,
      color: finalTheme.color,
      textDecoration: "none",
    },

    certName: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    certDate: { fontSize: 9, fontStyle: "italic", color: "#64748b" },
    certIssuer: { fontSize: 9, color: "#64748b" },
    certLink: {
      fontSize: 9,
      color: finalTheme.color,
      textDecoration: "none",
    },
    certDesc: { fontSize: 9, color: "#334155" },

    volRole: { fontSize: 10, fontWeight: "bold", color: "#0f172a" },
    volOrg: { fontSize: 9, color: "#64748b" },
    volDesc: { fontSize: 9, color: "#334155" },
    volImpact: { fontSize: 9, fontStyle: "italic", color: finalTheme.color },

    node: { backgroundColor: finalTheme.color },
    link: { color: finalTheme.color },
  });
};
