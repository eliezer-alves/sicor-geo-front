import { useState, useRef, useEffect, useCallback } from "react";
import { ChevronDown, X, Check } from "lucide-react";
import { cn } from "@/lib/cn";

type Option = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: Option[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
};

export function MultiSelect({ label, options, selected, onChange, placeholder = "Selecione...", disabled }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  const filtered = search
    ? options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()))
    : options;

  const toggle = useCallback(
    (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    },
    [selected, onChange],
  );

  const removeTag = useCallback(
    (value: string, e: React.MouseEvent) => {
      e.stopPropagation();
      onChange(selected.filter((v) => v !== value));
    },
    [selected, onChange],
  );

  const selectedLabels = selected
    .map((v) => options.find((o) => o.value === v)?.label ?? v)
    .slice(0, 2);

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{label}</label>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={cn(
          "flex w-full min-h-[38px] items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-left text-sm transition-colors",
          "hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/30",
          disabled && "cursor-not-allowed opacity-50",
          open && "border-primary ring-2 ring-ring/30",
        )}
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selected.length === 0 && (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          {selectedLabels.map((label, i) => (
            <span
              key={selected[i]}
              className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary"
            >
              <span className="max-w-[100px] truncate">{label}</span>
              <X className="h-3 w-3 cursor-pointer opacity-60 hover:opacity-100" onClick={(e) => removeTag(selected[i], e)} />
            </span>
          ))}
          {selected.length > 2 && (
            <span className="text-xs text-muted-foreground">+{selected.length - 2}</span>
          )}
        </div>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-card shadow-lg">
          {options.length > 5 && (
            <div className="border-b border-border p-1.5">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar..."
                className="w-full rounded bg-muted px-2 py-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                autoFocus
              />
            </div>
          )}
          {filtered.length === 0 ? (
            <div className="px-3 py-2 text-sm text-muted-foreground">Nenhum resultado</div>
          ) : (
            filtered.map((opt) => {
              const isSelected = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => toggle(opt.value)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm transition-colors",
                    "hover:bg-muted",
                    isSelected && "text-primary font-medium",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                      isSelected ? "border-primary bg-primary text-primary-foreground" : "border-border",
                    )}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                  <span className="truncate">{opt.label}</span>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
