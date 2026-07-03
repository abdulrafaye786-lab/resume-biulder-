import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, Experience } from '../types';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 10.5,
    color: '#1e293b',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 10,
    alignItems: 'center',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  contact: {
    fontSize: 9,
    color: '#475569',
    marginBottom: 3,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 3,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  item: {
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Helvetica-Bold',
    fontSize: 11,
    color: '#0f172a',
  },
  itemDate: {
    color: '#64748b',
    fontSize: 9.5,
  },
  itemSubtitle: {
    fontFamily: 'Helvetica-Oblique',
    fontSize: 10,
    color: '#475569',
    marginBottom: 4,
  },
  text: {
    fontSize: 9.5,
    color: '#334155',
    lineHeight: 1.4,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  skillPill: {
    fontSize: 9.5,
    color: '#334155',
  }
});

interface Props {
  data: ResumeData;
}

export const ClassicResumeTemplate: React.FC<Props> = ({ data }) => {
  const socials = [
    data.personalInfo.linkedin,
    data.personalInfo.github,
    data.personalInfo.portfolio
  ].filter(Boolean);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Name and Contacts */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Text>
          <Text style={styles.contact}>
            {data.personalInfo.email}   •   {data.personalInfo.phone}   •   {data.personalInfo.location}
          </Text>
          {socials.length > 0 && (
            <Text style={styles.contact}>
              {socials.join('   •   ')}
            </Text>
          )}
        </View>

        {/* Profile Summary */}
        {data.personalInfo.summary && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            <Text style={styles.text}>{data.personalInfo.summary}</Text>
          </View>
        )}

        {/* Work Experience */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience</Text>
          {data.experience && data.experience.length > 0 ? (
            data.experience.map((exp: Experience) => (
              <View key={exp.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{exp.position}</Text>
                  <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{exp.company}</Text>
                <Text style={styles.text}>{exp.description}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.text}>No experience added.</Text>
          )}
        </View>

        {/* Education */}
        {data.education && data.education.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Education</Text>
            {data.education.map((edu) => (
              <View key={edu.id} style={styles.item}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{edu.degree}</Text>
                  <Text style={styles.itemDate}>{edu.graduationDate}</Text>
                </View>
                <Text style={styles.itemSubtitle}>{edu.institution}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Skills */}
        {data.skills && data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills</Text>
            <Text style={styles.text}>{data.skills.join(', ')}</Text>
          </View>
        )}
        
      </Page>
    </Document>
  );
};
