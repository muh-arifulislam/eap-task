"use client";

import dynamic from "next/dynamic";

const PDFClient = dynamic(() => import("./PDFClient"), {
  ssr: false,
});

const data = {
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

// Main App
export default function App() {
  return (
    <div style={{ height: "100vh" }}>
      <PDFClient data={data} />
    </div>
  );
}
