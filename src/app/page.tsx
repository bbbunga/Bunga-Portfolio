"use client";

import {
  type CSSProperties,
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { IconType } from "react-icons";
import {
  SiGit,
  SiGithub,
  SiJavascript,
  SiLaravel,
  SiNextdotjs,
  SiOpencv,
  SiPhp,
  SiPostman,
  SiPython,
  SiPytorch,
  SiReact,
  SiSelenium,
  SiTensorflow,
} from "react-icons/si";
import { VscVscode } from "react-icons/vsc";
import { useStaggerReveal } from "@/hooks/useStaggerReveal";

type ThemeMode = "light" | "dark";

const themeStorageKey = "bunga-theme-mode";
const themeTransitionDuration = 900;
const themeCommitDelay = 650;

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const themeSubscribers = new Set<() => void>();

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark";
}

function getThemeSnapshot(): ThemeMode {
  if (typeof window === "undefined") return "light";

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    return isThemeMode(storedTheme) ? storedTheme : "light";
  } catch {
    return "light";
  }
}

function getThemeServerSnapshot(): ThemeMode {
  return "light";
}

function subscribeToThemeStore(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => {};

  const handleStorage = (event: StorageEvent) => {
    if (event.key === themeStorageKey) {
      onStoreChange();
    }
  };

  themeSubscribers.add(onStoreChange);
  window.addEventListener("storage", handleStorage);

  return () => {
    themeSubscribers.delete(onStoreChange);
    window.removeEventListener("storage", handleStorage);
  };
}

function saveThemeMode(mode: ThemeMode) {
  try {
    window.localStorage.setItem(themeStorageKey, mode);
  } catch {
    return;
  }

  themeSubscribers.forEach((onStoreChange) => onStoreChange());
}

type SkillItem = {
  label: string;
  Icon: IconType;
  color: string;
};

type SkillCategory = {
  title: string;
  summary: string;
  accent: string;
  tint: string;
  items: SkillItem[];
};

function SkillChip({ item }: { item: SkillItem }) {
  const Icon = item.Icon;

  return (
    <li className="skill-chip">
      <span className="skill-chip-icon" style={{ color: item.color }}>
        <Icon aria-hidden="true" />
      </span>
      <span className="skill-chip-label">{item.label}</span>
    </li>
  );
}

const formatSkillIndex = (index: number) => String(index + 1).padStart(2, "0");

const skillCategories: SkillCategory[] = [
  {
    title: "Programming Languages",
    summary: "Core languages used in coursework and project prototypes.",
    accent: "#e98972",
    tint: "#f8e8e2",
    items: [
      { label: "Python", Icon: SiPython, color: "#3776AB" },
      { label: "JavaScript", Icon: SiJavascript, color: "#F7DF1E" },
      { label: "PHP", Icon: SiPhp, color: "#777BB4" },
    ],
  },
  {
    title: "Web & Frameworks",
    summary: "Frameworks used to build structured web applications.",
    accent: "#75acc6",
    tint: "#e8f4fb",
    items: [
      { label: "React", Icon: SiReact, color: "#61DAFB" },
      { label: "Next.js", Icon: SiNextdotjs, color: "#111111" },
      { label: "Laravel", Icon: SiLaravel, color: "#FF2D20" },
    ],
  },
  {
    title: "Tools & QA",
    summary: "Workflow tools and testing support used in daily work.",
    accent: "#9faee3",
    tint: "#eef0fb",
    items: [
      { label: "Git", Icon: SiGit, color: "#F05032" },
      { label: "GitHub", Icon: SiGithub, color: "#181717" },
      { label: "VS Code", Icon: VscVscode, color: "#007ACC" },
      { label: "Postman", Icon: SiPostman, color: "#FF6C37" },
      { label: "Selenium IDE", Icon: SiSelenium, color: "#43B02A" },
    ],
  },
  {
    title: "AI & ML",
    summary: "Python libraries and machine learning basics used in AI learning.",
    accent: "#848f52",
    tint: "#eef3df",
    items: [
      { label: "OpenCV", Icon: SiOpencv, color: "#5C3EE8" },
      { label: "PyTorch", Icon: SiPytorch, color: "#EE4C2C" },
      { label: "TensorFlow", Icon: SiTensorflow, color: "#FF6F00" },
    ],
  },
];

