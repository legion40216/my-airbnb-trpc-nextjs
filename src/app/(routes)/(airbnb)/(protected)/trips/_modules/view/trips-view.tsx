import { TripsSection } from "../sections/trips-section";
import HeadingState from "@/components/global-ui/heading-state";

export default function TripsView() {
  return (
    <div className="space-y-4">
      <HeadingState
      title="Trips" 
      subtitle="List of your trips" 
      />

      <div>
        <TripsSection />
      </div>
    </div>
  );
}
