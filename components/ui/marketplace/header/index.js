import { useAccount } from "@components/hooks/web3";
import { BreadCrumbs } from "@components/ui/common";
import { EthRates, WalletBar } from "@components/ui/web3";
import { Fragment } from "react";

const LINKS = [
  {
    href: "/marketplace",
    value: "Buy",
  },
  {
    href: "/marketplace/courses/owned",
    value: "My Courses",
  },
  {
    href: "/marketplace/courses/managed",
    value: "Manage Courses",
    requireAdmin: true,
  },
];

export default function Header() {
  const { account } = useAccount();
  return (
    <Fragment>
      <div className="pt-4">
        <WalletBar />
      </div>
      <EthRates />
      <div className="flex flex-row-reverse p-4 sm:px-6 lg:px-8">
        <BreadCrumbs items={LINKS} isAdmin={account.isAdmin} />
      </div>
    </Fragment>
  );
}