// Scroll reveal hook
function useScrollReveal() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Add is-revealed class immediately to all elements
      const revealElements = document.querySelectorAll("[data-reveal]");
      revealElements.forEach((el) => el.classList.add("is-revealed"));
      return;
    }

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    });

    // Observe all reveal elements
    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((el) => {
      observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);
}

function ThemeGlyph({ mode }: { mode: ThemeMode }) {
  if (mode === "light") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2.3M12 19.7V22M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2 12h2.3M19.7 12H22M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 15.2A8.2 8.2 0 0 1 8.8 3.6a8.4 8.4 0 1 0 11.6 11.6Z" />
    </svg>
  );
}

function ThemeSwitcher() {
  const themeMode = useSyncExternalStore<ThemeMode>(
    subscribeToThemeStore,
    getThemeSnapshot,
    getThemeServerSnapshot,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const commitTimerRef = useRef<number | null>(null);
  const transitionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = themeMode;
    root.style.colorScheme = themeMode;
  }, [themeMode]);

  useEffect(() => {
    if (!isOpen) return;

    optionRefs.current[0]?.focus();

    const handlePointerDown = (event: PointerEvent) => {
      if (menuRef.current?.contains(event.target as Node)) return;

      setIsOpen(false);
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (commitTimerRef.current) {
        window.clearTimeout(commitTimerRef.current);
      }

      if (transitionTimerRef.current) {
        window.clearTimeout(transitionTimerRef.current);
      }
    };
  }, []);

  const chooseThemeMode = (nextMode: ThemeMode) => {
    setIsOpen(false);

    if (nextMode === themeMode || isTransitioning) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      saveThemeMode(nextMode);
      return;
    }

    setIsTransitioning(true);

    window.dispatchEvent(
      new CustomEvent("bunga-theme-transition", {
        detail: { theme: nextMode },
      }),
    );

    commitTimerRef.current = window.setTimeout(() => {
      saveThemeMode(nextMode);
      commitTimerRef.current = null;
    }, themeCommitDelay);

    transitionTimerRef.current = window.setTimeout(() => {
      setIsTransitioning(false);
      transitionTimerRef.current = null;
    }, themeTransitionDuration);
  };

  return (
    <div className="theme-menu" ref={menuRef}>
      <button
        className="theme-trigger"
        type="button"
        ref={triggerRef}
        aria-label={`Pilih tema. Saat ini ${themeMode === "light" ? "Light" : "Dark"}.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        disabled={isTransitioning}
        onClick={() => setIsOpen((current: boolean) => !current)}
      >
        <ThemeGlyph mode={themeMode} />
      </button>

      {isOpen ? (
        <div className="theme-dropdown" role="menu" aria-label="Pilihan tema">
          {themeOptions.map((option, index) => (
            <button
              className={`theme-menu-item${
                themeMode === option.value ? " is-active" : ""
              }`}
              type="button"
              key={option.value}
              disabled={isTransitioning}
              ref={(element: HTMLButtonElement | null) => {
                optionRefs.current[index] = element;
              }}
              role="menuitemradio"
              aria-checked={themeMode === option.value}
              onClick={() => chooseThemeMode(option.value)}
              onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
                if (event.key === "ArrowDown" || event.key === "ArrowRight") {
                  event.preventDefault();
                  optionRefs.current[
                    (index + 1) % themeOptions.length
                  ]?.focus();
                }

                if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
                  event.preventDefault();
                  optionRefs.current[
                    (index - 1 + themeOptions.length) % themeOptions.length
                  ]?.focus();
                }

                if (event.key === "Home") {
                  event.preventDefault();
                  optionRefs.current[0]?.focus();
                }

                if (event.key === "End") {
                  event.preventDefault();
                  optionRefs.current[themeOptions.length - 1]?.focus();
                }
              }}
            >
              <span className="theme-menu-icon">
                <ThemeGlyph mode={option.value} />
              </span>
              <span>{option.label}</span>
              <span className="theme-check" aria-hidden="true">
                ✓
              </span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

const projects = [
  {
    number: "01",
    semester: "Semester 1 | 2024/2025",
    title: "Clothing Rental Application",
    summary:
      "A rental application project focused on clothing inventory, customer records, and transaction status tracking.",
    details: [
      "Designed a rental workflow for clothing rental operations",
      "Organized item records, customer data, and transaction status tracking",
      "Prepared feature requirements, user flow drafts, and solution presentations",
      "Developed the project within the Project Based Learning framework",
    ],
    role: "Team Member",
    focus: "Application Design, Requirement Planning, Workflow Design",
    repoUrl: "",
    demoUrl: "",
    repoLabel: "GitHub repo for Clothing Rental Application",
    demoLabel: "Live demo for Clothing Rental Application",
  },
  {
    number: "02",
    semester: "Semester 2 | 2024/2025",
    title: "MyLodies — Web-Based Music Instrument Rental Application",
    summary:
      "A web-based rental platform for musical instruments, including catalog browsing, booking, and rental transaction management.",
    details: [
      "Designed and developed feature ideas for catalog browsing and booking",
      "Helped structure the rental transaction management flow",
      "Collaborated on interface planning and application logic",
      "Contributed to project documentation within a team setting",
    ],
    role: "Team Member",
    focus: "Web Development, UI Planning, Application Logic, Documentation",
    repoUrl: "https://github.com/lihh72/mylodies-pbl",
    demoUrl: "https://mylodies.xyz/",
    repoLabel: "GitHub repo for MyLodies",
    demoLabel: "Live demo for MyLodies",
  },
  {
    number: "03",
    semester: "Semester 3 | 2025/2026",
    title:
      "Diffusion Model for Face Synthesis Based on Ethnic Characteristics in Indonesia",
    summary:
      "An artificial-intelligence-based project exploring synthetic face generation using diffusion model approaches.",
    details: [
      "Explored data and model approaches for synthetic face generation",
      "Studied diffusion-based generative AI methods",
      "Contributed to experimentation, documentation, and presentation",
      "Strengthened understanding of generative AI workflows",
    ],
    role: "Team Member",
    focus:
      "Artificial Intelligence, Generative AI, Diffusion Models, Research Documentation",
    repoUrl: "https://github.com/nijam10/EtnivisAI",
    demoUrl: "https://tribevis-ai.vercel.app/",
    repoLabel: "GitHub repo for Diffusion Model project",
    demoLabel: "Live demo for Diffusion Model project",
  },
  {
    number: "04",
    semester: "Semester 4 | 2025/2026",
    title: "Real-Time Sign Language Recognition System Based on Deep Learning",
    summary:
      "A deep-learning-based project for real-time sign language recognition using computer vision concepts.",
    details: [
      "Designed the project concept and system workflow",
      "Supported requirement planning and data preparation discussions",
      "Contributed to prototype and testing activities",
      "Focused on real-time recognition and computer vision application",
    ],
    role: "Team Member",
    focus:
      "Deep Learning, Computer Vision, Sign Language Recognition, Prototype Testing",
    repoUrl: "https://github.com/godlovesmei/signify-ai",
    demoUrl: "",
    repoLabel: "GitHub repo for Sign Language Recognition System",
    demoLabel: "Live demo for Sign Language Recognition System",
  },
];

function ProjectCard({ project, index }: { project: (typeof projects)[number]; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const revealRef = useStaggerReveal<HTMLElement>(index * 100);

  const toggleProjectCard = () => {
    setExpanded((current: boolean) => !current);
  };

  const handleCardClick = (event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const clickedLink = target.closest("a");
    const clickedButton = target.closest("button");
    const clickedDisabled = target.closest(".is-disabled");

    if (clickedLink || clickedButton || clickedDisabled) return;

    toggleProjectCard();
  };

  const handleCardKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (
      (event.key === "Enter" || event.key === " ") &&
      event.target === event.currentTarget
    ) {
      event.preventDefault();
      toggleProjectCard();
    }
  };

  return (
    <article
      ref={revealRef}
      className={`project-file${expanded ? " is-expanded" : ""}`}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`${expanded ? "Close" : "Open"} project archive details`}
    >
      <div className="file-header">
        <span className="file-number">{project.number}</span>
        <span className="file-semester">{project.semester}</span>
      </div>

      <h3>{project.title}</h3>
      <p>{project.summary}</p>

      <button
        className="file-toggle"
        type="button"
        aria-expanded={expanded}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          event.stopPropagation();
          toggleProjectCard();
        }}
      >
        <span>{expanded ? "CLOSE FILE" : "OPEN FILE"}</span>
        <span className="file-toggle-arrow" aria-hidden="true">
          →
        </span>
      </button>

      <div className="file-details" aria-hidden={!expanded}>
        <div>
          <div className="file-details-inner">
            <h4>Full Description</h4>
            <ul>
              {project.details.map((detail) => (
                <li key={detail}>{detail}</li>
              ))}
            </ul>

            <h4>Role</h4>
            <p>{project.role}</p>

            <h4>Focus Areas</h4>
            <p>{project.focus}</p>

            <div className="file-links">
              <a
                className="catalog-link"
                href={project.repoUrl || "#"}
                target={project.repoUrl ? "_blank" : undefined}
                rel={project.repoUrl ? "noopener noreferrer" : undefined}
                aria-label={project.repoLabel}
              >
                GitHub Repo →
              </a>

              <a
                className="catalog-link"
                href={project.demoUrl || "#"}
                target={project.demoUrl ? "_blank" : undefined}
                rel={project.demoUrl ? "noopener noreferrer" : undefined}
                aria-label={project.demoLabel}
              >
                Live Demo →
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  useScrollReveal();
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let previousScrollY = window.scrollY;
    let ticking = false;
    const scrollThreshold = 8;
    const hideAfter = 120;

    const updateHeaderVisibility = () => {
      const currentScrollY = window.scrollY;
      const scrollDelta = currentScrollY - previousScrollY;

      setShowBackToTop(currentScrollY > 420);

      if (currentScrollY <= 20) {
        setIsHeaderHidden(false);
      } else if (scrollDelta > scrollThreshold && currentScrollY > hideAfter) {
        setIsHeaderHidden(true);
      } else if (scrollDelta < -scrollThreshold) {
        setIsHeaderHidden(false);
      }

      previousScrollY = currentScrollY;
      ticking = false;
    };

    const handleScroll = () => {
      if (ticking) return;

      ticking = true;
      window.requestAnimationFrame(updateHeaderVisibility);
    };

    updateHeaderVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      window.scrollTo({ top: 0 });
      return;
    }

    const startY = window.scrollY;
    const pixelsPerMillisecond = 4.2;
    const duration = Math.min(760, Math.max(360, startY / pixelsPerMillisecond));
    const startTime = window.performance.now();
    const root = document.documentElement;
    const previousScrollBehavior = root.style.scrollBehavior;

    root.style.scrollBehavior = "auto";

    const animateScroll = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      window.scrollTo({
        top: startY * (1 - progress),
        behavior: "instant",
      });

      if (progress < 1) {
        window.requestAnimationFrame(animateScroll);
      } else {
        root.style.scrollBehavior = previousScrollBehavior;
      }
    };

    window.requestAnimationFrame(animateScroll);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        Skip to main content
      </a>

      <header
        className={`site-header${isHeaderHidden ? " is-hidden" : ""}`}
      >
        <div className="vintage-banner">
          <div className="container">
            <p className="banner-tagline">
              INFORMATICS ENGINEERING • WEB DEVELOPMENT • SOFTWARE TESTING • AI LEARNING JOURNEY
            </p>
          </div>
        </div>
        <div className="container header-wrap">
          <a className="brand" href="#hero" aria-label="Bunga home">
            <h1>BUNGA</h1>
            <p>Digital Archive</p>
          </a>

          <div className="header-actions">
            <nav className="nav-ribbon" aria-label="Main navigation">
              <a href="#about">ABOUT</a>
              <a href="#projects">PROJECT ARCHIVE</a>
              <a href="#skills">SKILLS</a>
              <a href="#contact">CONTACT</a>
            </nav>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="poster-panel" data-reveal>
              <div className="label-row" aria-label="Archive labels">
                <span className="label red">PBL FILE</span>
                <span className="label yellow">NEW!</span>
                <span className="label sage">OPEN FILE</span>
              </div>

              <h2 id="hero-title">
                BUNGA&apos;S
                <br />
                DIGITAL
                <br />
                ARCHIVE
              </h2>

              <div className="sticker-badge">PROJECT COLLECTION No. 04</div>

              <p className="intro">
                A personal collection of project notes, digital experiments, 
                and semester-based works exploring web development, software testing, 
                and introductory artificial intelligence.
              </p>

              <div className="cta-row">
                <a className="catalog-btn primary" href="#projects">
                  VIEW PROJECT ARCHIVE →
                </a>
                <a className="catalog-btn" href="#contact">
                  CONTACT ME
                </a>
              </div>
            </div>

            <aside
              className="side-card"
              aria-label="Personal archive decorations"
              data-reveal
              data-reveal-delay="100"
            >
              <div className="field-note">
                <div className="side-card-kicker">
                  <span className="label sky">FIELD NOTES</span>
                  <span>2024 - Present</span>
                </div>
                <h3>Software<br />Learning<br />Archive</h3>
                <div className="note-meta">
                  <p><strong>Base</strong><span>Batam, Riau Islands</span></p>
                  <p><strong>Campus</strong><span>Politeknik Negeri Batam</span></p>
                  <p><strong>Major</strong><span>Informatics Engineering</span></p>
                </div>
              </div>

              <div className="archive-metrics" aria-label="Portfolio highlights">
                <div>
                  <strong>04</strong>
                  <span>Semester Projects</span>
                </div>
                <div>
                  <strong>AI</strong>
                  <span>Learning Focus</span>
                </div>
              </div>

              <a
                className="stamp-link"
                href="#about"
                aria-label="Go to About section"
              >
                <div className="vintage-stamp">
                  AI<br />LEARNING<br />JOURNEY
                </div>
              </a>
            </aside>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <div className="container">
            <div className="section-header" data-reveal>
              <h2 className="section-title" id="about-title">
                ABOUT BUNGA
              </h2>
              <span className="label olive">FIELD NOTES</span>
            </div>

            <div className="about-grid">
              <div className="about-story-grid">
                <article className="field-panel about-note primary" data-reveal data-reveal-delay="100">
                  <span className="label peach">PROFILE NOTE</span>
                  <h3>Academic Path</h3>
                  <p>
                    Bunga Citra Lestari Situmorang is a fourth-semester
                    Informatics Engineering student at Politeknik Negeri Batam
                    with a specialization interest in Artificial Intelligence.
                  </p>
                </article>

                <article className="field-panel about-note" data-reveal data-reveal-delay="150">
                  <span className="label sage">PBL RECORD</span>
                  <h3>Project Based Learning</h3>
                  <p>
                    My academic experience is centered on collaborative
                    semester projects related to web application development,
                    database management, software testing, and documentation.
                  </p>
                </article>

                <article className="field-panel about-note" data-reveal data-reveal-delay="200">
                  <span className="label lime">AI DIRECTION</span>
                  <h3>Learning Focus</h3>
                  <p>
                    Through these projects, I am gradually building my
                    understanding of software development, generative AI, deep
                    learning, computer vision, and diffusion model concepts.
                  </p>
                </article>
              </div>

              <aside className="metadata-panel" data-reveal data-reveal-delay="250" aria-label="Profile details">
                <div className="meta-row">
                  <strong>LOCATION</strong>
                  <span>Batam, Riau Islands</span>
                </div>
                <div className="meta-row">
                  <strong>EDUCATION</strong>
                  <span>Politeknik Negeri Batam</span>
                </div>
                <div className="meta-row">
                  <strong>MAJOR</strong>
                  <span>Informatics Engineering</span>
                </div>
                <div className="meta-row">
                  <strong>CURRENT SEMESTER</strong>
                  <span>Fourth Semester</span>
                </div>
                <div className="meta-row">
                  <strong>FOCUS</strong>
                  <span>Software Development, Web Development, AI Fundamentals, Machine Learning</span>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <div className="container">
            <div className="section-header" data-reveal>
              <h2 className="section-title" id="projects-title">
                PROJECT ARCHIVE
              </h2>
              <span className="label peach">OPEN FILE</span>
            </div>

            <p className="section-intro" data-reveal data-reveal-delay="100">
              A collection of semester-based Project Based Learning projects
              that reflect my learning progress in application design, web
              development, documentation, teamwork, and introductory AI-related
              topics.
            </p>

            <div className="projects-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project.number} project={project} index={index} />
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <div className="container">
            <div className="section-header" data-reveal>
              <h2 className="section-title" id="skills-title">
                TECHNICAL SKILLS
              </h2>
              <span className="label lime">SELECTED STACK</span>
            </div>

            <p className="section-intro" data-reveal data-reveal-delay="100">
              A practical stack map grouped by how I use each tool: writing
              code, building web applications, testing workflows, and learning
              AI fundamentals.
            </p>

            <div className="skills-grid">
              {skillCategories.map((category, index) => (
                <article
                  key={category.title}
                  className="skill-panel"
                  data-reveal
                  data-reveal-delay={(index + 1) * 80}
                  style={
                    {
                      "--skill-accent": category.accent,
                      "--skill-tint": category.tint,
                    } as CSSProperties
                  }
                >
                  <div className="skill-panel-topline">
                    <span>{formatSkillIndex(index)}</span>
                    <span>{category.items.length} skills</span>
                  </div>

                  <div className="skill-panel-header">
                    <h3>{category.title}</h3>
                    <p>{category.summary}</p>
                  </div>

                  <ul className="skill-chip-grid">
                    {category.items.map((item) => (
                      <SkillChip key={item.label} item={item} />
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          className="section"
          id="education"
          aria-labelledby="education-title"
        >
          <div className="container">
            <div className="section-header" data-reveal>
              <h2 className="section-title" id="education-title">
                EDUCATION
              </h2>
              <span className="label steel">ACADEMIC RECORD</span>
            </div>

            <div className="education-grid">
              <article className="record-card" data-reveal data-reveal-delay="100">
                <span className="label red">CURRENT FILE</span>
                <h3>Politeknik Negeri Batam</h3>
                <p><strong>Informatics Engineering</strong></p>
                <p>Fourth-Semester Student | 2024 — Present</p>
              </article>

              <article className="record-card" data-reveal data-reveal-delay="200">
                <span className="label periwinkle">PREVIOUS RECORD</span>
                <h3>SMA Swasta Prayatna Medan</h3>
                <p>Graduated | 2021 — 2024</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section section-contact" id="contact" aria-labelledby="contact-title">
          <div className="container">
            <div className="section-header" data-reveal>
              <h2 className="section-title" id="contact-title">
                GET IN TOUCH
              </h2>
              <span className="label yellow">SEND A NOTE</span>
            </div>

            <div className="contact-cta" data-reveal data-reveal-delay="100">
              <div className="contact-info">
                <div className="contact-row">
                  <strong>EMAIL</strong>
                  <a href="mailto:bungasitumorang738@gmail.com">
                    bungasitumorang738@gmail.com
                  </a>
                </div>
                <div className="contact-row">
                  <strong>LOCATION</strong>
                  <span>Batam, Riau Islands</span>
                </div>
                <div className="contact-row">
                  <strong>GITHUB</strong>
                  <a
                    href="https://github.com/bbbunga"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    github.com/bbbunga
                  </a>
                </div>
                <div className="contact-row">
                  <strong>LINKEDIN</strong>
                  <a
                    href="https://www.linkedin.com/in/bungacitras/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    linkedin.com/in/bungacitras
                  </a>
                </div>
              </div>

              <div className="contact-buttons">
                <a
                  className="catalog-btn primary large"
                  href="mailto:bungasitumorang738@gmail.com"
                >
                  EMAIL BUNGA →
                </a>
                <a
                  className="catalog-btn"
                  href="https://github.com/bbbunga"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GITHUB
                </a>
                <a
                  className="catalog-btn"
                  href="https://www.linkedin.com/in/bungacitras/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          <p>
            Bunga&apos;s Digital Archive ✦ All Rights Reserved © 2026
          </p>
        </div>
      </footer>

      <button
        className={`back-to-top-button${showBackToTop ? " is-visible" : ""}`}
        type="button"
        aria-label="Kembali ke atas"
        title="Kembali ke atas"
        onClick={scrollToTop}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </>
  );
}
