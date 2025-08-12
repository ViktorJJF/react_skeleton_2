import { useEffect, useMemo, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import {
  Bot,
  MessageCircle,
  Users,
  TrendingUp,
  Activity,
  Target,
} from 'lucide-react';
import { useViewConfig } from '@/hooks/ui/useView';
import { useNotifications } from '@/hooks/ui/useNotifications';
import { useAnalytics } from '@/hooks/api/useAnalytics';

const statCards = [
  {
    title: 'Active Bots',
    value: '12',
    icon: Bot,
    change: '+2',
    color: 'text-primary',
  },
  {
    title: 'Total Chats',
    value: '3,560',
    icon: MessageCircle,
    change: '+12%',
    color: 'text-green-600',
  },
  {
    title: 'Active Users',
    value: '1,234',
    icon: Users,
    change: '+5%',
    color: 'text-blue-600',
  },
  {
    title: 'Conversion Rate',
    value: '24.8%',
    icon: TrendingUp,
    change: '+3.2%',
    color: 'text-purple-600',
  },
  {
    title: 'Avg Response Time',
    value: '1.2s',
    icon: Activity,
    change: '-0.3s',
    color: 'text-orange-600',
  },
  {
    title: 'Goals Completed',
    value: '89%',
    icon: Target,
    change: '+7%',
    color: 'text-pink-600',
  },
];

const chatbotPerformance = [
  { name: 'Mon', conversations: 120, resolved: 95 },
  { name: 'Tue', conversations: 145, resolved: 128 },
  { name: 'Wed', conversations: 98, resolved: 87 },
  { name: 'Thu', conversations: 167, resolved: 143 },
  { name: 'Fri', conversations: 134, resolved: 119 },
  { name: 'Sat', conversations: 89, resolved: 78 },
  { name: 'Sun', conversations: 76, resolved: 65 },
];

const topIntents = [
  { intent: 'Product Inquiry', count: 456, percentage: 28 },
  { intent: 'Support Request', count: 342, percentage: 21 },
  { intent: 'Pricing Question', count: 298, percentage: 18 },
  { intent: 'Demo Booking', count: 234, percentage: 14 },
  { intent: 'Technical Issue', count: 189, percentage: 12 },
  { intent: 'Other', count: 134, percentage: 8 },
];

const DashboardView = () => {
  const { t } = useTranslation();
  const { sendToast, sendNotification } = useNotifications();
  const { trackCustomEvent } = useAnalytics();

  const handleCreateBotClick = useCallback(() => {
    trackCustomEvent('Dashboard', 'Click', 'Create New Bot Button');
    // Add logic to open the create bot modal here
  }, [trackCustomEvent]);

  // Configure view properties for the AdminLayout (memoized)
  const viewConfig = useMemo(
    () => ({
      title: t('dashboard.title'),
      description: t('dashboard.description'),
      actionButton: (
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="font-medium">
                Last 7 days
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Last 24 hours</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 90 days</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={handleCreateBotClick}>
            <Bot className="w-4 h-4 mr-2" />
            {t('dashboard.createNewBot')}
          </Button>
        </div>
      ),
    }),
    [t, handleCreateBotClick],
  );

  useViewConfig(viewConfig);

  const didRunRef = useRef(false);

  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;
    // This is for demonstration purposes.
    // In a real application, these would be triggered by actual events.

    // Send a toast notification
    sendToast('success', {
      title: 'Dashboard Loaded',
      description: 'All your metrics are up-to-date.',
    });

    // Send some persistent notifications for the center
    sendNotification({
      type: 'warning',
      title: 'High API Usage',
      description:
        'Your GPT-4 API usage is approaching its limit for this month.',
    });

    sendNotification({
      type: 'info',
      title: 'New Integration Available',
      description:
        'You can now connect your account with Slack for real-time alerts.',
    });
  }, [sendToast, sendNotification]);

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg bg-primary/10 ${card.color}`}>
                  <card.icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs font-medium ${
                    card.change.startsWith('+')
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {card.change}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-2xl font-bold">{card.value}</p>
                <p className="text-sm text-muted-foreground">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {/* Main Charts */}
      <div className="grid gap-6 lg:grid-cols-3 mt-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Chatbot Performance</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Conversations and resolution rates
                </p>
              </div>
              <Button variant="ghost" size="sm">
                View Details
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chatbotPerformance}>
                  <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="conversations"
                    stackId="1"
                    stroke="#E22A6F"
                    fill="#E22A6F"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="2"
                    stroke="#F472B6"
                    fill="#F472B6"
                    fillOpacity={0.1}
                    strokeWidth={2}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Intents</CardTitle>
            <p className="text-sm text-muted-foreground">
              Most common user queries
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topIntents.map((intent, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{intent.intent}</span>
                    <span className="text-muted-foreground">
                      {intent.count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${intent.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardView;
