# Component Architecture

## Overview

The portfolio is built with a modular, reusable component architecture that maintains consistency while allowing flexibility. All components are type-safe with TypeScript.

---

## Component Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout with theme initialization
│   ├── page.tsx                # Main portfolio page
│   ├── globals.css             # Global styles and design system
│   └── favicon.ico             # Site icon
├── components/
│   ├── ThemeToggle.tsx         # Light/dark mode toggle with transition
│   ├── MobileMenu.tsx          # Mobile navigation menu
│   ├── Card.tsx                # Reusable card components
│   └── Section.tsx             # Section wrapper components
└── hooks/
    └── useScrollReveal.ts      # Scroll reveal animation hook
```

---

## Component Details

### 1. ThemeToggle.tsx

**Purpose:** Manages light/dark mode switching with smooth transition

**Features:**
- Synced theme state across components
- localStorage persistence
- Tab synchronization (storage event)
- Smooth circular reveal animation
- Respects prefers-reduced-motion
- Prevents hydration issues

**API:**
```tsx
<ThemeToggle />
```

**State Management:**
```typescript
type ThemeMode = "light" | "dark";

// External store with subscriptions
const themeSubscribers = new Set<() => void>();

// React 18 useSyncExternalStore hook
const themeMode = useSyncExternalStore<ThemeMode>(
  subscribeToThemeStore,
  getThemeSnapshot,
  getThemeServerSnapshot,
);
```

**Transition Effect:**
```tsx
const toggleTheme = () => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (!prefersReducedMotion) {
    setIsTransitioning(true);
    setTimeout(() => setIsTransitioning(false), 800);
  }

  const newMode = themeMode === "light" ? "dark" : "light";
  saveThemeMode(newMode);
};
```

---

### 2. MobileMenu.tsx

**Purpose:** Mobile navigation with hamburger menu

**Features:**
- Slide-down animation
- Backdrop overlay
- Body scroll lock when open
- Automatic close on link click
- Keyboard accessible

**API:**
```tsx
<MobileMenu />
```

**State:**
```typescript
const [isOpen, setIsOpen] = useState(false);

// Lock body scroll when menu open
useEffect(() => {
  if (isOpen) {
    document.body.style.overflow = "hidden";
  } else {
    document.body.style.overflow = "";
  }
}, [isOpen]);
```

**Visibility:**
```css
@media (max-width: 640px) {
  .mobile-menu-toggle {
    display: grid;
  }
}
```

---

### 3. Card.tsx

**Purpose:** Reusable card component with variants

**Features:**
- Three variants (default, elevated, flat)
- Three padding sizes (sm, md, lg)
- Hover effects
- Responsive behavior

**API:**
```tsx
// Basic card
<Card>Content</Card>

// With variants
<Card variant="elevated" padding="lg">
  Content
</Card>

// Card grid
<CardGrid columns={2}>
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</CardGrid>
```

**Props:**
```typescript
interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "flat";
  className?: string;
  padding?: "sm" | "md" | "lg";
}

interface CardGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}
```

**CSS Classes:**
```css
.card                    /* Base card */
.card--default          /* Default shadow */
.card--elevated         /* Increased shadow */
.card--flat             /* No shadow */
.card--padding-sm       /* 1rem padding */
.card--padding-md       /* 1.5rem padding */
.card--padding-lg       /* 2rem padding */

.card-grid              /* Grid container */
.card-grid--cols-1      /* 1 column */
.card-grid--cols-2      /* 2 columns */
.card-grid--cols-3      /* 3 columns */
.card-grid--cols-4      /* 4 columns */
```

---

### 4. Section.tsx

**Purpose:** Consistent section wrapper with scroll reveal

**Features:**
- Automatic scroll reveal animation
- Container wrapper
- Scroll margin for anchor links
- Optional header component

**API:**
```tsx
// Basic section
<Section id="about">
  <SectionHeader 
    label="Introduction"
    title="About Me"
    subtitle="Description text"
  />
  <Content />
</Section>

// Without header
<Section id="custom" className="special">
  <CustomContent />
</Section>
```

**Props:**
```typescript
interface SectionProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  label?: string;
}
```

**Scroll Reveal:**
```typescript
const ref = useScrollReveal<HTMLElement>();

