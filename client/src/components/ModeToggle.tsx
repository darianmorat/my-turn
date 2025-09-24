import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
   const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

   useEffect(() => {
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(theme);
      document.documentElement.setAttribute("data-theme", theme);
      localStorage.setItem("theme", theme);
   }, [theme]);

   const toggleTheme = () => {
      setTheme((prev) => (prev === "light" ? "dark" : "light"));
   };

   return (
      <>
         <Button
            variant="outline"
            size="icon"
            className="border bg-accent/40 dark:bg-accent/40 hover:bg-accent/60 dark:hover:bg-accent/60"
            onClick={() => toggleTheme()}
         >
            <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
         </Button>
      </>
   );
}
