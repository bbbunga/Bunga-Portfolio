"use client";

import type { ReactNode } from "react";
import {
  SiPython,
  SiPhp,
  SiLaravel,
  SiMysql,
  SiJavascript,
  SiNextdotjs,
  SiTailwindcss,
  SiHtml5,
  SiSelenium,
  SiGithub,
  SiPostman,
} from "react-icons/si";
import {
  IoBugOutline,
  IoCheckboxOutline,
  IoDocumentTextOutline,
  IoServerOutline,
  IoHardwareChipOutline,
  IoSparklesOutline,
  IoEyeOutline,
} from "react-icons/io5";

interface Skill {
  name: string;
  icon: ReactNode;
}

interface SkillCategory {
  title: string;
  tone: "ai" | "backend" | "frontend" | "testing";
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: "AI & Machine Learning",
    tone: "ai",
    skills: [
      { name: "Python", icon: <SiPython className="skill-icon skill-icon-python" /> },
      { name: "Machine Learning Fundamentals", icon: <IoHardwareChipOutline className="skill-icon skill-icon-ai" /> },
      { name: "Introductory Computer Vision", icon: <IoEyeOutline className="skill-icon skill-icon-vision" /> },
      { name: "Introductory Generative AI", icon: <IoSparklesOutline className="skill-icon skill-icon-genai" /> },
    ],
  },
  {
    title: "Backend Development",
    tone: "backend",
    skills: [
      { name: "PHP", icon: <SiPhp className="skill-icon skill-icon-php" /> },
      { name: "Laravel", icon: <SiLaravel className="skill-icon skill-icon-laravel" /> },
      { name: "MySQL", icon: <SiMysql className="skill-icon skill-icon-mysql" /> },
      { name: "Database Management", icon: <IoServerOutline className="skill-icon skill-icon-database" /> },
    ],
  },
  {
    title: "Frontend & Web",
    tone: "frontend",
    skills: [
      { name: "JavaScript", icon: <SiJavascript className="skill-icon skill-icon-js" /> },
      { name: "Next.js", icon: <SiNextdotjs className="skill-icon skill-icon-next" /> },
      { name: "Tailwind CSS", icon: <SiTailwindcss className="skill-icon skill-icon-tailwind" /> },
      { name: "HTML/CSS", icon: <SiHtml5 className="skill-icon skill-icon-html" /> },
    ],
  },
  {
    title: "Testing & Tools",
    tone: "testing",
    skills: [
      { name: "Software Testing", icon: <IoBugOutline className="skill-icon skill-icon-testing" /> },
      { name: "Test Documentation", icon: <IoDocumentTextOutline className="skill-icon skill-icon-docs" /> },
      { name: "Black Box Testing", icon: <IoCheckboxOutline className="skill-icon skill-icon-blackbox" /> },
      { name: "Selenium IDE", icon: <SiSelenium className="skill-icon skill-icon-selenium" /> },
      { name: "Git/GitHub", icon: <SiGithub className="skill-icon skill-icon-github" /> },
      { name: "Postman", icon: <SiPostman className="skill-icon skill-icon-postman" /> },
    ],
  },
];

export function SkillsGrid() {
  return (
    <div className="skills-category-grid">
      {skillCategories.map((category) => (
        <div
          key={category.title}
          className={`skill-category-card skill-category-card--${category.tone}`}
        >
          <h3 className="skill-category-title">{category.title}</h3>
          <div className="skill-items-grid">
            {category.skills.map((skill, skillIdx) => (
              <div
                key={skill.name}
                className="skill-item-card"
                style={{ transitionDelay: `${skillIdx * 18}ms` }}
              >
                <div className="skill-item-icon">{skill.icon}</div>
                <span className="skill-item-name">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
