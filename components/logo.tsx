import { Layers, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils"; // Shadcn ka utility function

interface LogoProps {
  className?: string;       // Overall container styling
  iconClassName?: string;   // Icon box styling
  textClassName?: string;   // Text styling
  showText?: boolean;       // Text dikhana hai ya nahi
  icon?: LucideIcon;        // Icon change karne ke liye
  size?: "sm" | "md" | "lg"; // Pre-defined sizes
}

const Logo = ({
  className,
  iconClassName,
  textClassName,
  showText = true,
  icon: Icon = Layers,
  size = "md",
}: LogoProps) => {
  
  // Size variations
  const sizeMap = {
    sm: { box: "p-1 rounded-sm", icon: "h-4 w-4", text: "text-lg" },
    md: { box: "p-1.5 rounded-md", icon: "h-5 w-5", text: "text-xl" },
    lg: { box: "p-2 rounded-lg", icon: "h-6 w-6", text: "text-2xl" },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={cn("flex items-center gap-2.5 select-none group cursor-pointer", className)}>
      {/* Icon Box */}
      <div 
        className={cn(
          "bg-primary transition-transform duration-300 group-hover:scale-105 group-active:scale-95",
          currentSize.box,
          iconClassName
        )}
      >
        <Icon className={cn("text-primary-foreground", currentSize.icon)} />
      </div>

      {/* Brand Name */}
      {showText && (
        <span 
          className={cn(
            "font-bold tracking-tight text-foreground transition-colors", 
            currentSize.text, 
            textClassName
          )}
        >
          DevSync
        </span>
      )}
    </div>
  );
};

export default Logo;