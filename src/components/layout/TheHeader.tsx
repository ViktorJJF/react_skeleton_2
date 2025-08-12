import {
  CircleUser,
  Menu,
  Search,
  Grid3X3,
  Bot,
  Settings,
  CreditCard,
  HelpCircle,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ThemeToggle } from '@/components/layout/ThemeToggle';
import TheSidebar from '@/components/layout/TheSidebar';
import NotificationCenter from '@/components/notifications/NotificationCenter';
import LanguageSwitcher from '@/components/layout/LanguageSwitcher';
import { useAuth } from '@/hooks/auth/useAuth';
import { useAuthStore } from '@/store/authStore';

const TheHeader = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = useAuthStore((state) => state.user);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };
  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b bg-background/95 px-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6">
      {/* Left Side - Branding and Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0 md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <TheSidebar />
          </SheetContent>
        </Sheet>

        {/* Branding - Hidden on mobile, shown on md and up */}
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
            <Bot className="h-4 w-4 text-primary-foreground" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AI Panel
            </span>
            <span className="text-xs text-muted-foreground -mt-1">
              Intelligent Dashboard
            </span>
          </div>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex flex-1 justify-center px-4 md:px-8">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search AI tools, chatbots, analytics..."
            className="w-full rounded-full border-2 border-transparent bg-muted/50 pl-10 transition-all duration-200 focus:border-primary/50 focus:bg-background focus:ring-0"
          />
        </div>
      </div>

      {/* Right Side - Utility Icons */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Theme Toggle */}
        <ThemeToggle />

        {/* Apps/Grid */}
        <Button variant="ghost" size="icon" className="hover:bg-muted/50">
          <Grid3X3 className="h-5 w-5" />
          <span className="sr-only">Apps</span>
        </Button>

        {/* Notifications */}
        <NotificationCenter />

        {/* Language Selector */}
        <LanguageSwitcher />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted/50"
            >
              <CircleUser className="h-6 w-6" />
              <span className="sr-only">User menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {user
                ? `${user.firstName} ${user.lastName}`.trim() || user.email
                : t('common.myAccount')}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 cursor-pointer"
              onClick={handleProfileClick}
            >
              <CircleUser className="h-4 w-4" />
              {t('common.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <Settings className="h-4 w-4" />
              {t('common.settings')}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <CreditCard className="h-4 w-4" />
              {t('common.billing')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <HelpCircle className="h-4 w-4" />
              {t('common.support')}
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <BookOpen className="h-4 w-4" />
              {t('common.documentation')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="flex items-center gap-2 text-destructive cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {t('auth.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TheHeader;
