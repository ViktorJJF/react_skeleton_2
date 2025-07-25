import { NavLink } from 'react-router-dom';
import {
  Home,
  ShoppingCart,
  LayoutTemplate,
  Calendar,
  KanbanSquare,
  Mail,
  MessageSquare,
  StickyNote,
  User,
  Power,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const homeNav = [{ name: 'Modern', href: '/dashboard', icon: Home }];
const appsNav = [
  { name: 'eCommerce', href: '/ecommerce', icon: ShoppingCart, sub: true },
  { name: 'Front Pages', href: '/front-pages', icon: LayoutTemplate, sub: true },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Kanban', href: '/kanban', icon: KanbanSquare },
  { name: 'Chats', href: '/chats', icon: MessageSquare },
  { name: 'Email', href: '/email', icon: Mail },
  { name: 'Notes', href: '/notes', icon: StickyNote },
  { name: 'Contacts', href: '/contacts', icon: User },
  { name: 'Invoice', href: '/invoice', icon: LayoutTemplate, sub: true },
];

const Sidebar = () => {
    const activeLinkClass = "flex items-center gap-3 rounded-lg bg-primary text-primary-foreground px-3 py-2 transition-all";
    const inactiveLinkClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary";
  
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? activeLinkClass : inactiveLinkClass;

  return (
    <div className="hidden border-r bg-card text-card-foreground md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <LayoutTemplate className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Modernize</span>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground">Home</h3>
            {homeNav.map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            <h3 className="my-4 px-2 text-xs font-semibold uppercase text-muted-foreground">Apps</h3>
            {appsNav.map((item) =>
              item.sub ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <div className={`${inactiveLinkClass} justify-between cursor-pointer`}>
                        <div className="flex items-center gap-3">
                            <item.icon className="h-5 w-5" />
                            <span>{item.name}</span>
                        </div>
                        <ChevronDown className="h-4 w-4" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuItem>Sub Item 1</DropdownMenuItem>
                    <DropdownMenuItem>Sub Item 2</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </NavLink>
              )
            )}
          </nav>
        </div>
        <div className="mt-auto p-4">
            <div className="flex items-center gap-4 rounded-lg bg-muted p-3">
                <img src="/placeholder-user.jpg" alt="Mathew" className="h-10 w-10 rounded-full" />
                <div>
                    <p className="font-semibold">Mathew</p>
                    <p className="text-xs text-muted-foreground">Designer</p>
                </div>
                <Button variant="ghost" size="icon" className="ml-auto">
                    <Power className="h-5 w-5" />
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 