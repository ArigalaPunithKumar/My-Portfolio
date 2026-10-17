import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { ExternalLink, Mail, Download, ArrowRight, Github } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

// Animation Variants
const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};

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
    <motion.div 
      className="section-heading"
      variants={fadeInUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
    </motion.div>
  );
}

function AnimatedStat({ stat }) {
  const [displayValue, setDisplayValue] = useState("0");
  const statRef = useRef(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const element = statRef.current;
    if (!element || hasAnimated) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setHasAnimated(true);

        const startTime = performance.now();
        const duration = 1500;
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
  }, [stat.value, hasAnimated]);

  return (
    <motion.span variants={scaleIn} ref={statRef}>
      <strong>
        {displayValue}
        {stat.suffix}
      </strong>
      {stat.label}
    </motion.span>
  );
}

function App() {
  const [portfolio, setPortfolio] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [projectFilter, setProjectFilter] = useState("All");

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
    if (!portfolio) return undefined;

    const pageSections = document.querySelectorAll("main section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
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

  // Helper function to map generic icon strings or URLs to Lucide/React icons
  const getSocialIcon = (url) => {
    if (url.includes("github.com")) return <FaGithub size={20} />;
    if (url.includes("linkedin.com")) return <FaLinkedin size={20} />;
    if (url.includes("twitter.com") || url.includes("x.com")) return <FaTwitter size={20} />;
    if (url.includes("mailto:")) return <Mail size={20} />;
    return <ExternalLink size={20} />;
  };

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
      <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />
      <Header activeSection={activeSection} identity={identity} navigation={navigation} />

      <main>
        <section id="home" className="hero section-pad">
          <motion.div 
            className="hero-copy"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeInUp} className="status-line">
              <span className="status-dot" aria-hidden="true" />
              {identity.availability}
            </motion.div>
            <motion.p variants={fadeInUp} className="eyebrow">{identity.role}</motion.p>
            <motion.h1 variants={fadeInUp}>{identity.name}</motion.h1>
            <motion.p variants={fadeInUp} className="hero-lead">{hero.lead}</motion.p>
            <motion.div variants={fadeInUp} className="hero-actions">
              <a className="button primary" href="#projects">
                {hero.primaryAction} <ArrowRight size={18} style={{marginLeft: '8px'}}/>
              </a>
              <a className="button secondary" href={hero.resumeUrl} download>
                {hero.secondaryAction} <Download size={18} style={{marginLeft: '8px'}}/>
              </a>
            </motion.div>
            
            <motion.div variants={staggerContainer} className="quick-facts" aria-label="Highlights">
              {hero.stats.map((stat) => (
                <AnimatedStat stat={stat} key={stat.label} />
              ))}
            </motion.div>
          </motion.div>

          <motion.figure 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8, rotateY: 15 }}
            animate={{ opacity: 1, scale: 1, rotateY: -5, rotateX: 5 }}
            transition={{ duration: 1, ease: "easeOut" }}
            aria-label={hero.visualLabel}
          >
            <img src={identity.profileImage || hero.visualUrl} alt={hero.visualAlt} />
          </motion.figure>
        </section>

        <section id="profile" className="section-pad split-section">
          <SectionHeading eyebrow={profile.eyebrow} title={profile.title} />
          <motion.div 
            className="profile-card"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {profile.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </motion.div>
        </section>

        <section id="skills" className="section-pad">
          <SectionHeading eyebrow={skills.eyebrow} title={skills.title} />
          <motion.div 
            className="skill-layout"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {skills.groups.map((group) => (
              <motion.article variants={scaleIn} className="skill-group" key={group.title}>
                <h3>{group.title}</h3>
                <div className="skill-list">
                  {group.items.map((skill) => (
                    <span key={skill}>{skill}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section id="projects" className="section-pad project-section">
          <SectionHeading eyebrow={projects.eyebrow} title={projects.title} />
          
          <motion.div 
            className="project-filter"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            aria-label="Filter projects"
          >
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
          </motion.div>

          <motion.div 
            className="project-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            key={projectFilter} // Re-animate on filter change
          >
            {visibleProjects.map((project) => (
              <motion.article variants={fadeInUp} className="project-card" key={project.title}>
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
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section id="education" className="section-pad">
          <SectionHeading eyebrow={education.eyebrow} title={education.title} />
          <motion.div 
            className="timeline"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {education.items.map((item) => (
              <motion.article variants={fadeInUp} className="timeline-item" key={item.school}>
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
              </motion.article>
            ))}
          </motion.div>
        </section>

        <section id="certifications" className="section-pad">
          <SectionHeading eyebrow={certifications.eyebrow} title={certifications.title} />
          <motion.div 
            className="cert-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {certifications.items.map((cert) => {
              const content = (
                <>
                  {cert.title}
                  <span>{cert.year}</span>
                </>
              );

              return cert.href ? (
                <motion.a variants={scaleIn} className="cert-card" href={cert.href} target="_blank" rel="noreferrer" key={cert.title}>
                  {content}
                </motion.a>
              ) : (
                <motion.div variants={scaleIn} className="cert-card" key={cert.title}>
                  {content}
                </motion.div>
              );
            })}
          </motion.div>
        </section>

        <section id="contact" className="section-pad">
          <motion.div 
            className="contact"
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
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
                  {getSocialIcon(link.href)}
                  {link.label}
                </a>
              ))}
            </div>
          </motion.div>
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
