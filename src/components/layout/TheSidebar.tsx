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
  Bot,
  MessageCircle,
  BarChart,
  BrainCircuit,
  Table,
  BookOpen,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const homeNav = [{ name: 'Dashboard', href: '/dashboard', icon: Home }];
const saasNav = [
  { name: 'Chatbots', href: '/chatbots', icon: Bot },
  { name: 'Conversations', href: '/conversations', icon: MessageCircle },
  { name: 'Bot Analytics', href: '/bot-analytics', icon: BarChart },
  { name: 'Bot Training', href: '/bot-training', icon: BrainCircuit },
  { name: 'Chatbots Table', href: '/chatbots-table', icon: Table },
  { name: 'Documentation', href: '/docs', icon: BookOpen },
  { name: 'Pricing', href: '/pricing', icon: DollarSign },
];
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
    const activeLinkClass = "flex items-center gap-3 rounded-lg bg-primary text-primary-foreground px-3 py-2 transition-all shadow-lg";
    const inactiveLinkClass = "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary";
  
    const getNavLinkClass = ({ isActive }: { isActive: boolean }) => isActive ? activeLinkClass : inactiveLinkClass;

  return (
    <div className="hidden border-r bg-card text-card-foreground md:block sticky top-0 h-screen">
      <div className="flex h-full flex-col gap-2">
        <div className="flex h-16 items-center border-b px-4 lg:px-6">
          <NavLink to="/" className="flex items-center gap-3 font-semibold">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                AI Panel
              </span>
              <span className="text-xs text-muted-foreground -mt-1">Dashboard</span>
            </div>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Home</h3>
            {homeNav.map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            <h3 className="my-4 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">SaaS</h3>
            {saasNav.map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
            
            <h3 className="my-4 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">Apps</h3>
            {appsNav.map((item) =>
              item.sub ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <div className={`${inactiveLinkClass} justify-between cursor-pointer`}>
                        <div className="flex items-center gap-3">
                            <item.icon className="h-4 w-4" />
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
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </NavLink>
              )
            )}
          </nav>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center gap-3">
            <img src="/avatars/mathew.png" alt="User" className="h-10 w-10 rounded-full" />
            <div className="flex-1">
              <p className="font-semibold">Mathew</p>
              <p className="text-xs text-muted-foreground">Designer</p>
            </div>
            <Button variant="ghost" size="icon">
              <Power className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
