import { ReactNode } from "react";

import Footer from "./_modules/components/footer";
import Navbar from "./_modules/components/navbar";
import NavCategories from "./_modules/components/nav-categories";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-rows-[min-content_1fr_min-content] space-y-4">
        <header className="container mx-auto border-b px-2 md:px-0">
          <nav>
            <Navbar />
          </nav>
          <NavCategories />
        </header>

      <main className="container mx-auto px-2 md:px-0">{children}</main>

      <footer className="container mx-auto">
        <Footer />
      </footer>
    </div>
  );
}
