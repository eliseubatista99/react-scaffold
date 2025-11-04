import { Link, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { CvTemplateProps } from "../../types";
import { BaseCVTemplate } from "../baseTemplate";
import { useTemplateHelper } from "../templates.hook";
import { templateI18n } from "./modern.i18n";
import { templateStyles as styles } from "./modern.styles";

export const CVTemplateModern = ({ data, language }: CvTemplateProps) => {
  const { i18n, getSocialUrl, formatPhone } = useTemplateHelper({
    language,
    translations: templateI18n,
  });

  const contactItems = [
    data.personalInfo?.city,
    data.personalInfo?.postalCode,
    data.personalInfo?.email,
    formatPhone(
      data.personalInfo?.countryCode || "",
      data.personalInfo?.phone || ""
    ),
  ].filter(Boolean);

  return (
    <BaseCVTemplate>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo?.name}</Text>
          {data.personalInfo?.desiredRole && (
            <Text style={styles.desiredRole}>
              {data.personalInfo.desiredRole}
            </Text>
          )}

          {/* Contact Information */}
          <View style={styles.contactRow}>
            {contactItems.map((item, index) => (
              <React.Fragment key={index}>
                <Text style={styles.contactItem}>{item}</Text>
                {index < contactItems.length - 1 && (
                  <Text style={styles.separator}>•</Text>
                )}
              </React.Fragment>
            ))}
          </View>

          {/* Social Links */}
          {data.links && data.links?.length > 0 && (
            <View style={styles.linksRow}>
              {data.links.map((link, index) => (
                <Link
                  key={index}
                  src={getSocialUrl(link)}
                  style={styles.linkItem}
                >
                  {i18n.global.link(link.type)}: {link.value}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Professional Summary */}
        {data.resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.summary.title}
            </Text>
            <Text style={styles.summary}>{data.resume}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experiences && data.experiences?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.experience.title}
            </Text>
            {data.experiences?.map((exp, index) => (
              <View key={index} style={styles.expBlock}>
                <View style={styles.roleAndDate}>
                  <View style={styles.roleAndCompany}>
                    <Text style={styles.jobRole}>{exp.role}</Text>
                    <Text style={styles.companySeparator}> • </Text>
                    <Text style={styles.companyName}>{exp.company}</Text>
                  </View>
                  <Text style={styles.dateRange}>
                    {i18n.global.time.month(exp.startMonth)} {exp.startYear} -{" "}
                    {exp.current
                      ? i18n.global.time.current
                      : `${i18n.global.time.month(exp.endMonth)} ${
                          exp.endYear
                        }`}
                  </Text>
                </View>
                {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                {exp.activities && (
                  <Text style={styles.activities}>{exp.activities}</Text>
                )}
                {exp.results && (
                  <Text style={styles.results}>{exp.results}</Text>
                )}
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
            {data.education.map((edu, index) => (
              <View key={index} style={styles.eduBlock}>
                <View style={styles.roleAndDate}>
                  <Text style={styles.eduTitle}>{edu.course}</Text>
                  <Text style={styles.dateRange}>
                    {i18n.global.time.month(edu.startMonth)} {edu.startYear} -{" "}
                    {i18n.global.time.month(edu.endMonth)} {edu.endYear}
                  </Text>
                </View>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                {edu.description && (
                  <Text style={styles.eduDesc}>{edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills and Languages */}
        {(data.skills || (data.languages && data.languages.length > 0)) && (
          <View style={styles.section}>
            <View style={styles.skillsLangRow}>
              {data.skills && (
                <View style={styles.skillsCol}>
                  <Text style={styles.sectionTitle}>
                    {i18n.sections.skills.title}
                  </Text>
                  <View style={styles.skillsGrid}>
                    {data.skills.split(",").map((skill, index) => (
                      <Text key={index} style={styles.skillText}>
                        {skill.trim()}
                      </Text>
                    ))}
                  </View>
                </View>
              )}

              {data.languages && data.languages.length > 0 && (
                <View style={styles.langCol}>
                  <Text style={styles.sectionTitle}>
                    {i18n.sections.languages.title}
                  </Text>
                  <View style={styles.langRow}>
                    {data.languages.map((language, index) => (
                      <Text key={index} style={styles.langItem}>
                        {language.name} (
                        {i18n.global.language.level(language.level)})
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.certification.title}
            </Text>
            {data.certifications.map((cert, index) => {
              const isLast = index === data.certifications!.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.certBlock,
                    marginBottom: isLast ? 0 : styles.certBlock.marginBottom,
                    paddingBottom: isLast ? 0 : styles.certBlock.paddingBottom,
                  }}
                >
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
              );
            })}
          </View>
        )}

        {/* Volunteer Work */}
        {data.volunteers && data.volunteers.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.volunteer.title}
            </Text>
            {data.volunteers.map((vol, index) => {
              const isLast = index === data.volunteers!.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.volBlock,
                    marginBottom: isLast ? 0 : styles.volBlock.marginBottom,
                    paddingBottom: isLast ? 0 : styles.volBlock.paddingBottom,
                  }}
                >
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
                    <Text style={styles.volDesc}>{vol.description}</Text>
                  )}
                  {vol.impact && (
                    <Text style={styles.volImpact}>{vol.impact}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={{ ...styles.section, marginBottom: 0 }}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.projects.title}
            </Text>
            {data.projects.map((proj, index) => {
              const isLast = index === data.projects!.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.projBlock,
                    marginBottom: isLast ? 0 : styles.projBlock.marginBottom,
                    paddingBottom: isLast ? 0 : styles.projBlock.paddingBottom,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.projName}>{proj.name}</Text>
                    <Text style={styles.projYear}>{proj.year}</Text>
                  </View>
                  {proj.tech && (
                    <Text style={styles.projTech}>{proj.tech}</Text>
                  )}
                  {proj.description && (
                    <Text style={styles.projDesc}>{proj.description}</Text>
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
              );
            })}
          </View>
        )}
      </Page>
    </BaseCVTemplate>
  );
};
