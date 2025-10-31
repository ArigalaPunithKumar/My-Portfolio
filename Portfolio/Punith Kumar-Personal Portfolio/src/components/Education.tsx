import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Calendar, MapPin, Trophy } from "lucide-react";

const Education = () => {
  const educationData = [
    {
      degree: "B.Tech in Computer Science Engineering",
      institution: "Mohan Babu University",
      location: "Tirupati",
      duration: "2022 - 2026",
      score: "CGPA: 8.9/10.0",
      status: "Currently Pursuing",
      color: "primary",
      highlights: [
        "Consistent academic performance",
        "Active participation in coding competitions",
        "Leadership in technical projects",
        "Strong foundation in CS fundamentals"
      ]
    },
    {
      degree: "Intermediate (MPC)",
      institution: "RK Vidyalaya Junior College",
      location: "Chittoor",
      duration: "2020 - 2022",
      score: "Percentage: 80.7%",
      status: "Completed",
      color: "secondary",
      highlights: [
        "Strong foundation in Mathematics & Physics",
        "Developed analytical thinking skills",
        "Prepared for competitive examinations",
        "Leadership roles in college activities"
      ]
    },
    {
      degree: "10th Standard (SSC)",
      institution: "Zilla Parishad Govt High School",
      location: "Mangalapalli",
      duration: "2019 - 2020",
      score: "Percentage: 98%",
      status: "Completed",
      color: "accent",
      highlights: [
        "Outstanding academic achievement",
        "School topper performance",
        "Strong foundational knowledge",
        "Excellence in all subjects"
      ]
    }
  ];

  const certifications = [
    { name: "Python Essentials", provider: "CISCO", category: "Programming" },
    { name: "Python Basic", provider: "HackerRank", category: "Programming" },
    { name: "CyberSecurity", provider: "CISCO", category: "Security" },
    { name: "Sawit.AI Learnathon", provider: "Guvi", category: "AI/ML" },
    { name: "Certified System Administration (CSA)", provider: "ServiceNow", category: "Cloud" },
    { name: "Certified Application Developer (CAD)", provider: "ServiceNow", category: "Development" }
  ];

  return (
    <section id="education" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Education & Certifications</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            My academic journey reflects dedication to excellence and continuous learning, 
            complemented by industry-recognized certifications.
          </p>
        </div>

        {/* Education Timeline */}
        <div className="mb-16">
          <h3 className="text-2xl font-semibold gradient-text-secondary mb-8 text-center">Academic Journey</h3>
          <div className="space-y-8">
            {educationData.map((edu, index) => (
              <Card 
                key={index}
                className={`glass-strong p-8 hover:glow-${edu.color} transition-all duration-500 animate-fade-in`}
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Main Info */}
                  <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{edu.degree}</h4>
                        <p className={`${edu.color === 'primary' ? 'text-primary' : edu.color === 'secondary' ? 'text-secondary' : 'text-accent'} font-medium text-lg mb-1`}>{edu.institution}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {edu.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {edu.duration}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          className={`mb-2 ${edu.color === 'primary' ? 'bg-primary/20 text-primary border-primary/30' : edu.color === 'secondary' ? 'bg-secondary/20 text-secondary border-secondary/30' : 'bg-accent/20 text-accent border-accent/30'}`}
                        >
                          {edu.status}
                        </Badge>
                        <div className={`text-2xl font-bold ${edu.color === 'primary' ? 'text-primary' : edu.color === 'secondary' ? 'text-secondary' : 'text-accent'} flex items-center gap-2`}>
                          <Trophy className="h-5 w-5" />
                          {edu.score}
                        </div>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div>
                      <h5 className="font-medium mb-3 text-foreground/80">Key Highlights</h5>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {edu.highlights.map((highlight, idx) => (
                          <div key={idx} className="flex items-center space-x-2">
                            <div className={`w-1.5 h-1.5 rounded-full ${edu.color === 'primary' ? 'bg-primary' : edu.color === 'secondary' ? 'bg-secondary' : 'bg-accent'}`} />
                            <span className="text-sm text-muted-foreground">{highlight}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="lg:col-span-1 flex justify-center lg:justify-end items-center">
                    <div className={`${edu.color === 'primary' ? 'text-primary' : edu.color === 'secondary' ? 'text-secondary' : 'text-accent'} opacity-20`}>
                      <GraduationCap className="h-24 w-24" />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <div>
          <h3 className="text-2xl font-semibold gradient-text-secondary mb-8 text-center">Professional Certifications</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert, index) => {
              const isServiceNow = cert.provider === "ServiceNow";
              return (
                <Card 
                  key={index}
                  className={`glass p-6 transition-all duration-300 group animate-scale-in ${
                    isServiceNow ? 'border-2 border-secondary glow-secondary' : 'hover:glow-primary'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-center space-y-3">
                    <div className={isServiceNow ? 'text-secondary group-hover:animate-pulse' : 'text-primary group-hover:animate-pulse'}>
                      <Trophy className="h-8 w-8 mx-auto" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{cert.name}</h4>
                      <p className={`text-sm mb-2 font-medium ${isServiceNow ? 'text-secondary' : 'text-muted-foreground'}`}>
                        {cert.provider}
                      </p>
                      <Badge 
                        variant={isServiceNow ? "default" : "secondary"}
                        className={`text-xs ${isServiceNow ? 'bg-secondary/20 text-secondary border-secondary/30' : 'glass border-border/30'}`}
                      >
                        {cert.category}
                      </Badge>
                      {isServiceNow && (
                        <Badge className="mt-2 bg-secondary text-secondary-foreground text-xs">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Education;