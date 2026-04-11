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

// Static CV Data
const cvData = {
  name: "John Doe",
  title: "Full Stack Developer",
  email: "john@example.com",
  phone: "+123456789",
  summary: "Experienced developer with strong background in React and Node.js.",
  skills: ["React", "Node.js", "TypeScript", "Laravel"],
  experience: [
    {
      company: "ABC Corp",
      role: "Frontend Developer",
      duration: "2022 - Present",
    },
    {
      company: "XYZ Ltd",
      role: "Backend Developer",
      duration: "2020 - 2022",
    },
  ],
};
const cvData_01 = {
  name: "Md. Ariful Islam",
  title: "Junior Full Stack Developer",
  email: "muh.arifulislam.dev@gmail.com",
  phone: "+880 1306560747",
  location: "Cumilla, Bangladesh",

  summary:
    "Aspiring Full Stack Developer with freelance experience building real-world web applications. Seeking a collaborative environment where I can build robust, scalable systems while sharpening my system-design and problem-solving skills.",

  skills: {
    expetise: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
      "Mongoose",
      "Firebase",
      "JWT",
      "Stripe",
      "React",
      "Redux",
      "Tailwind CSS",
      "PostgreSQL",
      "Prisma",
      "Next.js",
    ],
    intermediate: [
      "JavaScript",
      "TypeScript",
      "Node.js",
      "Express.js",
      "MongoDB",
    ],
  },

  experience: [
    {
      role: "Admin Dashboard Project",
      company: "Taasu Soap",
      duration: "Project",
      description:
        "Built admin dashboard with React + TypeScript. Implemented RBAC APIs and real-time notification system improving efficiency by ~50%.",
    },
    {
      role: "Full Stack Developer",
      company: "Taasu Soap E-commerce",
      duration: "Project",
      description:
        "Developed full-stack e-commerce platform with secure REST APIs, Stripe payments, and RBAC system reducing unauthorized access by ~90%.",
    },
    {
      role: "Full Stack Developer",
      company: "10fix.com",
      duration: "Project",
      description:
        "Built service platform with JWT auth and admin dashboard reducing operational effort by ~50%.",
    },
  ],

  education: [
    {
      degree: "Diploma in Computer Science",
      institute: "Cumilla Polytechnic Institute",
      duration: "2018 - 2023",
    },
  ],
};

// Layout 1 Styles
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

// Layout 2 Styles
const styles2 = StyleSheet.create({
  page: { flexDirection: "row" },
  sidebar: { width: "30%", backgroundColor: "#eee", padding: 10 },
  main: { width: "70%", padding: 10 },
  header: { fontSize: 20, marginBottom: 10 },
});

// Layout 1 Component
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

// Main App
export default function App() {
  const [layout, setLayout] = useState("layout1");

  const renderLayout = () => {
    return <LayoutOne data={cvData_01} />;
  };

  return (
    <div style={{ height: "100vh" }}>
      <PDFViewer width="100%" height="90%">
        <Document>{renderLayout()}</Document>
      </PDFViewer>
    </div>
  );
}
