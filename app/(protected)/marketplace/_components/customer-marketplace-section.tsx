import type { FC } from "react";
import { connection } from "next/server";
import { getActiveCustomers } from "@/lib/customers";
import { CustomerEmptyState } from "./customer-empty-state";
import { CustomerMarketplace } from "./customer-marketplace";
import { MarketplaceHero } from "./marketplace-hero";
import { PedagogyBanner } from "./pedagogy-banner";
import { MarketplaceIntro } from "./marketplace-intro";

export const CustomerMarketplaceSection: FC = async () => {
  await connection();
  const customers = await getActiveCustomers();

  return (
    <div className="flex flex-col gap-section">
      <MarketplaceIntro />
      {customers.length === 0 ? (
        <>
          <MarketplaceHero opportunityCount={0} />
          <CustomerEmptyState />
        </>
      ) : (
        <>
          <CustomerMarketplace customers={customers} />
          <PedagogyBanner
            avatars={customers.map((customer) => customer.avatar)}
          />
        </>
      )}
    </div>
  );
};
