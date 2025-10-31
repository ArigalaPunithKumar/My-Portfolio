import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Code, Zap, Users, Trophy } from "lucide-react";

const About = () => {
  const skills = [
    { name: "Python", level: 95, category: "Advanced" },
    { name: "Java", level: 90, category: "Advanced" },
    { name: "React", level: 85, category: "Intermediate" },
    { name: "Django", level: 85, category: "Intermediate" },
    { name: "JavaScript", level: 75, category: "Intermediate" },
    { name: "Flutter", level: 70, category: "Intermediate" },
    { name: "C", level: 80, category: "Intermediate" },
    { name: "MySQL", level: 85, category: "Intermediate" },
  ];

  const achievements = [
    {
      icon: <Trophy className="h-6 w-6" />,
      title: "Academic Excellence",
      description: "CGPA: 8.9/10.0",
      color: "primary"
    },
    {
      icon: <Code className="h-6 w-6" />,
      title: "ServiceNow Certified",
      description: "CSA & CAD Certifications",
      color: "secondary"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Multiple Platforms",
      description: "Active on GitHub, HackerRank, Coursera",
      color: "accent"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Leadership Skills",
      description: "Public Speaking & Team Collaboration",
      color: "primary"
    }
  ];

  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">About Me</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Passionate Computer Science student with a strong foundation in full-stack development, 
            problem-solving, and continuous learning. I thrive on building innovative solutions and 
            contributing to impactful projects.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Personal Info & Story */}
          <div className="space-y-8">
            <Card className="glass-strong p-8 hover:glow-primary transition-all duration-500">
              <h3 className="text-2xl font-semibold gradient-text-secondary mb-4">My Journey</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Currently pursuing B.Tech in Computer Science Engineering at Mohan Babu University 
                  with an impressive CGPA of 8.9. My academic journey reflects my dedication to 
                  excellence and continuous learning.
                </p>
                <p>
                  From achieving 98% in SSC to maintaining consistent academic performance, 
                  I've always been driven by curiosity and the desire to create impactful 
                  technology solutions.
                </p>
                <p>
                  Beyond academics, I enjoy video editing, public speaking, and exploring 
                  emerging technologies. I believe in the power of collaboration and 
                  knowledge sharing to drive innovation.
                </p>
              </div>
            </Card>

            {/* Achievements Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {achievements.map((achievement, index) => (
                <Card 
                  key={index}
                  className={`glass p-6 hover:glow-${achievement.color} transition-all duration-300 animate-fade-in`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`text-${achievement.color} mb-3`}>
                    {achievement.icon}
                  </div>
                  <h4 className="font-semibold mb-2">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                </Card>
              ))}
            </div>
          </div>

          {/* Skills Section */}
          <div>
            <Card className="glass-strong p-8">
              <h3 className="text-2xl font-semibold gradient-text mb-6">Technical Skills</h3>
              
              {/* Skills by category */}
              <div className="space-y-6">
                {['Advanced', 'Intermediate'].map((category) => (
                  <div key={category}>
                    <h4 className="text-lg font-medium mb-4 text-foreground/80">{category}</h4>
                    <div className="space-y-4">
                      {skills
                        .filter(skill => skill.category === category)
                        .map((skill, index) => (
                        <div key={skill.name} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{skill.name}</span>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs ${
                                category === 'Advanced' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'
                              }`}
                            >
                              {skill.level}%
                            </Badge>
                          </div>
                          <Progress 
                            value={skill.level} 
                            className="h-2"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Technologies */}
              <div className="mt-8">
                <h4 className="text-lg font-medium mb-4">Technologies & Tools</h4>
                <div className="flex flex-wrap gap-2">
                  {['Git', 'Windows', 'HTML', 'CSS', 'SQL', 'Video Editing', 'Public Speaking'].map((tech) => (
                    <Badge 
                      key={tech} 
                      className="glass text-accent border-accent/30 hover:glow-accent transition-all duration-300"
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;