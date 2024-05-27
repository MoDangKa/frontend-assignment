import { useTheme } from "@/providers/theme-provider";

export default function ToggleThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="sun-and-moon">
      <input
        id="sun-and-moon-checkbox"
        type="checkbox"
        className="sun-and-moon__input"
        checked={theme === "light"}
        onChange={toggleTheme}
      />
      <label className="sun-and-moon__label" htmlFor="sun-and-moon-checkbox">
        <span className="sun-and-moon__indicator" />
        <span className="sun-and-moon__decoration" />
      </label>
    </div>
  );
}
