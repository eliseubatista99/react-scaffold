import { Link, Page, Text, View } from "@react-pdf/renderer";
import { CvTemplateProps } from "../../types";
import { BaseCVTemplate } from "../baseTemplate";
import { useTemplateHelper } from "../templates.hook";
import { templateI18n } from "./minimal.i18n";
import { templateStyles as styles } from "./minimal.styles";

export const CVTemplateMinimal = (props: CvTemplateProps) => {
  const { i18n, getSocialUrl, formatPhone, data } = useTemplateHelper({
    ...props,
    translations: templateI18n,
  });

  return (
    <BaseCVTemplate>
      <Page size="A4" style={styles.page}>
        <View style={styles.container}>
          {/* Sidebar */}
          <View style={styles.sidebar}>
            <Text style={styles.sideSectionTitle}>
              {data.personalInfo?.name}
            </Text>
            {data.personalInfo?.desiredRole && (
              <Text
                style={[
                  styles.contactItem,
                  styles.desiredRole,
                  styles.accentText,
                ]}
              >
                {data.personalInfo.desiredRole}
              </Text>
            )}

            <Text style={styles.sideSectionTitle}>
              {i18n.sections.contacts.title}
            </Text>
            <Text style={styles.contactItem}>
              {data.personalInfo?.city}{" "}
              {data.personalInfo?.postalCode
                ? `• ${data.personalInfo?.postalCode}`
                : ""}
            </Text>
            <Text style={styles.contactItem}>
              {data.personalInfo?.countryCode} {data.personalInfo?.phone}
            </Text>
            <Text style={styles.contactItem}>{data.personalInfo?.email}</Text>

            {data.links && data.links.length > 0 && (
              <>
                <Text style={styles.sideSectionTitle}>
                  {i18n.sections.links.title}
                </Text>
                {data.links.map((l, i) => (
                  <Link
                    key={i}
                    src={getSocialUrl(l)}
                    style={[styles.linkItem, styles.link]}
                  >
                    {i18n.global.link(l.type)}
                  </Link>
                ))}
              </>
            )}

            {data.skills && (
              <>
                <Text style={styles.sideSectionTitle}>
                  {i18n.sections.skills.title}
                </Text>
                <View style={styles.skillsWrap}>
                  {data.skills.split(",").map((s, i) => (
                    <Text key={i} style={[styles.skillPill, styles.pill]}>
                      {s.trim()}
                    </Text>
                  ))}
                </View>
              </>
            )}

            {data.languages && data.languages.length > 0 && (
              <>
                <Text style={styles.sideSectionTitle}>
                  {i18n.sections.languages.title}
                </Text>
                {data.languages.map((lg, i) => (
                  <Text key={i} style={styles.langItem}>
                    {lg.name} — {i18n.global.language.level(lg.level)}
                  </Text>
                ))}
              </>
            )}
          </View>

          {/* Main */}
          <View style={styles.main}>
            <View style={styles.header}>
              <Text style={styles.name}>{data.personalInfo?.name}</Text>
              {data.personalInfo?.desiredRole && (
                <Text style={[styles.desiredRole, styles.accentText]}>
                  {data.personalInfo.desiredRole}
                </Text>
              )}
            </View>

            {data.resume && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.summary.title}
                </Text>
                <Text style={styles.summary}>{data.resume}</Text>
              </View>
            )}

            {data.experiences && data.experiences.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.experience.title}
                </Text>
                {data.experiences.map((exp, i) => {
                  const showSep =
                    data.experiences &&
                    data.experiences.length > 1 &&
                    i < data.experiences.length - 1;
                  return (
                    <View
                      key={i}
                      style={{
                        ...styles.expBlock,
                        marginBottom: showSep
                          ? styles.expBlock.marginBottom
                          : 0,
                      }}
                    >
                      <View style={styles.roleAndDate}>
                        <Text style={styles.dateRange}>
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
                      <View style={styles.roleAndCompany}>
                        <Text style={styles.jobRole}>{exp.role}</Text>
                        <Text style={styles.companySeparator}>{"  •  "}</Text>
                        <Text style={styles.companyName}>{exp.company}</Text>
                      </View>
                      {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                      {exp.activities && (
                        <Text style={styles.activities}>
                          • {exp.activities}
                        </Text>
                      )}
                      {exp.results && (
                        <Text style={styles.results}>• {exp.results}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            )}

            {data.education && data.education.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.education.title}
                </Text>
                {data.education.map((edu, i) => (
                  <View key={i} style={styles.eduBlock}>
                    <Text style={styles.eduTitle}>{edu.course}</Text>
                    <Text style={styles.eduInst}>{edu.institution}</Text>
                    {edu.description && (
                      <Text style={styles.eduDesc}>• {edu.description}</Text>
                    )}
                  </View>
                ))}
              </View>
            )}

            {data.projects && data.projects.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.projects.title}
                </Text>
                {data.projects.map((proj, i) => (
                  <View key={i} style={styles.projBlock}>
                    <View style={styles.roleAndDate}>
                      <Text style={styles.projName}>{proj.name}</Text>
                      <Text style={styles.projYear}>{proj.year}</Text>
                    </View>
                    {proj.tech && (
                      <Text style={styles.projTech}>{proj.tech}</Text>
                    )}
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

            {data.certifications && data.certifications.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.certification.title}
                </Text>
                {data.certifications.map((cert, i) => (
                  <View key={i} style={styles.certBlock}>
                    <View style={styles.roleAndDate}>
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

            {data.volunteers && data.volunteers.length > 0 && (
              <View style={{ ...styles.section, marginBottom: 0 }}>
                <Text style={[styles.sectionTitle, styles.sectionTitle]}>
                  {i18n.sections.volunteer.title}
                </Text>
                {data.volunteers.map((vol, i) => (
                  <View key={i} style={styles.volBlock}>
                    <View style={styles.roleAndDate}>
                      <Text style={styles.volRole}>{vol.role}</Text>
                      <Text style={styles.dateRange}>
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
                          ? `${i18n.global.time.month(vol.endMonth)} ${
                              vol.endYear
                            }`
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
          </View>
        </View>
      </Page>
    </BaseCVTemplate>
  );
};
