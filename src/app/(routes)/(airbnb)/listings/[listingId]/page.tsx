import ListingView from "./_modules/view/listing-view";

export default async function ListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  // Await params before using its properties
  const { listingId } = await params;
  
  return (
    <ListingView listingId={listingId} />
  );
}