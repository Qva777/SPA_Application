import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

import { navigation } from "@/routes";

const Navbar = () => {
  return (
    <NavigationMenu className="px-4 py-2 ">
      <NavigationMenuList className="flex gap-2">
        {navigation.map((item) => (
          <NavigationMenuItem key={item.name}>
            <NavigationMenuLink asChild>
              <a href={item.href}>{item.name}</a>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default Navbar;
