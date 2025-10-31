import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Code, Database, Smartphone } from "lucide-react";

const Projects = () => {
  const projects = [
    {
      title: "Campus Bridge",
      description: "Integrated Academic LMS + Coding Skill Development Platform",
      technologies: ["HTML", "CSS", "JavaScript", "Django", "MySQL"],
      category: "Full Stack",
      icon: <Code className="h-6 w-6" />,
      features: [
        "Learning Management System",
        "Coding skill development",
        "Student-faculty interaction",
        "Assignment management"
      ],
      color: "primary"
    },
    {
      title: "Alumni Connect",
      description: "Platform designed to facilitate connections between college students and alumni",
      technologies: ["Dart", "Spring Boot", "MySQL"],
      category: "Mobile App",
      icon: <Smartphone className="h-6 w-6" />,
      features: [
        "Student-alumni networking",
        "Career guidance",
        "Event management",
        "Mentorship programs"
      ],
      color: "secondary"
    },
    {
      title: "E-Commerce Clones",
      description: "Amazon & Flipkart clone projects showcasing frontend development skills",
      technologies: ["HTML", "CSS", "JavaScript"],
      category: "Frontend",
      icon: <Database className="h-6 w-6" />,
      features: [
        "Product catalog",
        "Shopping cart functionality",
        "Responsive design",
        "User authentication UI"
      ],
      color: "accent"
    },
    {
      title: "Chess Game",
      description: "Interactive chess game built with web technologies",
      technologies: ["HTML", "CSS", "JavaScript"],
      category: "Game",
      icon: <Code className="h-6 w-6" />,
      features: [
        "Two-player gameplay",
        "Move validation",
        "Game state management",
        "Interactive UI"
      ],
      color: "primary"
    }
  ];

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Featured Projects</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            A showcase of my development journey, featuring full-stack applications, 
            mobile platforms, and innovative solutions built with modern technologies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <Card 
              key={index}
              className={`glass-strong p-8 hover:glow-${project.color} transition-all duration-500 group animate-fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="space-y-6">
                {/* Project header */}
                <div className="flex items-start justify-between">
                  <div className={`text-${project.color} group-hover:animate-pulse`}>
                    {project.icon}
                  </div>
                  <Badge className="glass text-xs">
                    {project.category}
                  </Badge>
                </div>

                {/* Project title & description */}
                <div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:gradient-text transition-all duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Features */}
                <div>
                  <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-foreground/70">
                    Key Features
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {project.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-${project.color}`} />
                        <span className="text-sm text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <h4 className="font-medium mb-3 text-sm uppercase tracking-wide text-foreground/70">
                    Technologies
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge 
                        key={tech}
                        variant="secondary" 
                        className="text-xs glass border-border/30"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3 pt-4 border-t border-border/30">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="btn-ghost-glow flex-1 group/btn"
                  >
                    <Github className="mr-2 h-4 w-4 group-hover/btn:animate-spin" />
                    Code
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="btn-ghost-glow flex-1 group/btn"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 group-hover/btn:animate-pulse" />
                    Demo
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* View more projects */}
        <div className="text-center mt-12">
          <Button className="btn-neon">
            <Github className="mr-2 h-5 w-5" />
            View All Projects on GitHub
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Projects;