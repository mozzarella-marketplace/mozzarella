import { Suspense, type FC } from "react";
import { CustomerMarketplaceSection } from "./_components/customer-marketplace-section";
import { MarketplaceSkeleton } from "./_components/marketplace-skeleton";

const Home: FC = () => {
  return (
    <section className="mx-auto max-w-content px-page-inline py-section">
      <Suspense fallback={<MarketplaceSkeleton />}>
        <CustomerMarketplaceSection />
      </Suspense>
    </section>
  );
};

export default Home;
