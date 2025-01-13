import { HeaderMenuLinksClient } from "./HeaderMenuLinksClient";
import { MenuLink } from "./types";
import { HomeIcon } from "@heroicons/react/24/outline";

export const HeaderMenuLinks = async () => {
  const menuLinks: MenuLink[] = [
    {
      label: "Home",
      href: "/",
      icon: <HomeIcon className="h-4 w-4" />,
    },
  ];

  return <HeaderMenuLinksClient menuLinks={menuLinks} />;
};
