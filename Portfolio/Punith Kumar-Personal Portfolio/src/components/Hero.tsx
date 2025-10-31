import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef } from "react";
import heroBackground from "@/assets/hero-bg.jpg";
import profilePic from "@/assets/PUNITH KUMAR.jpg";

const Hero = () => {
  const particlesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const createParticle = () => {
      if (!particlesRef.current) return;

      const particle = document.createElement('div');
      particle.className = 'absolute w-1 h-1 bg-primary/30 rounded-full animate-float';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.top = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 6 + 's';
      particle.style.animationDuration = (Math.random() * 4 + 4) + 's';

      particlesRef.current.appendChild(particle);

      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 8000);
    };

    const interval = setInterval(createParticle, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBackground}
          alt="Hero Background"
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background-secondary" />
      </div>

      {/* Floating particles */}
      <div ref={particlesRef} className="absolute inset-0 z-10 particles" />

      {/* Main content */}
      <div className="relative z-20 container mx-auto px-6 text-center">
        <div className="max-w-4xl mx-auto animate-fade-in">
          {/* Status badge */}
          <Badge className="mb-6 glass-strong text-primary border-primary/30 animate-pulse-glow">
            🚀 Available for Opportunities
          </Badge>

          {/* Profile picture and heading */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative w-32 h-32 mb-4 rounded-full overflow-hidden border-4 border-primary/20 shadow-lg hover:scale-105 transition-transform duration-300">
              <img
                src={profilePic}
                alt="A Punith Kumar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 ring-2 ring-primary/10 rounded-full" />
            </div>
            <h1 className="text-5xl md:text-7xl font-bold">
              <span className="gradient-text animate-gradient-shift bg-[length:200%_200%]">A Punith Kumar</span>
            </h1>
          </div>

          <h2 className="text-2xl md:text-4xl font-semibold mb-6 text-foreground/90">
            Full Stack Developer &
            <span className="gradient-text-secondary"> Tech Innovator</span>
          </h2>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Computer Science student passionate about building innovative web solutions.
            Experienced in React, Django, Python, and modern development technologies.
          </p>

          {/* Skills showcase */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Python', 'Java', 'React', 'Django', 'JavaScript', 'Flutter'].map((skill) => (
              <Badge
                key={skill}
                variant="secondary"
                className="glass text-secondary border-secondary/30 hover:glow-secondary transition-all duration-300"
              >
                {skill}
              </Badge>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
            <Button className="btn-neon group">
              <Mail className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Get In Touch
            </Button>
            <Button variant="outline" className="btn-ghost-glow group">
              <Download className="mr-2 h-5 w-5 group-hover:animate-bounce" />
              Download Resume
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center gap-6">
            <a
              href="https://github.com/A-Punithkumar"
              className="p-3 glass rounded-full hover:glow-primary transition-all duration-300 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="https://linkedin.com/in/Punith-MBU"
              className="p-3 glass rounded-full hover:glow-secondary transition-all duration-300 group"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Linkedin className="h-6 w-6 text-secondary group-hover:scale-110 transition-transform" />
            </a>
            <a
              href="mailto:22102a040647@mbu.asia"
              className="p-3 glass rounded-full hover:glow-accent transition-all duration-300 group"
            >
              <Mail className="h-6 w-6 text-accent group-hover:scale-110 transition-transform" />
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;