import HeadingState from "@/components/global-ui/heading-state";
import { PropertiesSection } from "../sections/properties-section";

export default function PropertiesView() {
  return (
    <div className="space-y-4">
      <HeadingState 
      title="Properties" 
      subtitle="List of your properties" 
      />

      <div>
        <PropertiesSection />
      </div>
    </div>
  );
}
