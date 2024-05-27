import React from "react";

type Props = {
  label: string;
  onClick?: () => void;
};

export default function CustomButton({ label, onClick }: Props) {
  return (
    <button
      className="w-full h-[10] py-2 rounded ring-1 ring-slate-900/5 shadow bg-slate-50 hover:bg-slate-300 dark:text-white dark:bg-slate-800 dark:hover:bg-slate-700"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
