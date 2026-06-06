import React, { useEffect, useMemo, useRef, useState } from "react";

function Header({ activeSection, identity, navigation }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  return (
    <header className="site-header">
      <nav className="nav-shell" aria-label="Primary navigation">
        <a className="brand" href="#home" aria-label={`${identity.name} home`} onClick={() => setMenuOpen(false)}>
          <span className="brand-mark">{identity.initials}</span>
          <span>{identity.name}</span>
        </a>

        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((isOpen) => !isOpen)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="nav-links">
          {navigation.map((item) => (
            <a
              key={item.href}
              className={activeSection === item.href.slice(1) ? "active" : ""}
              href={item.href}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}

function SectionHeading({ eyebrow, title }) {
  return (
    <div className="section-heading reveal" data-reveal>
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </div>
  );
}

function AnimatedStat({ stat }) {
  const [displayValue, setDisplayValue] = useState("0");
  const statRef = useRef(null);

  useEffect(() => {
    const element = statRef.current;
    if (!element) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        const startTime = performance.now();
        const duration = 1100;
        const decimals = Number.isInteger(stat.value) ? 0 : 1;

        const animate = (time) => {
          const progress = Math.min((time - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplayValue((stat.value * eased).toFixed(decimals));

          if (progress < 1) requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
        observer.disconnect();
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [stat.value]);

  return (
    <span ref={statRef}>
      <strong>
        {displayValue}
        {stat.suffix}
      </strong>
      {stat.label}
    </span>
  );
}

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("profile");
  const [projectFilter, setProjectFilter] = useState("All");

  useEffect(() => {
    const controller = new AbortController();

    async function loadPortfolio() {
      try {
        const response = await fetch("/portfolio-data.json", { signal: controller.signal });
        if (!response.ok) throw new Error("Portfolio data could not be loaded.");

        const data = await response.json();
        setPortfolio(data);
        document.title = `${data.identity.name} | ${data.identity.shortRole}`;
      } catch (error) {
        if (error.name !== "AbortError") {
          setLoadError(error.message);
        }
      }
    }

    loadPortfolio();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0);
    };

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  useEffect(() => {
    if (!portfolio) return undefined;

    const revealItems = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );

    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [portfolio, projectFilter]);

  useEffect(() => {
    if (!portfolio) return undefined;

    const pageSections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id !== "home") {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    pageSections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [portfolio]);

  const projectCategories = useMemo(() => {
    if (!portfolio) return ["All"];
    return ["All", ...new Set(portfolio.projects.items.map((project) => project.category))];
  }, [portfolio]);

  const visibleProjects = useMemo(() => {
    if (!portfolio) return [];
    if (projectFilter === "All") return portfolio.projects.items;
    return portfolio.projects.items.filter((project) => project.category === projectFilter);
  }, [portfolio, projectFilter]);

  if (loadError) {
    return (
      <main className="app-state" role="alert">
        <p className="eyebrow">Unable to load</p>
        <h1>Portfolio data is unavailable.</h1>
        <p>{loadError}</p>
      </main>
    );
  }

  if (!portfolio) {
    return (
      <main className="app-state" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Loading portfolio...</p>
      </main>
    );
  }

  const { identity, navigation, hero, profile, skills, projects, education, certifications, contact } = portfolio;

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />
      <Header activeSection={activeSection} identity={identity} navigation={navigation} />

      <main>
        <section id="home" className="hero section-pad">
          <div className="hero-copy reveal" data-reveal>
            <div className="status-line">
              <span className="status-dot" aria-hidden="true" />
              {identity.availability}
            </div>
            <p className="eyebrow">{identity.role}</p>
            <h1>{identity.name}</h1>
            <p className="hero-lead">{hero.lead}</p>
            <div className="hero-actions">
              <a className="button primary" href="#projects">
                {hero.primaryAction}
              </a>
              <a className="button secondary" href={hero.resumeUrl} download>
                {hero.secondaryAction}
              </a>
            </div>
            <div className="quick-facts" aria-label="Highlights">
              {hero.stats.map((stat) => (
                <AnimatedStat stat={stat} key={stat.label} />
              ))}
            </div>
          </div>

          <figure className="hero-visual reveal" data-reveal aria-label={hero.visualLabel}>
            <img src={hero.visualUrl} alt={hero.visualAlt} />
          </figure>
        </section>

        <section id="profile" className="section-pad split-section">
          <SectionHeading eyebrow={profile.eyebrow} title={profile.title} />
          <div className="profile-card reveal" data-reveal>
            {profile.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>

        <section id="skills" className="section-pad">
          <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
          <div className="skill-layout">
            {skills.groups.map((group) => (
              <article className="skill-group reveal" data-reveal key={group.title}>
                <h3>{group.title}</h3>
                <div className="skill-list">
                  {group.items.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="projects" className="section-pad project-section">
          <SectionHeading eyebrow={projects.eyebrow} title={projects.title} />
          <div className="project-filter reveal" data-reveal aria-label="Filter projects">
            {projectCategories.map((category) => (
              <button
                type="button"
                className={projectFilter === category ? "active" : ""}
                aria-pressed={projectFilter === category}
                onClick={() => setProjectFilter(category)}
                key={category}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="project-grid">
            {visibleProjects.map((project) => (
              <article className="project-card reveal" data-reveal key={project.title}>
                <div className="project-top">
                  <span className={`project-tag ${project.tagTone}`}>{project.tag}</span>
                  <span className="project-year">{project.year}</span>
                </div>
                <h3>{project.title}</h3>
                <p>{project.summary}</p>
                <ul>
                  {project.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <div className="tech-row">
                  {project.tech.map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="education" className="section-pad">
          <SectionHeading eyebrow={education.eyebrow} title={education.title} />
          <div className="timeline">
            {education.items.map((item) => (
              <article className="timeline-item reveal" data-reveal key={item.school}>
                <span className="timeline-dot" />
                <div>
                  <div className="education-meta">
                    <p className="timeline-date">{item.date}</p>
                    {item.status && <span className="completed-badge">{item.status}</span>}
                  </div>
                  <h3>{item.school}</h3>
                  <p>{item.detail}</p>
                  <strong>{item.result}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="certifications" className="section-pad">
          <SectionHeading eyebrow={certifications.eyebrow} title={certifications.title} />
          <div className="cert-grid">
            {certifications.items.map((cert) => {
              const content = (
                <>
                  {cert.title}
                  <span>{cert.year}</span>
                </>
              );

              return cert.href ? (
                <a className="cert-card reveal" data-reveal href={cert.href} target="_blank" rel="noreferrer" key={cert.title}>
                  {content}
                </a>
              ) : (
                <div className="cert-card reveal" data-reveal key={cert.title}>
                  {content}
                </div>
              );
            })}
          </div>
        </section>

        <section id="contact" className="contact section-pad reveal" data-reveal>
          <div>
            <p className="eyebrow">{contact.eyebrow}</p>
            <h2>{contact.title}</h2>
            <p>{identity.location}</p>
          </div>

          <div className="contact-actions">
            {contact.links.map((link) => (
              <a
                className="contact-link"
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                key={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>
          &copy; {new Date().getFullYear()} {identity.name}. {portfolio.footerText}
        </p>
      </footer>
    </>
  );
}

export default App;
