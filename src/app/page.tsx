"use client";

import {
  KeyboardEvent,
  MouseEvent,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

type ThemeMode = "light" | "dark" | "system";

const themeStorageKey = "bunga-theme-mode";

const themeOptions: { value: ThemeMode; label: string }[] = [
  { value: "system", label: "System" },
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
];

const themeSubscribers = new Set<() => void>();

function isThemeMode(value: string | null): value is ThemeMode {
  return value === "light" || value === "dark" || value === "system";
}

function getThemeSnapshot(): ThemeMode {
  if (typeof window === "undefined") return "system";

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey);

    return isThemeMode(storedTheme) ? storedTheme : "system";
  } catch {
    return "system";
  }
}

function getThemeServerSnapshot(): ThemeMode {
  return "system";
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

function resolveTheme(mode: ThemeMode) {
  if (mode !== "system") return mode;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
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

  if (mode === "dark") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M20.4 15.2A8.2 8.2 0 0 1 8.8 3.6a8.4 8.4 0 1 0 11.6 11.6Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="4" y="5" width="16" height="11" rx="2" />
      <path d="M9 20h6M12 16v4" />
    </svg>
  );
}

function ThemeTriggerGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 3v2.1M12 18.9V21M4.9 4.9l1.5 1.5M17.6 17.6l1.5 1.5M3 12h2.1M18.9 12H21M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5" />
      <circle cx="12" cy="12" r="4.2" />
      <path d="M14.8 8.9a5.9 5.9 0 0 0 0 6.2 4.2 4.2 0 1 1 0-6.2Z" />
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
  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    const root = document.documentElement;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = () => {
      const resolvedTheme = resolveTheme(themeMode);
      root.dataset.theme = resolvedTheme;
      root.style.colorScheme = resolvedTheme;
    };

    applyTheme();

    if (themeMode !== "system") return;

    mediaQuery.addEventListener("change", applyTheme);

    return () => {
      mediaQuery.removeEventListener("change", applyTheme);
    };
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

  return (
    <div className="theme-menu" ref={menuRef}>
      <button
        className="theme-trigger"
        type="button"
        ref={triggerRef}
        aria-label={`Pilih tema. Saat ini ${themeMode}.`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
      >
        <ThemeTriggerGlyph />
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
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              role="menuitemradio"
              aria-checked={themeMode === option.value}
              onClick={() => {
                saveThemeMode(option.value);
                setIsOpen(false);
              }}
              onKeyDown={(event) => {
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
    repoUrl: "-",
    demoUrl: "-",
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
    demoUrl: "-",
    repoLabel: "GitHub repo for Sign Language Recognition System",
    demoLabel: "Live demo for Sign Language Recognition System",
  },
];

const skillGroups = [
  {
    title: "Technical Skills",
    skills: [
      "Basic Web Development",
      "Application Design",
      "Basic Databases",
      "Python Fundamentals",
      "Machine Learning Fundamentals",
      "Introductory Deep Learning Concepts",
      "Introductory Computer Vision Concepts",
      "Academic Exposure to Generative AI",
    ],
  },
  {
    title: "Tools",
    skills: [
      "Git",
      "GitHub",
      "Visual Studio Code",
      "Microsoft Word",
      "Figma/Canva",
      "Postman",
      "WSL",
      "Basic Command Line",
    ],
  },
  {
    title: "Soft Skills",
    skills: [
      "Teamwork",
      "Communication",
      "Problem Solving",
      "Time Management",
      "Willingness to Learn",
    ],
  },
  {
    title: "Interests",
    skills: [
      "Software Development",
      "Artificial Intelligence",
      "Machine Learning",
      "Computer Vision Learning",
      "Generative AI Learning",
      "Digital Product Development",
    ],
  },
];

function ProjectCard({ project }: { project: (typeof projects)[number] }) {
  const [expanded, setExpanded] = useState(false);

  const toggleProjectCard = () => {
    setExpanded((current) => !current);
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
      className={`archive-card${expanded ? " expanded" : ""}`}
      data-project-card
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      tabIndex={0}
      role="button"
      aria-label="Open project archive details"
    >
      <div className="archive-top">
        <span className="project-number">{project.number}</span>
        <span className="semester-tag">{project.semester}</span>
      </div>

      <h3>{project.title}</h3>
      <p>{project.summary}</p>

      <button
        className="small-btn dark"
        type="button"
        aria-expanded={expanded}
        onClick={(event) => {
          event.stopPropagation();
          toggleProjectCard();
        }}
      >
        {expanded ? "Close Archive" : "Open Archive"}
      </button>

      <div className="project-details" aria-hidden={!expanded}>
        <div>
          <div className="project-details-inner">
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

            <div className="button-row">
              {project.repoUrl ? (
                <a
                  className="small-btn"
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={project.repoLabel}
                >
                  GitHub Repo
                </a>
              ) : (
                <span className="small-btn is-disabled" aria-disabled="true">
                  GitHub Repo
                </span>
              )}

              {project.demoUrl ? (
                <a
                  className="small-btn"
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={project.demoLabel}
                >
                  Live Demo
                </a>
              ) : (
                <span className="small-btn is-disabled" aria-disabled="true">
                  Live Demo -
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main">
        Lewati ke konten utama
      </a>

      <header className="site-header">
        <div className="container header-wrap">
          <a className="brand" href="#hero" aria-label="Bunga home">
            <h1>BUNGA</h1>
            <p>Informatics Engineering Student</p>
          </a>

          <div className="header-actions">
            <nav className="nav-ribbon" aria-label="Navigasi utama">
              <a href="#about">About</a>
              <a href="#projects">Project Archive</a>
              <a href="#skills">Skills</a>
              <a href="#contact">Contact</a>
            </nav>

            <ThemeSwitcher />
          </div>
        </div>
      </header>

      <main id="main">
        <section className="hero" id="hero" aria-labelledby="hero-title">
          <div className="container hero-grid">
            <div className="poster-panel">
              <div className="label-row" aria-label="Archive labels">
                <span className="label orange">Archive</span>
                <span className="label teal">Field Notes</span>
                <span className="label cream">Now Showing</span>
              </div>

              <h2 id="hero-title">
                Bunga’s
                <br />
                Digital Archive
              </h2>

              <span className="accent">
                Collected works & curious experiments
              </span>

              <p className="subheadline">
                Informatics Engineering • Software Development • AI Learning
                Journey • PBL Project Archive
              </p>

              <p className="intro">
                Hi, I’m Bunga Citra Lestari Situmorang, an Informatics
                Engineering student at Politeknik Negeri Batam with an interest
                in software development and artificial intelligence. I am
                currently building foundational skills through academic projects,
                especially in web-based application development, machine
                learning fundamentals, and introductory AI-related topics.
              </p>

              <div className="cta-row">
                <a className="coupon-btn" href="#projects">
                  View Project Archive
                </a>
                <a className="coupon-btn secondary" href="#contact">
                  Contact Me
                </a>
              </div>
            </div>

            <aside
              className="side-card"
              aria-label="Personal archive decorations"
            >
              <div>
                <span className="label teal">PBL Collection</span>
                <h3>Open File No. 04</h3>
              </div>

              <a
                className="stamp"
                href="#about"
                aria-label="Buka bagian About Bunga"
              >
                AI
                <br />
                VISION
                <br />
                STUDENT
              </a>

              <div className="ticker">
                <span>✦ Batam, Riau Islands</span>
                <span>✦ Politeknik Negeri Batam</span>
                <span>✦ Handmade Digital Scrapbook</span>
              </div>
            </aside>
          </div>
        </section>

        <section className="section" id="about" aria-labelledby="about-title">
          <span className="decor-star one">✹</span>

          <div className="container">
            <div className="section-title">
              <h2 className="ribbon-title" id="about-title">
                About Bunga
              </h2>
              <p className="section-kicker">Field Notes</p>
            </div>

            <div className="about-grid">
              <article className="retro-panel">
                <p>
                  Bunga Citra Lestari Situmorang is a fourth-semester
                  Informatics Engineering student at Politeknik Negeri Batam.
                  Her academic experience is centered on Project Based Learning,
                  where she has been involved in collaborative semester projects
                  related to web application development, application design,
                  documentation, and introductory artificial intelligence topics.
                  Through these projects, she is gradually building her
                  understanding of software development, machine learning
                  fundamentals, computer vision, and generative AI concepts.
                </p>
              </article>

              <aside className="retro-panel" aria-label="Profile details">
                <ul className="details-list">
                  <li>
                    <strong>Location</strong> Batam, Riau Islands
                  </li>
                  <li>
                    <strong>Education</strong> Politeknik Negeri Batam
                  </li>
                  <li>
                    <strong>Major</strong> Informatics Engineering
                  </li>
                  <li>
                    <strong>Current Semester</strong> Fourth Semester
                  </li>
                  <li>
                    <strong>Focus</strong> Software Development, Web
                    Development, AI Fundamentals, Machine Learning
                  </li>
                </ul>
              </aside>
            </div>
          </div>
        </section>

        <section
          className="section"
          id="projects"
          aria-labelledby="projects-title"
        >
          <span className="decor-star two">✦</span>

          <div className="container">
            <div className="section-title">
              <h2 className="ribbon-title" id="projects-title">
                Project Archive
              </h2>
              <p className="section-kicker">Open File</p>
            </div>

            <p className="archive-subtitle">
              A collection of semester-based Project Based Learning projects
              that reflect my learning progress in application design, web
              development, documentation, teamwork, and introductory AI-related
              topics.
            </p>

            <div className="projects-grid">
              {projects.map((project) => (
                <ProjectCard key={project.number} project={project} />
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="skills" aria-labelledby="skills-title">
          <div className="container">
            <div className="section-title">
              <h2 className="ribbon-title" id="skills-title">
                Skills & Interests
              </h2>
              <p className="section-kicker">Classified Ads</p>
            </div>

            <div
              className="skills-board"
              aria-label="Skills and interests notice board"
            >
              {skillGroups.map((group) => (
                <article className="classified" key={group.title}>
                  <h3>{group.title}</h3>
                  <ul>
                    {group.skills.map((skill) => (
                      <li key={skill}>{skill}</li>
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
            <div className="section-title">
              <h2 className="ribbon-title" id="education-title">
                Education
              </h2>
              <p className="section-kicker">Academic Record</p>
            </div>

            <div className="education-grid">
              <article className="note-card">
                <span className="label orange">Current File</span>
                <h3>Politeknik Negeri Batam</h3>
                <p>Informatics Engineering</p>
                <p>Fourth-Semester Student | 2024 — Present</p>
              </article>

              <article className="note-card">
                <span className="label teal">Previous Record</span>
                <h3>SMA Swasta Prayatna Medan</h3>
                <p>Graduated | 2021 — 2024</p>
              </article>
            </div>
          </div>
        </section>

        <section className="section" id="contact" aria-labelledby="contact-title">
          <div className="container">
            <div className="section-title">
              <h2 className="ribbon-title" id="contact-title">
                Get In Touch
              </h2>
              <p className="section-kicker">Send a Note</p>
            </div>

            <div className="retro-panel contact-panel">
              <ul className="contact-list">
                <li>
                  <span>Email</span>
                  <a href="mailto:bungasitumorang738@gmail.com">
                    bungasitumorang738@gmail.com
                  </a>
                </li>
                <li>
                  <span>Location</span>
                  Batam, Riau Islands
                </li>
                <li>
                  <span>GitHub</span>
                  <a
                    href="https://github.com/bbbunga"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://github.com/bbbunga
                  </a>
                </li>
                <li>
                  <span>LinkedIn</span>
                  <a
                    href="https://www.linkedin.com/in/bungacitras/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    https://www.linkedin.com/in/bunga-citra-38378440b/
                  </a>
                </li>
              </ul>

              <div className="contact-buttons">
                <a
                  className="coupon-btn secondary"
                  href="mailto:bungasitumorang738@gmail.com"
                >
                  Email Bunga
                </a>
                <a
                  className="coupon-btn"
                  href="https://github.com/bbbunga"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
                <a
                  className="coupon-btn secondary"
                  href="https://www.linkedin.com/in/bungacitras/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="container">
          Bunga’s Digital Archive ✦ Warm Retro Portfolio ✦ Built with semantic
          HTML, CSS, and JavaScript
        </div>
      </footer>
    </>
  );
}
