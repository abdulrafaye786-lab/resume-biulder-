import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import type { ResumeData, Experience, Education } from '../types';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    fontFamily: 'Helvetica',
  },
  leftColumn: {
    width: '35%',
    backgroundColor: '#090d16',
    color: '#ffffff',
    paddingTop: 35,
    paddingLeft: 25,
    paddingRight: 25,
    height: '100%',
  },
  rightColumn: {
    width: '65%',
    padding: 35,
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    height: '100%',
  },
  name: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#d4af37',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  title: {
    fontSize: 11,
    color: '#94a3b8',
    marginBottom: 25,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  sidebarSection: {
    marginBottom: 22,
  },
  sidebarTitle: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#d4af37',
    marginBottom: 8,
    textTransform: 'uppercase',
    borderBottomWidth: 1,
    borderBottomColor: '#27272a',
    paddingBottom: 4,
    letterSpacing: 1,
  },
  sidebarText: {
    fontSize: 9,
    color: '#cbd5e1',
    marginBottom: 5,
    lineHeight: 1.4,
  },
  mainSection: {
    marginBottom: 22,
  },
  mainTitle: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#2563eb',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    borderBottomWidth: 1.5,
    borderBottomColor: '#e2e8f0',
    paddingBottom: 3,
  },
  item: {
    marginBottom: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontSize: 10.5,
    fontFamily: 'Helvetica-Bold',
    color: '#0f172a',
  },
  itemDate: {
    fontSize: 8.5,
    color: '#64748b',
  },
  itemSubtitle: {
    fontSize: 9.5,
    fontFamily: 'Helvetica-Oblique',
    color: '#2563eb',
    marginBottom: 4,
  },
  itemDesc: {
    fontSize: 9,
    color: '#334155',
    lineHeight: 1.4,
  }
});

interface Props {
  data: ResumeData;
}

export const ModernCreativeTemplate: React.FC<Props> = ({ data }) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Sidebar */}
        <View style={styles.leftColumn}>
          <Text style={styles.name}>{data.personalInfo.firstName} {data.personalInfo.lastName}</Text>
          <Text style={styles.title}>{data.personalInfo.title}</Text>
          
          {/* Contact Details */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Contact</Text>
            {data.personalInfo.email && <Text style={styles.sidebarText}>✉ {data.personalInfo.email}</Text>}
            {data.personalInfo.phone && <Text style={styles.sidebarText}>☎ {data.personalInfo.phone}</Text>}
            {data.personalInfo.location && <Text style={styles.sidebarText}>📍 {data.personalInfo.location}</Text>}
          </View>

          {/* Social Details */}
          {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.portfolio) && (
            <View style={styles.sidebarSection}>
              <Text style={styles.sidebarTitle}>Links</Text>
              {data.personalInfo.linkedin && <Text style={styles.sidebarText}>LinkedIn: {data.personalInfo.linkedin}</Text>}
              {data.personalInfo.github && <Text style={styles.sidebarText}>GitHub: {data.personalInfo.github}</Text>}
              {data.personalInfo.portfolio && <Text style={styles.sidebarText}>Web: {data.personalInfo.portfolio}</Text>}
            </View>
          )}
          
          {/* Skills */}
          <View style={styles.sidebarSection}>
            <Text style={styles.sidebarTitle}>Skills</Text>
            {data.skills && data.skills.length > 0 ? (
               data.skills.map((skill: string, idx: number) => (
                 <Text key={idx} style={styles.sidebarText}>• {skill}</Text>
               ))
            ) : (
               <Text style={styles.sidebarText}>Add skills...</Text>
            )}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.rightColumn}>
          {/* Profile Summary */}
          {data.personalInfo.summary && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>Profile</Text>
              <Text style={styles.itemDesc}>{data.personalInfo.summary}</Text>
            </View>
          )}

          {/* Work Experience */}
          <View style={styles.mainSection}>
            <Text style={styles.mainTitle}>Experience</Text>
            {data.experience && data.experience.length > 0 ? (
              data.experience.map((exp: Experience) => (
                <View key={exp.id} style={styles.item}>
                  <View style={styles.itemHeader}>
                    <Text style={styles.itemTitle}>{exp.position}</Text>
                    <Text style={styles.itemDate}>{exp.startDate} - {exp.endDate}</Text>
                  </View>
                  <Text style={styles.itemSubtitle}>{exp.company}</Text>
                  <Text style={styles.itemDesc}>{exp.description}</Text>
                </View>
              ))
            ) : (
              <Text style={styles.itemDesc}>No experience added.</Text>
            )}
          </View>

          {/* Education */}
          {data.education && data.education.length > 0 && (
            <View style={styles.mainSection}>
              <Text style={styles.mainTitle}>Education</Text>
              {data.education.map((edu: Education) => (
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

        </View>
      </Page>
    </Document>
  );
};
