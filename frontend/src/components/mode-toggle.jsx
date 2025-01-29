import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { FiMoon, FiSun } from "react-icons/fi";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="outline" size="icon">
          <FiSun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <FiMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Theme selection">
        <DropdownItem key="light" onClick={() => setTheme("light")}>
          Light
        </DropdownItem>
        <DropdownItem key="dark" onClick={() => setTheme("dark")}>
          Dark
        </DropdownItem>
        <DropdownItem key="system" onClick={() => setTheme("system")}>
          System
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}