return (
  <section ref={ref} className="section" id={id}>
    <div className="container">{children}</div>
  </section>
);
```

---

### 5. useScrollReveal Hook

**Purpose:** Intersection Observer-based scroll reveal

**Features:**
- Fade in + slide up animation
- IntersectionObserver API
- Respects prefers-reduced-motion
- Automatic cleanup
- One-time reveal

**API:**
```tsx
function MyComponent() {
  const ref = useScrollReveal<HTMLDivElement>();
  
  return <div ref={ref}>Content</div>;
}
```

**Implementation:**
```typescript
export function useScrollReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion) {
      element.style.opacity = "1";
      element.style.transform = "none";
      return;
    }

    // Set initial state
    element.style.opacity = "0";
    element.style.transform = "translateY(20px)";
    element.style.transition = "opacity 0.6s ease, transform 0.6s ease";

    // Create observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.setAttribute("style", "opacity: 1; transform: none;");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return ref;
}
```

---

## Page Components (page.tsx)

### ProjectCard Component

**Purpose:** Expandable project showcase card

**Features:**
- Expand/collapse animation
- Project details on expansion
- GitHub and demo links
- Disabled state handling

**Implementation:**
```tsx
function ProjectCard({ project }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article className={`project-card ${expanded ? "expanded" : ""}`}>
      <div className="project-header">
        <span className="project-number">{project.number}</span>
        <span className="project-semester">{project.semester}</span>
      </div>

      <h3 className="project-title">{project.title}</h3>
      <p className="project-summary">{project.summary}</p>

      <button
        className="project-toggle"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? "Show Less" : "Show More"}
      </button>

      <div className="project-details">
        <div className="project-details-content">
          {/* Details content */}
        </div>
      </div>
    </article>
  );
}
```

**Expansion Animation:**
```css
.project-details {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.project-card.expanded .project-details {
  max-height: 100rem;
}
```

---

## Layout Component (layout.tsx)

**Purpose:** Root layout with theme initialization

**Features:**
- Prevents flash of unstyled content (FOUC)
- Initializes theme before hydration
- Proper HTML structure

**Theme Init Script:**
```javascript
const themeInitScript = `
(() => {
  try {
    const storedTheme = window.localStorage.getItem("bunga-theme-mode");
    const theme = storedTheme === "dark" ? "dark" : "light";

    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;
```

**Why This Works:**
1. Runs synchronously before React hydration
2. No flash when page loads
3. Graceful fallback if localStorage unavailable
4. Sets both `data-theme` and `color-scheme`

---

## Data Structure

### Projects Array

```typescript
const projects = [
  {
    number: "01",
    semester: "Semester 1 | 2024/2025",
    title: "Project Title",
    summary: "Brief description",
    details: [
      "Detail point 1",
      "Detail point 2",
    ],
    role: "Team Member",
    focus: "Focus areas",
    repoUrl: "https://github.com/...",
    demoUrl: "https://example.com",
  },
  // ...
];
```

### Skills Array

```typescript
const skillCategories = [
  {
    id: "01",
    title: "Category Name",
    icon: "💻",
    skills: [
      "Skill 1",
      "Skill 2",
    ],
  },
  // ...
];
```

---

## Styling Strategy

### CSS Organization

```css
/* 1. Design Tokens */
:root {
  --bg-primary: #fafafa;
  --text-primary: #171717;
  /* ... */
}

/* 2. Base Styles */
* { box-sizing: border-box; }
body { /* ... */ }

/* 3. Component Styles */
.card { /* ... */ }
.section { /* ... */ }

/* 4. Layout */
.container { /* ... */ }
.hero-grid { /* ... */ }

/* 5. Responsive */
@media (max-width: 768px) { /* ... */ }
```

### CSS Custom Properties

**Light/Dark Mode:**
```css
:root {
  --bg-primary: #fafafa;
}

[data-theme="dark"] {
  --bg-primary: #0a0a0a;
}

.element {
  background: var(--bg-primary);
}
```

**Why Custom Properties:**
- Runtime theme switching
- No CSS duplication
- Smooth transitions
- Easy maintenance

---

## Best Practices Used

### 1. Type Safety
```typescript
// Strict prop types
interface CardProps {
  children: ReactNode;
  variant?: "default" | "elevated" | "flat";
}

// Type-safe event handlers
const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
  // ...
};
```

### 2. Accessibility
```tsx
// Semantic HTML
<section aria-labelledby="section-title">
  <h2 id="section-title">Title</h2>
</section>

// ARIA attributes
<button
  aria-expanded={isOpen}
  aria-label="Toggle menu"
>
```

### 3. Performance
```tsx
// Client component only where needed
"use client";

// Proper cleanup
useEffect(() => {
  const observer = new IntersectionObserver(/* ... */);
  
  return () => {
    observer.disconnect();
  };
}, []);
```

### 4. Maintainability
```tsx
// Reusable components
<Card variant="elevated">
  <Content />
</Card>

// Consistent patterns
<Section id="about">
  <SectionHeader title="About" />
  <Content />
</Section>
```

---

## Testing & Verification

### Build Output
```bash
npm run build

✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages (4/4)
✓ Finalizing page optimization

Route (app)
┌ ○ /                    # Static
└ ○ /_not-found          # Static
```

### Development
```bash
npm run dev

▲ Next.js 16.2.6
- Local:    http://localhost:3000
- Network:  http://0.0.0.0:3000

✓ Compiled in Xms
```

---

## Future Enhancements

### Potential Additions

1. **Blog Section:**
```tsx
<Section id="blog">
  <SectionHeader title="Blog Posts" />
  <CardGrid columns={3}>
    {posts.map(post => (
      <Card key={post.id}>
        <BlogPostCard post={post} />
      </Card>
    ))}
  </CardGrid>
</Section>
```

2. **Animations Library:**
```tsx
// useStagger for list animations
const itemRefs = useStagger<HTMLDivElement>(items.length);
```

3. **Contact Form:**
```tsx
<Card variant="elevated">
  <ContactForm onSubmit={handleSubmit} />
</Card>
```

4. **Project Filters:**
```tsx
<ProjectFilters 
  categories={categories}
  onFilter={setActiveFilter}
/>
```

---

## Summary

The component architecture is:
- **Modular:** Reusable, composable components
- **Type-Safe:** Full TypeScript coverage
- **Accessible:** WCAG compliant
- **Performant:** Optimized rendering
- **Maintainable:** Clear structure and patterns
- **Scalable:** Easy to extend and modify

This architecture provides a solid foundation for future enhancements while maintaining code quality and developer experience.
