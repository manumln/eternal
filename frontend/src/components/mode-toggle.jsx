import { Button } from "@nextui-org/react";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";
import { useTheme } from "@/components/theme-provider";
import { FiSun, FiMoon } from "react-icons/fi";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown placement="bottom-right">
      <DropdownTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center justify-center w-10 h-10 p-0 rounded-full shadow-sm bg-white dark:bg-zinc-800 text-blue-600 dark:text-zinc-400 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-blue-500"
          aria-label="Toggle theme"
        >
          {/* Iconos sincronizados con el tema */}
          <FiSun className={`h-6 w-6 transition-opacity duration-300 ${theme === "dark" ? "opacity-0" : "opacity-100"}`} />
          <FiMoon className={`h-6 w-6 absolute transition-opacity duration-300 ${theme === "dark" ? "opacity-100" : "opacity-0"}`} />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme Selector"
        onAction={(key) => setTheme(key)}
        selectedKeys={[theme]}
        items={[
          { key: "light", label: "Light" },
          { key: "dark", label: "Dark" },
          { key: "system", label: "System" },
        ]}
      >
        {(item) => (
          <DropdownItem key={item.key}>
            {item.label}
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
}
