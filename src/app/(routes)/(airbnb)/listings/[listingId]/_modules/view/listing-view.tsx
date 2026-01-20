import { ListingSectionContent } from "../sections/listing-section";

export default function ListingView({ listingId }: { listingId: string }) {
  return (
    <div>
      <ListingSectionContent listingId={listingId} />
    </div>
  )
}
