import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, User, Code, GraduationCap, Mail, Home, LogOut } from "lucide-react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const navigate = useNavigate();
  const { toast } = useToast();

  const navItems = [
    { id: "home", label: "Home", icon: <Home className="h-4 w-4" /> },
    { id: "about", label: "About", icon: <User className="h-4 w-4" /> },
    { id: "projects", label: "Projects", icon: <Code className="h-4 w-4" /> },
    { id: "education", label: "Education", icon: <GraduationCap className="h-4 w-4" /> },
    { id: "contact", label: "Contact", icon: <Mail className="h-4 w-4" /> },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 100;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = sectionId === "home" ? 0 : element.offsetTop - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-strong border-b border-border/30">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center font-bold text-primary-foreground">
                PK
              </div>
              <div>
                <h1 className="font-semibold gradient-text">Punith Kumar</h1>
                <Badge className="text-xs glass border-border/30">Full Stack Developer</Badge>
              </div>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-300 ${activeSection === item.id
                      ? "text-primary bg-primary/10 glow-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                    }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              <ThemeToggle />

              <Button
                variant="ghost"
                size="sm"
                className="hidden sm:flex btn-ghost-glow"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden btn-ghost-glow"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>

              {/* CTA Button */}
              <Button className="hidden md:flex btn-neon" size="sm">
                Hire Me
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div className="fixed top-16 left-0 right-0 glass-strong border-b border-border/30 animate-slide-in-right">
            <div className="container mx-auto px-6 py-6">
              <div className="space-y-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${activeSection === item.id
                        ? "text-primary bg-primary/10 glow-primary"
                        : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                      }`}
                  >
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
                <div className="pt-4 border-t border-border/30 space-y-2">
                  <Button
                    className="w-full btn-neon"
                    onClick={() => scrollToSection("contact")}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Get In Touch
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full btn-ghost-glow"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Progress Indicator */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-border/30 z-30">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
          style={{
            width: `${((window.scrollY) / (document.documentElement.scrollHeight - window.innerHeight)) * 100}%`
          }}
        />
      </div>
    </>
  );
};

export default Navigation;