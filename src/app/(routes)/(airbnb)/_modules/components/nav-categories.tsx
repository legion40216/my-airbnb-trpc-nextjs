"use client"
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { useCallback } from "react";
import { cn } from "@/lib/utils";

import { categories } from "@/data/constants";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { Button } from "@/components/ui/button";

export default function NavCategories() {
  const pathname = usePathname();
  const params   = useSearchParams();
  const router   = useRouter();

  const category   = params.get("category");
  const isMainPage = pathname === "/";

  const handleClick = useCallback(
    (name: string) => {
      const query = new URLSearchParams(params.toString());
      if (category === name) {
        query.delete("category");
      } else {
        query.set("category", name);
      }
      const url = query.toString() ? `${pathname}?${query}` : pathname;
      router.push(url);
    },
    [category, params, pathname, router]
  );

  if (!isMainPage) return null;

  return (
    <div className="w-full py-2">
      <Carousel
        opts={{ align: "start", loop: categories.length > 5, dragFree: true }}
        className="w-full relative"
      >
        <CarouselContent className="w-full max-w-[100vw] -ml-2 md:-ml-4">
          {categories.map((item) => (
            <CarouselItem 
              key={item.label} 
              className="pl-2 md:pl-4 basis-auto"
            >
              <CategoryItem
                label={item.label}
                icon={item.icon}
                selected={category === item.label}
                onClick={() => handleClick(item.label)}
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="hidden md:inline-flex absolute left-0 top-1/2 -translate-y-1/2 z-10" />
        <CarouselNext className="hidden md:inline-flex absolute right-0 top-1/2 -translate-y-1/2 z-10" />
      </Carousel>
    </div>
  );
}

interface CategoryItemProps {
  label: string;
  icon: React.ElementType; // Or a more specific type if your icons are always SVGs, etc.
  selected?: boolean;
  onClick?: () => void;
}

function CategoryItem({ label, icon: Icon, selected, onClick }: CategoryItemProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg transition-all",
        "h-auto w-auto min-w-17.5 whitespace-nowrap", 
        "border-2 border-transparent",
        selected
          ? "bg-primary/10 text-primary border-primary font-semibold"
          : "text-muted-foreground hover:bg-muted/80 hover:text-foreground focus-visible:bg-muted/90 focus-visible:ring-2 focus-visible:ring-ring ring-offset-background"
      )}
      aria-pressed={selected} // Accessibility: indicates if the toggle button is pressed
    >
      <Icon className={cn("h-5 w-5", selected ? "text-primary" : "text-current")} /> {/* Use text-current for icon on hover states */}
      <span className="text-xs font-medium">{label}</span>
    </Button>
  );
}

