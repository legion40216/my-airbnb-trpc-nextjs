'use client';

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useCurrentUser } from "@/hooks/client-auth-utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { protectedNavLinks } from "@/data/links";

export function useNavRoutes() {
  const pathName = usePathname();
  
  return protectedNavLinks.map((link) => ({
    ...link,
    active: pathName === link.href || pathName?.startsWith(`${link.href}/`),
  }));
}

export default function DropDownNav() {
  const routes = useNavRoutes();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isPending } = useCurrentUser();

  if (isPending) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Menu className="h-5 w-5" />
      </Button>
    );
  }

  if (!user) return null;

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Navigation menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-48">
        {routes.map((route) => (
          <DropdownMenuItem key={route.href} asChild>
            <Link
              href={route.href}
              onClick={() => setIsOpen(false)}
              className={route.active ? "font-semibold" : ""}
            >
              {route.label}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}