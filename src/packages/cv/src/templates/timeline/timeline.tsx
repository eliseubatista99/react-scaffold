import { Link, Page, Text, View } from "@react-pdf/renderer";
import { LinkHelper } from "../../helpers";
import { CvTemplateProps } from "../../types";
import { BaseCVTemplate } from "../baseTemplate";
import { useTemplateHelper } from "../templates.hook";
import { templateI18n } from "./timeline.i18n";
import { templateStyles as styles } from "./timeline.styles";

export const CVTemplateTimeline = ({ data, language }: CvTemplateProps) => {
  const { i18n } = useTemplateHelper({
    language,
    translations: templateI18n,
  });

  return (
    <BaseCVTemplate>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo?.name}</Text>
          {data.personalInfo?.desiredRole && (
            <Text style={[styles.desiredRole, styles.desiredRole]}>
              {data.personalInfo.desiredRole}
            </Text>
          )}
          <View style={styles.contactRow}>
            <Text style={styles.contactItem}>
              {data.personalInfo?.city}{" "}
              {data.personalInfo?.postalCode
                ? `• ${data.personalInfo.postalCode}`
                : ""}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.contactItem}>
              {data.personalInfo?.countryCode} {data.personalInfo?.phone}
            </Text>
            <Text style={styles.separator}>|</Text>
            <Text style={styles.contactItem}>{data.personalInfo?.email}</Text>
          </View>
          {data.links && data.links.length > 0 && (
            <View style={styles.linksRow}>
              {data.links.map((l, i) => (
                <Link
                  key={i}
                  src={LinkHelper.getSocialUrl(l)}
                  style={[styles.linkItem, styles.link]}
                >
                  {i18n.global.link(l.type)}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {data.resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.summary.title}
            </Text>
            <Text style={styles.summary}>{data.resume}</Text>
          </View>
        )}

        {/* Experience timeline */}
        {data.experiences && data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.experience.title}
            </Text>
            {data.experiences.map((exp, i) => (
              <View key={i} style={styles.timelineRow}>
                <View style={styles.rail}>
                  <View style={styles.railLine} />
                  <View style={[styles.nodeWrap, styles.node]} />
                </View>
                <View style={styles.content}>
                  <View style={styles.rowBetween}>
                    <Text style={styles.role}>{exp.role}</Text>
                    <Text style={styles.date}>
                      {exp.startMonth && exp.startYear
                        ? `${i18n.global.time.month(exp.startMonth)} ${
                            exp.startYear
                          }`
                        : ""}
                      {exp.startMonth &&
                      exp.startYear &&
                      (exp.endMonth || exp.endYear || exp.current)
                        ? " - "
                        : ""}
                      {exp.current
                        ? i18n.global.time.current
                        : exp.endMonth && exp.endYear
                        ? `${i18n.global.time.month(exp.endMonth)} ${
                            exp.endYear
                          }`
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.meta}>{exp.company}</Text>
                  {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                  {exp.activities && (
                    <Text style={styles.activities}>• {exp.activities}</Text>
                  )}
                  {exp.results && (
                    <Text style={styles.results}>• {exp.results}</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.education.title}
            </Text>
            {data.education.map((edu, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View style={styles.rowBetween}>
                  <Text style={styles.eduTitle}>{edu.course}</Text>
                  <Text style={styles.date}>
                    {edu.startMonth && edu.startYear
                      ? `${i18n.global.time.month(edu.startMonth)} ${
                          edu.startYear
                        }`
                      : ""}
                    {edu.startMonth &&
                    edu.startYear &&
                    (edu.endMonth || edu.endYear)
                      ? " - "
                      : ""}
                    {edu.endMonth && edu.endYear
                      ? `${i18n.global.time.month(edu.endMonth)} ${edu.endYear}`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                {edu.description && (
                  <Text style={styles.eduDesc}>• {edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.skills.title}
            </Text>
            <View style={styles.skillsWrap}>
              {data.skills.split(",").map((s, i) => (
                <Text key={i} style={styles.skillPill}>
                  {s.trim()}
                </Text>
              ))}
            </View>
          </View>
        )}

        {/* Languages */}
        {data.languages && data.languages.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.languages.title}
            </Text>
            {data.languages.map((lg, i) => (
              <Text key={i} style={styles.langItem}>
                {lg.name} — {i18n.global.language.level(lg.level)}
              </Text>
            ))}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.projects.title}
            </Text>
            {data.projects.map((proj, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.projName}>{proj.name}</Text>
                  <Text style={styles.projYear}>{proj.year}</Text>
                </View>
                {proj.tech && <Text style={styles.projTech}>{proj.tech}</Text>}
                {proj.description && (
                  <Text style={styles.projDesc}>• {proj.description}</Text>
                )}
                {proj.link && (
                  <Link src={proj.link} style={styles.projLink}>
                    {i18n.sections.projects.action}
                  </Link>
                )}
                {proj.sourceCode && (
                  <Link src={proj.sourceCode} style={styles.projLink}>
                    {i18n.sections.projects.source}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.certification.title}
            </Text>
            {data.certifications.map((cert, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.certName}>{cert.name}</Text>
                  <Text style={styles.certDate}>{cert.completionDate}</Text>
                </View>
                <Text style={styles.certIssuer}>{cert.issuer}</Text>
                {cert.validationLink && (
                  <Link src={cert.validationLink} style={styles.certLink}>
                    {i18n.sections.certification.action}
                  </Link>
                )}
                {cert.description && (
                  <Text style={styles.certDesc}>{cert.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Volunteer */}
        {data.volunteers && data.volunteers.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.volunteer.title}
            </Text>
            {data.volunteers.map((vol, i) => (
              <View key={i} style={{ marginBottom: 10 }}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 2,
                  }}
                >
                  <Text style={styles.volRole}>{vol.role}</Text>
                  <Text style={styles.date}>
                    {vol.startMonth && vol.startYear
                      ? `${i18n.global.time.month(vol.startMonth)} ${
                          vol.startYear
                        }`
                      : ""}
                    {vol.startMonth &&
                    vol.startYear &&
                    (vol.endMonth || vol.endYear || vol.current)
                      ? " - "
                      : ""}
                    {vol.current
                      ? i18n.global.time.current
                      : vol.endMonth && vol.endYear
                      ? `${i18n.global.time.month(vol.endMonth)} ${vol.endYear}`
                      : ""}
                  </Text>
                </View>
                <Text style={styles.volOrg}>{vol.organization}</Text>
                {vol.description && (
                  <Text style={styles.volDesc}>• {vol.description}</Text>
                )}
                {vol.impact && (
                  <Text style={styles.volImpact}>• {vol.impact}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </BaseCVTemplate>
  );
};
