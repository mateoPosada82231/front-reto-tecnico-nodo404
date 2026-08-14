import { Search, X } from "lucide-react";
import useContent from "../hooks/useContent";

function ExtensionSearch({ value, onChange, className = "", ...props }) {
  const { content } = useContent("extensions.search");

  return (
    <div className={`relative ${className}`}>
      <Search
        className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-dim"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={content.placeholder}
        aria-label={content.search_aria}
        className="w-full rounded-xl border border-slate-border bg-slate-surface py-2.5 pl-11 pr-11 text-sm text-text-primary placeholder:text-text-dim transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-plumbob/40 focus:border-plumbob hover:border-text-dim"
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={content.clear_aria}
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-dim transition-colors hover:bg-hover hover:text-text-main"
        ></button>
      )}
    </div>
  );
}

export default ExtensionSearch;
