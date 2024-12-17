import { Button } from "@nextui-org/react";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@nextui-org/react";
import { useTheme } from "@/components/theme-provider";
import { FiSun, FiMoon } from "react-icons/fi";
import { Theme } from "@radix-ui/themes";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Dropdown placement="bottom-right">
      <DropdownTrigger>
        <Button
          variant="ghost"
          size="sm"
          className="relative flex items-center justify-center w-10 h-10 p-0 rounded-full shadow-sm bg-white dark:bg-zinc-800 text-blue-600 dark:text-zinc-400 transition-all duration-300 hover:bg-blue-100 dark:hover:bg-zinc-700 focus:ring-2 focus:ring-blue-500"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
          <FiSun
            className={`h-6 w-6 transition-opacity duration-300 ${
              theme === Theme.LIGHT ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={theme !== Theme.LIGHT}
          />
          <FiMoon
            className={`h-6 w-6 absolute transition-opacity duration-300 ${
              theme === Theme.DARK ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={theme !== Theme.DARK}
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Theme Selector"
        onAction={(key) => {
          if (Object.values(Theme).includes(key)) {
            setTheme(key);
          }
        }}
                selectedKeys={[theme]}
        items={[
          { key: "light", label: "Light" },
          { key: "dark", label: "Dark" },
          { key: "system", label: "System" },
        ]}
      >
        {(item) => <DropdownItem key={item.key}>{item.label}</DropdownItem>}
      </DropdownMenu>
    </Dropdown>
  );
}
