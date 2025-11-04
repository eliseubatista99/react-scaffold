import { Link, Page, Text, View } from "@react-pdf/renderer";
import React from "react";
import { CvTemplateProps } from "../../types";
import { BaseCVTemplate } from "../baseTemplate";
import { useTemplateHelper } from "../templates.hook";
import { templateI18n } from "./classic.i18n";
import { templateStyles as styles } from "./classic.styles";

export const CVTemplateClassic = (props: CvTemplateProps) => {
  const { i18n, getSocialUrl, formatPhone, data } = useTemplateHelper({
    ...props,
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
        {data.personalInfo && (
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
                    <Text style={styles.separator}>|</Text>
                  )}
                </React.Fragment>
              ))}
            </View>

            {/* Social Links */}
            {data.links && data.links.length > 0 && (
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
        )}
        {/* Header Section */}

        {/* Professional Summary */}
        {data.resume && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.summary.title}
            </Text>
            <Text>{data.resume}</Text>
          </View>
        )}

        {/* Professional Experience */}
        {data.experiences && data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.experience.title}
            </Text>
            {data.experiences.map((exp, index) => {
              const showSeparator =
                data.experiences &&
                data.experiences.length > 1 &&
                index < data.experiences.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.expBlock,
                    marginBottom: showSeparator
                      ? styles.expBlock.marginBottom
                      : 0,
                    borderBottomWidth: showSeparator
                      ? styles.expBlock.borderBottomWidth
                      : 0,
                    borderBottomColor: showSeparator
                      ? styles.expBlock.borderBottomColor
                      : undefined,
                    borderBottomStyle: showSeparator
                      ? styles.expBlock.borderBottomStyle
                      : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <View style={styles.roleAndCompany}>
                      {exp.role && (
                        <Text style={styles.jobRole}>{exp.role} </Text>
                      )}
                      {exp.role && exp.company && (
                        <Text style={styles.companySeparator}>- </Text>
                      )}
                      {exp.company && (
                        <Text style={styles.companyName}>{exp.company}</Text>
                      )}
                    </View>
                    <Text style={styles.dateRange}>
                      {`${i18n.global.time.month(exp.startMonth)}${
                        exp.startMonth && exp.startYear ? "/" : ""
                      }${exp.startYear || ""} - ${
                        exp.current
                          ? i18n.global.time.current
                          : i18n.global.time.month(exp.endMonth || "") +
                            (exp.endMonth && exp.endYear ? "/" : "") +
                            (exp.endYear || "")
                      }`}
                    </Text>
                  </View>
                  {exp.tech && <Text style={styles.tech}>{exp.tech}</Text>}
                  {exp.activities && (
                    <Text style={styles.activities}>• {exp.activities}</Text>
                  )}
                  {exp.results && (
                    <Text style={styles.results}>• {exp.results}</Text>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {i18n.sections.education.title}
            </Text>
            {data.education.map((edu, index) => {
              const showSeparator =
                data.education &&
                data.education.length > 1 &&
                index < data.education.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.eduBlock,
                    marginBottom: showSeparator
                      ? styles.eduBlock.marginBottom
                      : 0,
                    borderBottomWidth: showSeparator
                      ? styles.eduBlock.borderBottomWidth
                      : 0,
                    borderBottomColor: showSeparator
                      ? styles.eduBlock.borderBottomColor
                      : undefined,
                    borderBottomStyle: showSeparator
                      ? styles.eduBlock.borderBottomStyle
                      : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.eduTitle}>
                      {edu.course}
                      {edu.course && edu.type ? " - " : ""}
                      {i18n.global.education.type(edu.type)}
                      {edu.status && (
                        <Text style={styles.certDate}>
                          {" "}
                          ({i18n.global.education.status(edu.status)})
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.dateRange}>
                      {edu.startMonth || edu.startYear
                        ? edu.status == "completed"
                          ? `${i18n.global.time.month(edu.startMonth || "")}${
                              edu.startMonth && edu.startYear ? "/" : ""
                            }${edu.startYear || ""} - ${i18n.global.time.month(
                              edu.endMonth || ""
                            )}${edu.endMonth && edu.endYear ? "/" : ""}${
                              edu.endYear || ""
                            }`
                          : `${i18n.global.time.month(edu.startMonth || "")}${
                              edu.startMonth && edu.startYear ? "/" : ""
                            }${edu.startYear || ""} - ${
                              i18n.global.time.current
                            }`
                        : ""}
                    </Text>
                  </View>
                  <Text style={styles.eduInst}>{edu.institution}</Text>
                  {edu.description && (
                    <Text style={styles.eduDesc}>• {edu.description}</Text>
                  )}
                </View>
              );
            })}
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
                  <Text style={styles.skillText}>{data.skills}</Text>
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
              const showSeparator =
                data.certifications &&
                data.certifications.length > 1 &&
                index < data.certifications.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.certBlock,
                    marginBottom: showSeparator
                      ? styles.certBlock.marginBottom
                      : 0,
                    paddingBottom: showSeparator
                      ? styles.certBlock.paddingBottom
                      : 0,
                    borderBottomWidth: showSeparator
                      ? styles.certBlock.borderBottomWidth
                      : 0,
                    borderBottomColor: showSeparator
                      ? styles.certBlock.borderBottomColor
                      : undefined,
                    borderBottomStyle: showSeparator
                      ? styles.certBlock.borderBottomStyle
                      : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.certName}>{cert.name}</Text>
                    <Text style={styles.dateRange}>{cert.completionDate}</Text>
                  </View>
                  <Text style={styles.certIssuer}>{cert.issuer}</Text>
                  {cert.validationLink && (
                    <Link src={cert.validationLink} style={styles.certLink}>
                      {cert.validationLink}
                    </Link>
                  )}
                  {cert.description && (
                    <Text style={styles.certDesc}>• {cert.description}</Text>
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
              const showSeparator =
                data.volunteers &&
                data.volunteers.length > 1 &&
                index < data.volunteers.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.volBlock,
                    marginBottom: showSeparator
                      ? styles.volBlock.marginBottom
                      : 0,
                    paddingBottom: showSeparator
                      ? styles.volBlock.paddingBottom
                      : 0,
                    borderBottomWidth: showSeparator
                      ? styles.volBlock.borderBottomWidth
                      : 0,
                    borderBottomColor: showSeparator
                      ? styles.volBlock.borderBottomColor
                      : undefined,
                    borderBottomStyle: showSeparator
                      ? styles.volBlock.borderBottomStyle
                      : undefined,
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
                    <Text style={styles.volDesc}>• {vol.description}</Text>
                  )}
                  {vol.impact && (
                    <Text style={styles.volImpact}>• {vol.impact}</Text>
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
              const showSeparator =
                data.projects &&
                data.projects.length > 1 &&
                index < data.projects.length - 1;
              return (
                <View
                  key={index}
                  style={{
                    ...styles.projBlock,
                    marginBottom: showSeparator
                      ? styles.projBlock.marginBottom
                      : 0,
                    paddingBottom: showSeparator
                      ? styles.projBlock.paddingBottom
                      : 0,
                    borderBottomWidth: showSeparator
                      ? styles.projBlock.borderBottomWidth
                      : 0,
                    borderBottomColor: showSeparator
                      ? styles.projBlock.borderBottomColor
                      : undefined,
                    borderBottomStyle: showSeparator
                      ? styles.projBlock.borderBottomStyle
                      : undefined,
                  }}
                >
                  <View style={styles.roleAndDate}>
                    <Text style={styles.projName}>{proj.name}</Text>
                    <Text style={styles.dateRange}>{proj.year}</Text>
                  </View>
                  {proj.tech && (
                    <Text style={styles.projTech}>{proj.tech}</Text>
                  )}
                  {proj.description && (
                    <Text style={styles.projDesc}>• {proj.description}</Text>
                  )}
                  {proj.link && (
                    <Link src={proj.link} style={styles.projLink}>
                      {proj.link}
                    </Link>
                  )}
                  {proj.sourceCode && (
                    <Link src={proj.sourceCode} style={styles.projLink}>
                      {proj.sourceCode}
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
