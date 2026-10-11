import type { FC } from "react";
import { connection } from "next/server";
import { getActiveCustomers } from "@/lib/customers";
import { CustomerEmptyState } from "./customer-empty-state";
import { CustomerMarketplace } from "./customer-marketplace";
import { MarketplaceHero } from "./marketplace-hero";
import { PedagogyBanner } from "./pedagogy-banner";

export const CustomerMarketplaceSection: FC = async () => {
  await connection();
  const customers = await getActiveCustomers();

  if (customers.length === 0) {
    return (
      <div className="flex flex-col gap-section">
        <MarketplaceHero opportunityCount={0} />
        <CustomerEmptyState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-section">
      <CustomerMarketplace customers={customers} />
      <PedagogyBanner avatars={customers.map((customer) => customer.avatar)} />
    </div>
  );
};
