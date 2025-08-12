import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { Home, User, Power, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

const Sidebar = () => {
  const { t } = useTranslation();

  const homeNav = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: Home },
  ];
  const saasNav = [{ name: t('sidebar.bots'), href: '/bots', icon: Bot }];
  // const appsNav: Array<{ name: string; href: string; icon: any }> = [];

  const activeLinkClass =
    'flex items-center gap-3 rounded-lg bg-primary text-primary-foreground px-3 py-2 transition-all shadow-lg';
  const inactiveLinkClass =
    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary';

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? activeLinkClass : inactiveLinkClass;

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
              <span className="text-xs text-muted-foreground -mt-1">
                {t('sidebar.dashboard')}
              </span>
            </div>
          </NavLink>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid items-start px-4 text-sm font-medium">
            <h3 className="mb-2 px-2 text-xs font-semibold uppercase text-muted-foreground tracking-wider">
              {t('sidebar.home')}
            </h3>
            {homeNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={getNavLinkClass}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}

            {saasNav.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={getNavLinkClass}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start gap-3">
            <User className="h-4 w-4" />
            <span>{t('sidebar.profile')}</span>
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-3 mt-2">
            <Power className="h-4 w-4" />
            <span>{t('common.logout')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
