import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="btn-ghost-glow group relative inline-flex items-center overflow-hidden transition-colors"
      aria-pressed={theme === "dark"}
    >
      <div className="relative">
        <Sun
          className={`
            h-[1.2rem] w-[1.2rem] 
            transition-all duration-500
            ${theme === 'dark' ?
              '-rotate-90 scale-0 opacity-0' :
              'rotate-0 scale-100 opacity-100 animate-sunshine'
            }
          `}
        />
        <Moon
          className={`
            absolute top-0 left-0
            h-[1.2rem] w-[1.2rem]
            transition-all duration-500
            ${theme === 'dark' ?
              'rotate-0 scale-100 opacity-100 animate-moonrise' :
              'rotate-90 scale-0 opacity-0'
            }
          `}
        />
      </div>
      <div className="w-12 ml-2 hidden sm:block overflow-hidden">
        <div className={`
          flex flex-col text-sm font-medium
          transition-transform duration-500 ease-spring
          ${theme === 'dark' ? '-translate-y-1/2' : 'translate-y-0'}
        `}>
          <span className="py-0.5">Light</span>
          <span className="py-0.5">Dark</span>
        </div>
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}