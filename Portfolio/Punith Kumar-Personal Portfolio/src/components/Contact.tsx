import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import ScheduleMeeting from "./ScheduleMeeting";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  Github, 
  Linkedin, 
  ExternalLink,
  Calendar,
  MessageCircle
} from "lucide-react";

const Contact = () => {
  const [showScheduler, setShowScheduler] = useState(false);

  const contactInfo = [
    {
      icon: <Mail className="h-5 w-5" />,
      label: "Email",
      value: "22102a040647@mbu.asia",
      href: "mailto:22102a040647@mbu.asia",
      color: "primary"
    },
    {
      icon: <Phone className="h-5 w-5" />,
      label: "Phone",
      value: "+91 9392465021",
      href: "tel:+919392465021",
      color: "secondary"
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      label: "Location",
      value: "Tirupati, India",
      href: "#",
      color: "accent"
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      label: "Availability",
      value: "Open for opportunities",
      href: "#",
      color: "primary"
    }
  ];

  const socialLinks = [
    {
      name: "GitHub",
      username: "A Punith Kumar",
      icon: <Github className="h-5 w-5" />,
      href: "https://github.com/A-Punithkumar",
      color: "primary"
    },
    {
      name: "LinkedIn",
      username: "Punith-MBU",
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com/in/Punith-MBU",
      color: "secondary"
    },
    {
      name: "HackerRank",
      username: "22102A040647",
      icon: <ExternalLink className="h-5 w-5" />,
      href: "https://hackerrank.com/22102A040647",
      color: "accent"
    }
  ];

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Get In Touch</h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            I'm always open to discussing new opportunities, innovative projects, 
            or just having a conversation about technology. Let's connect!
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="glass-strong p-8">
              <h3 className="text-2xl font-semibold gradient-text-secondary mb-6">Contact Information</h3>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-center space-x-4 group">
                    <div className={`p-3 glass rounded-full transition-all duration-300 ${
                      info.color === 'primary' ? 'text-primary group-hover:glow-primary' : 
                      info.color === 'secondary' ? 'text-secondary group-hover:glow-secondary' : 
                      'text-accent group-hover:glow-accent'
                    }`}>
                      {info.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{info.label}</p>
                      <a 
                        href={info.href}
                        className={`hover:underline font-medium transition-colors ${
                          info.color === 'primary' ? 'text-primary' : 
                          info.color === 'secondary' ? 'text-secondary' : 
                          'text-accent'
                        }`}
                      >
                        {info.value}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Social Links */}
            <Card className="glass-strong p-8">
              <h3 className="text-2xl font-semibold gradient-text-secondary mb-6">Connect With Me</h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-between p-4 glass rounded-lg transition-all duration-300 group ${
                      social.color === 'primary' ? 'hover:glow-primary' : 
                      social.color === 'secondary' ? 'hover:glow-secondary' : 
                      'hover:glow-accent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`group-hover:scale-110 transition-transform ${
                        social.color === 'primary' ? 'text-primary' : 
                        social.color === 'secondary' ? 'text-secondary' : 
                        'text-accent'
                      }`}>
                        {social.icon}
                      </div>
                      <div>
                        <p className="font-medium">{social.name}</p>
                        <p className="text-sm text-muted-foreground">{social.username}</p>
                      </div>
                    </div>
                    <ExternalLink className={`h-4 w-4 group-hover:animate-pulse ${
                      social.color === 'primary' ? 'text-primary' : 
                      social.color === 'secondary' ? 'text-secondary' : 
                      'text-accent'
                    }`} />
                  </a>
                ))}
              </div>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <Button 
                className="btn-neon group h-auto p-6 flex-col space-y-2"
                onClick={() => window.open('https://wa.me/919392465021', '_blank')}
              >
                <MessageCircle className="h-6 w-6 group-hover:animate-bounce" />
                <span className="text-sm">Start Chat</span>
              </Button>
              <Button 
                variant="outline" 
                className="btn-ghost-glow group h-auto p-6 flex-col space-y-2"
                onClick={() => setShowScheduler(true)}
              >
                <Calendar className="h-6 w-6 group-hover:animate-pulse" />
                <span className="text-sm">Schedule Call</span>
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <Card className="glass-strong p-8">
              <h3 className="text-2xl font-semibold gradient-text-secondary mb-6">Send a Message</h3>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block">
                      Full Name
                    </label>
                    <Input 
                      placeholder="Your name"
                      className="glass border-border/30 focus:border-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/80 mb-2 block">
                      Email Address
                    </label>
                    <Input 
                      type="email"
                      placeholder="your.email@example.com"
                      className="glass border-border/30 focus:border-primary/50"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/80 mb-2 block">
                    Subject
                  </label>
                  <Input 
                    placeholder="What's this about?"
                    className="glass border-border/30 focus:border-primary/50"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/80 mb-2 block">
                    Message
                  </label>
                  <Textarea 
                    placeholder="Tell me about your project, opportunity, or just say hello!"
                    rows={6}
                    className="glass border-border/30 focus:border-primary/50 resize-none"
                  />
                </div>

                <div className="flex items-center space-x-4">
                  <Button className="btn-neon flex-1 group">
                    <Send className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                    Send Message
                  </Button>
                </div>

                <div className="text-center">
                  <Badge className="glass text-xs text-muted-foreground border-border/30">
                    💡 I typically respond within 24 hours
                  </Badge>
                </div>
              </form>
            </Card>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className="glass-strong p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold gradient-text mb-4">Ready to Work Together?</h3>
            <p className="text-muted-foreground mb-6">
              Whether you're looking for a dedicated developer for your team, 
              need help with a project, or just want to connect, I'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-neon">
                <Mail className="mr-2 h-5 w-5" />
                Get My Resume
              </Button>
              <Button 
                variant="outline" 
                className="btn-ghost-glow"
                onClick={() => setShowScheduler(true)}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Schedule a Meeting
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {showScheduler && (
        <ScheduleMeeting onClose={() => setShowScheduler(false)} />
      )}
    </section>
  );
};

export default Contact;