import { Link, Page, Text, View } from "@react-pdf/renderer";
import { LinkHelper } from "../../helpers";
import { CvTemplateProps } from "../../types";
import { BaseCVTemplate } from "../baseTemplate";
import { useTemplateHelper } from "../templates.hook";
import { templateI18n } from "./minimal.i18n";
import { templateStyles as base } from "./minimal.styles";

export const CVTemplateMinimal = ({ data, language }: CvTemplateProps) => {
  const { i18n } = useTemplateHelper({
    language,
    translations: templateI18n,
  });

  return (
    <BaseCVTemplate>
      <Page size="A4" style={base.page}>
        {/* Header */}
        <View style={base.header}>
          <Text style={base.name}>{data.personalInfo?.name}</Text>
          {data.personalInfo?.desiredRole ? (
            <Text style={base.desiredRole}>
              {data.personalInfo.desiredRole}
            </Text>
          ) : null}
          <View style={[base.accentBar, base.accentBar]} />

          {/* Contact */}
          <View style={base.contactRow}>
            {data.personalInfo?.city && (
              <Text style={base.contactItem}>{data.personalInfo.city}</Text>
            )}
            {data.personalInfo?.postalCode && (
              <>
                <Text style={base.separator}>•</Text>
                <Text style={base.contactItem}>
                  {data.personalInfo.postalCode}
                </Text>
              </>
            )}
            {data.personalInfo?.email && (
              <>
                <Text style={base.separator}>•</Text>
                <Link
                  src={`mailto:${data.personalInfo.email}`}
                  style={[base.contactItem, base.linkItem]}
                >
                  {data.personalInfo.email}
                </Link>
              </>
            )}
            {data.personalInfo?.phone && (
              <>
                <Text style={base.separator}>•</Text>
                <Link
                  src={`tel:${data.personalInfo.phone}`}
                  style={[base.contactItem, base.linkItem]}
                >
                  {data.personalInfo.phone}
                </Link>
              </>
            )}
          </View>

          {/* Links */}
          {data.links && data.links.length > 0 && (
            <View style={base.linksRow}>
              {data.links.map((l, i) => (
                <Link
                  key={i}
                  src={LinkHelper.getSocialUrl(l)}
                  style={[base.linkItem, base.linkItem]}
                >
                  {i18n.global.link(l.type)}
                </Link>
              ))}
            </View>
          )}
        </View>

        {/* Summary */}
        {data.resume && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.summary.title}
              </Text>
            </View>
            <Text style={base.summary}>{data.resume}</Text>
          </View>
        )}

        {/* Experience */}
        {data.experiences && data.experiences.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.experience.title}
              </Text>
            </View>
            {data.experiences.map((exp, i) => (
              <View key={i} style={base.expBlock}>
                <View style={base.roleAndDate}>
                  <View style={base.roleAndCompany}>
                    <Text style={base.jobRole}>{exp.role}</Text>
                    {exp.company && (
                      <>
                        <Text style={base.companySeparator}> • </Text>
                        <Text style={base.companyName}>{exp.company}</Text>
                      </>
                    )}
                  </View>
                  <Text style={base.dateRange}>
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
                      ? `${i18n.global.time.month(exp.endMonth)} ${exp.endYear}`
                      : ""}
                  </Text>
                </View>
                {exp.tech && (
                  <Text style={[base.tech, base.tech]}>{exp.tech}</Text>
                )}
                {exp.activities && (
                  <Text style={base.activities}>• {exp.activities}</Text>
                )}
                {exp.results && (
                  <Text style={base.results}>• {exp.results}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.education.title}
              </Text>
            </View>
            {data.education.map((edu, i) => (
              <View key={i} style={base.eduBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.eduTitle}>{edu.course}</Text>
                  <Text style={base.dateRange}>
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
                <Text style={base.eduInst}>{edu.institution}</Text>
                {edu.description && (
                  <Text style={base.eduDesc}>• {edu.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Skills & Languages */}
        {(data.skills || (data.languages && data.languages.length > 0)) && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.skillsAndLanguages.title}
              </Text>
            </View>
            <View style={base.skillsLangRow}>
              {data.skills ? (
                <View style={base.skillsCol}>
                  <Text style={base.skillText}>{data.skills}</Text>
                </View>
              ) : null}
              {data.languages && data.languages.length > 0 ? (
                <View style={base.langCol}>
                  {data.languages.map((lg, i) => (
                    <Text key={i} style={base.langItem}>
                      {lg.name} — {i18n.global.language.level(lg.level)}
                    </Text>
                  ))}
                </View>
              ) : null}
            </View>
          </View>
        )}

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.projects.title}
              </Text>
            </View>
            {data.projects.map((proj, i) => (
              <View key={i} style={base.projBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.projName}>{proj.name}</Text>
                  <Text style={base.projYear}>{proj.year}</Text>
                </View>
                {proj.tech && (
                  <Text style={[base.projTech, base.projTech]}>
                    {proj.tech}
                  </Text>
                )}
                {proj.description && (
                  <Text style={base.projDesc}>• {proj.description}</Text>
                )}
                {proj.link && (
                  <Link src={proj.link} style={[base.projLink, base.projLink]}>
                    {i18n.sections.projects.action}
                  </Link>
                )}
                {proj.sourceCode && (
                  <Link
                    src={proj.sourceCode}
                    style={[base.projLink, base.projLink]}
                  >
                    {i18n.sections.projects.source}
                  </Link>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Certifications */}
        {data.certifications && data.certifications.length > 0 && (
          <View style={base.section}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.certification.action}
              </Text>
            </View>
            {data.certifications.map((cert, i) => (
              <View key={i} style={base.certBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.certName}>{cert.name}</Text>
                  <Text style={base.certDate}>{cert.completionDate}</Text>
                </View>
                <Text style={base.certIssuer}>{cert.issuer}</Text>
                {cert.validationLink && (
                  <Link
                    src={cert.validationLink}
                    style={[base.certLink, base.certLink]}
                  >
                    {i18n.sections.certification.action}
                  </Link>
                )}
                {cert.description && (
                  <Text style={base.certDesc}>{cert.description}</Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Volunteer */}
        {data.volunteers && data.volunteers.length > 0 && (
          <View style={{ ...base.section, marginBottom: 0 }}>
            <View style={base.sectionHeader}>
              <View style={[base.sectionAccent, base.sectionAccent]} />
              <Text style={base.sectionTitle}>
                {i18n.sections.volunteer.title}
              </Text>
            </View>
            {data.volunteers.map((vol, i) => (
              <View key={i} style={base.volBlock}>
                <View style={base.roleAndDate}>
                  <Text style={base.volRole}>{vol.role}</Text>
                  <Text style={base.dateRange}>
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
                <Text style={base.volOrg}>{vol.organization}</Text>
                {vol.description && (
                  <Text style={base.volDesc}>• {vol.description}</Text>
                )}
                {vol.impact && (
                  <Text style={base.volImpact}>• {vol.impact}</Text>
                )}
              </View>
            ))}
          </View>
        )}
      </Page>
    </BaseCVTemplate>
  );
};
