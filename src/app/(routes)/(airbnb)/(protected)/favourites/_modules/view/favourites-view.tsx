import HeadingState from "@/components/global-ui/heading-state";
import { FavouritesSection } from "../sections/favourites-section";

export default function FavouritesView() {
  return (
    <div className="space-y-4">
      <HeadingState 
      title="Favourites" 
      subtitle="List of your favourites" 
      />

      <div>
        <FavouritesSection />
      </div>
    </div>
  );
}
