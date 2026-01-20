import { SearchParamsValues } from '@/schemas'
import { ListingsSectionContent } from '../sections/listings-section';

export default function HomeView({
  queryInput,
}: {
  queryInput: SearchParamsValues;
}) {
  return (
    <div>
      <ListingsSectionContent queryInput={queryInput} />
    </div>
  );
}