import type { FC, ReactNode } from "react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const MarketplaceLayout: FC<Readonly<{ children: ReactNode }>> = ({
  children,
}) => (
  <div className="flex min-h-screen flex-col">
    <SiteHeader />
    <div className="grow">{children}</div>
    <SiteFooter />
  </div>
);

export default MarketplaceLayout;
