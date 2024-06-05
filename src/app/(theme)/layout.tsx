"use client";
import ToggleThemeButton from "@/components/common/buttons/ToggleThemeButton";
import { PropsWithChildren, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { loadDepartments } from "@/lib/apis";

type Links = { label: string; href: string }[];
const links: Links = [
  { label: "V1", href: "/" },
  { label: "V2", href: "/v2" },
];

export default function ThemeLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  useEffect(() => {
    const fetchData = async () => {
      const res = await loadDepartments();
      console.log("res:", res);
    };
    fetchData();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center dark:bg-slate-950">
      <div className="flex flex-col gap-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row gap-5">
            {links.map((link, i) => {
              const className =
                pathname === link.href
                  ? "font-medium underline"
                  : "hover:text-cyan-500";
              return (
                <Link
                  key={`Link-${i}`}
                  href={link.href}
                  className={`${className} dark:text-white`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          <ToggleThemeButton />
        </div>
        <div className="grid grid-cols-11 gap-5 min-w-[640px] min-h-[640px]">
          {children}
        </div>
      </div>
    </main>
  );
}
