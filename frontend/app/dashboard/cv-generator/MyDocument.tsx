/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  PDFViewer,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles1 = StyleSheet.create({
  page: {
    paddingTop: 30,
    paddingBottom: 40,
    paddingHorizontal: 30,
    fontSize: 10,
    lineHeight: 1.5,
    fontFamily: "Helvetica",
  },

  // Header
  header: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },

  subHeader: {
    fontSize: 12,
    marginBottom: 6,
    color: "#444",
  },

  contact: {
    fontSize: 9,
    marginBottom: 10,
    color: "#555",
  },

  // Section
  section: {
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 2,
  },

  // Text
  text: {
    fontSize: 10,
    marginBottom: 3,
  },

  // List item
  bullet: {
    fontSize: 10,
    marginLeft: 6,
    marginBottom: 2,
  },

  // Experience block
  itemHeader: {
    fontSize: 11,
    fontWeight: "bold",
  },

  itemSubHeader: {
    fontSize: 9,
    color: "#666",
    marginBottom: 2,
  },

  itemDescription: {
    fontSize: 10,
    marginBottom: 4,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginLeft: 10,
  },

  skillItem: {
    fontSize: 10,
    marginRight: 6,
  },
});

const LayoutOne = ({ data }: { data: any }) => (
  <Page size="A4" style={styles1.page}>
    {/* Header */}
    <Text style={styles1.header}>{data.name}</Text>
    <Text style={styles1.subHeader}>{data.title}</Text>

    <Text style={styles1.contact}>
      {data.email} | {data.phone}
    </Text>
    <Text style={styles1.contact}>{data.location}</Text>

    {/* Summary */}
    <View style={styles1.section}>
      <Text style={styles1.sectionTitle}>Career Objective</Text>
      <Text style={styles1.text}>{data.summary}</Text>
    </View>

    {/* Skills */}
    <View style={styles1.section}>
      <Text style={styles1.sectionTitle}>Skills</Text>
      <Text style={styles1.itemHeader}>Technical Skill:</Text>
      <View style={styles1.skillsContainer}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 6 }}
        >
          <Text style={{ marginRight: 5 }}>{"\u2022"}</Text>
          <Text style={styles1.itemHeader}>Expertise:</Text>
        </View>
        {data.skills.expetise.map((skill: any, i: number) => (
          <Text key={i} style={styles1.skillItem}>
            {skill},
          </Text>
        ))}
      </View>
      <View style={styles1.skillsContainer}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 6 }}
        >
          <Text style={{ marginRight: 5 }}>{"\u2022"}</Text>
          <Text style={styles1.itemHeader}>Intermediate:</Text>
        </View>
        {data.skills.intermediate.map((skill: any, i: number) => (
          <Text key={i} style={styles1.skillItem}>
            {skill},
          </Text>
        ))}
      </View>
      <View style={styles1.skillsContainer}>
        <View
          style={{ flexDirection: "row", alignItems: "center", marginRight: 6 }}
        >
          <Text style={{ marginRight: 5 }}>{"\u2022"}</Text>
          <Text style={styles1.itemHeader}>Fimiliar:</Text>
        </View>
        {data.skills.intermediate.map((skill: any, i: number) => (
          <Text key={i} style={styles1.skillItem}>
            {skill},
          </Text>
        ))}
      </View>
    </View>

    {/* Experience / Projects */}
    <View style={styles1.section}>
      <Text style={styles1.sectionTitle}>Projects</Text>
      {data.experience.map((exp: any, i: number) => (
        <View key={i} style={{ marginBottom: 8 }}>
          <Text style={styles1.itemHeader}>
            {exp.role} - {exp.company}
          </Text>
          <Text style={styles1.itemSubHeader}>{exp.duration}</Text>
          <Text style={styles1.itemDescription}>{exp.description}</Text>
        </View>
      ))}
    </View>

    {/* Education */}
    <View style={styles1.section}>
      <Text style={styles1.sectionTitle}>Education</Text>
      {data.education.map((edu: any, i: number) => (
        <View key={i} style={{ marginBottom: 6 }}>
          <Text style={styles1.itemHeader}>
            {edu.degree} - {edu.institute}
          </Text>
          <Text style={styles1.itemSubHeader}>{edu.duration}</Text>
        </View>
      ))}
    </View>
  </Page>
);

export default function MyDocument({ data }: any) {
  const renderLayout = () => {
    return <LayoutOne data={data} />;
  };

  return <Document>{renderLayout()}</Document>;
}
