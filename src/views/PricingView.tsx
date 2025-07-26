import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ViewComponent from '@/components/layout/TheView';
import {
  Check,
  X,
  Star,
  Zap,
  Crown,
  Rocket,
  Users,
  Bot,
  MessageSquare,
  BarChart,
  Shield,
  Globe,
  Clock,
  HelpCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Headphones,
  Code,
  Database,
  Cpu,
} from 'lucide-react';

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  price: {
    monthly: number;
    yearly: number;
  };
  features: {
    name: string;
    included: boolean;
    highlight?: boolean;
  }[];
  limits: {
    chatbots: string;
    conversations: string;
    users: string;
    storage: string;
  };
  popular?: boolean;
  recommended?: boolean;
}

const PricingView: React.FC = () => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { toast } = useToast();

  const plans: PricingPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Perfect for individuals and small teams getting started',
      icon: <Zap className="h-6 w-6" />,
      price: {
        monthly: 29,
        yearly: 290,
      },
      features: [
        { name: 'Up to 3 chatbots', included: true },
        { name: '1,000 conversations/month', included: true },
        { name: 'Basic analytics', included: true },
        { name: 'Email support', included: true },
        { name: 'Standard AI models', included: true },
        { name: 'Basic integrations', included: true },
        { name: 'Custom branding', included: false },
        { name: 'Advanced analytics', included: false },
        { name: 'Priority support', included: false },
        { name: 'Custom AI training', included: false },
        { name: 'White-label solution', included: false },
        { name: 'Dedicated account manager', included: false },
      ],
      limits: {
        chatbots: '3',
        conversations: '1,000/month',
        users: '2',
        storage: '5GB',
      },
    },
    {
      id: 'professional',
      name: 'Professional',
      description: 'Ideal for growing businesses and teams',
      icon: <Rocket className="h-6 w-6" />,
      price: {
        monthly: 99,
        yearly: 990,
      },
      features: [
        { name: 'Up to 10 chatbots', included: true },
        { name: '10,000 conversations/month', included: true },
        { name: 'Advanced analytics', included: true },
        { name: 'Priority support', included: true },
        { name: 'Premium AI models', included: true },
        { name: 'Advanced integrations', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Team collaboration', included: true },
        { name: 'API access', included: true },
        { name: 'Custom AI training', included: false },
        { name: 'White-label solution', included: false },
        { name: 'Dedicated account manager', included: false },
      ],
      limits: {
        chatbots: '10',
        conversations: '10,000/month',
        users: '10',
        storage: '50GB',
      },
      popular: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'For large organizations with advanced needs',
      icon: <Crown className="h-6 w-6" />,
      price: {
        monthly: 299,
        yearly: 2990,
      },
      features: [
        { name: 'Unlimited chatbots', included: true },
        { name: 'Unlimited conversations', included: true },
        { name: 'Advanced analytics', included: true },
        { name: '24/7 priority support', included: true },
        { name: 'Custom AI models', included: true },
        { name: 'All integrations', included: true },
        { name: 'Custom branding', included: true },
        { name: 'Advanced team management', included: true },
        { name: 'Full API access', included: true },
        { name: 'Custom AI training', included: true },
        { name: 'White-label solution', included: true },
        { name: 'Dedicated account manager', included: true },
      ],
      limits: {
        chatbots: 'Unlimited',
        conversations: 'Unlimited',
        users: 'Unlimited',
        storage: '1TB',
      },
      recommended: true,
    },
  ];

  const features = [
    {
      category: 'Core Features',
      items: [
        { name: 'AI Chatbots', icon: <Bot className="h-4 w-4" /> },
        { name: 'Conversation Management', icon: <MessageSquare className="h-4 w-4" /> },
        { name: 'Analytics & Insights', icon: <BarChart className="h-4 w-4" /> },
        { name: 'Multi-language Support', icon: <Globe className="h-4 w-4" /> },
      ],
    },
    {
      category: 'Advanced Features',
      items: [
        { name: 'Custom AI Training', icon: <Cpu className="h-4 w-4" /> },
        { name: 'API Integration', icon: <Code className="h-4 w-4" /> },
        { name: 'White-label Solution', icon: <Shield className="h-4 w-4" /> },
        { name: 'Advanced Analytics', icon: <TrendingUp className="h-4 w-4" /> },
      ],
    },
    {
      category: 'Support & Services',
      items: [
        { name: '24/7 Priority Support', icon: <Headphones className="h-4 w-4" /> },
        { name: 'Dedicated Account Manager', icon: <Users className="h-4 w-4" /> },
        { name: 'Custom Implementation', icon: <Award className="h-4 w-4" /> },
        { name: 'Training & Onboarding', icon: <HelpCircle className="h-4 w-4" /> },
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
    toast({
      title: "Plan selected! 🎉",
      description: `You've selected the ${plans.find(p => p.id === planId)?.name} plan.`,
    });
  };

  const handleStartTrial = (planId: string) => {
    toast({
      title: "Trial started! 🚀",
      description: `Your 14-day free trial for the ${plans.find(p => p.id === planId)?.name} plan has begun.`,
    });
  };

  const currentPrice = (plan: PricingPlan) => isYearly ? plan.price.yearly : plan.price.monthly;
  const savings = (plan: PricingPlan) => Math.round(((plan.price.monthly * 12 - plan.price.yearly) / (plan.price.monthly * 12)) * 100);

  return (
    <ViewComponent
      title="Pricing Plans"
      description="Choose the perfect plan for your chatbot needs"
      actionButton={
        <Button variant="outline" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Contact Sales
        </Button>
      }
    >
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 px-4">
          <div className="flex items-center justify-center gap-2">
            <Badge variant="secondary" className="gap-1 text-xs sm:text-sm">
              <Sparkles className="h-3 w-3" />
              Save up to 17% with yearly billing
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">Simple, transparent pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 px-4">
          <span className={`text-sm ${!isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Monthly
          </span>
          <Switch
            checked={isYearly}
            onCheckedChange={setIsYearly}
          />
          <span className={`text-sm ${isYearly ? 'text-foreground' : 'text-muted-foreground'}`}>
            Yearly
            {isYearly && <Badge variant="secondary" className="ml-2 text-xs">Save 17%</Badge>}
          </span>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-4 md:gap-6">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular
                  ? 'border-primary shadow-lg lg:scale-105'
                  : plan.recommended
                  ? 'border-2 border-primary/20'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                </div>
              )}
              {plan.recommended && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge variant="secondary">
                    <Award className="h-3 w-3 mr-1" />
                    Recommended
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4 px-4 sm:px-6">
                <div className="flex justify-center mb-4">
                  <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-primary/10">
                    {plan.icon}
                  </div>
                </div>
                <CardTitle className="text-xl sm:text-2xl">{plan.name}</CardTitle>
                <CardDescription className="text-sm sm:text-base">{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6 px-4 sm:px-6">
                {/* Pricing */}
                <div className="text-center">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl sm:text-4xl font-bold">${currentPrice(plan)}</span>
                    <span className="text-sm sm:text-base text-muted-foreground">
                      /{isYearly ? 'year' : 'month'}
                    </span>
                  </div>
                  {isYearly && (
                    <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 mt-1">
                      Save ${plan.price.monthly * 12 - plan.price.yearly} per year
                    </p>
                  )}
                </div>

                {/* Limits */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Chatbots:</span>
                    <span className="font-medium">{plan.limits.chatbots}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Conversations:</span>
                    <span className="font-medium">{plan.limits.conversations}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Team members:</span>
                    <span className="font-medium">{plan.limits.users}</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>Storage:</span>
                    <span className="font-medium">{plan.limits.storage}</span>
                  </div>
                </div>

                <Separator />

                {/* Features */}
                <div className="space-y-2 sm:space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-2 sm:gap-3">
                      {feature.included ? (
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      ) : (
                        <X className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      )}
                      <span className={`text-xs sm:text-sm ${feature.included ? '' : 'text-muted-foreground'}`}>
                        {feature.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full text-sm sm:text-base"
                    variant={plan.popular ? 'default' : 'outline'}
                    onClick={() => handlePlanSelect(plan.id)}
                  >
                    {plan.id === 'enterprise' ? 'Contact Sales' : 'Get Started'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                  {plan.id !== 'enterprise' && (
                    <Button
                      variant="ghost"
                      className="w-full text-sm sm:text-base"
                      onClick={() => handleStartTrial(plan.id)}
                    >
                      Start 14-day free trial
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Feature Comparison */}
        <div className="space-y-6 px-4 sm:px-0">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Everything you need to succeed</h2>
            <p className="text-sm sm:text-base text-muted-foreground">
              Powerful features to build, manage, and scale your AI chatbots
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((category) => (
              <Card key={category.category}>
                <CardHeader className="px-4 sm:px-6">
                  <CardTitle className="text-base sm:text-lg">{category.category}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-4 sm:px-6">
                  {category.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary/10">
                        {item.icon}
                      </div>
                      <span className="text-xs sm:text-sm font-medium">{item.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <Card className="mx-4 sm:mx-0">
          <CardHeader className="text-center px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">Frequently Asked Questions</CardTitle>
            <CardDescription className="text-sm sm:text-base">
              Everything you need to know about our pricing and plans
            </CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Can I change plans anytime?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Is there a free trial?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">What payment methods do you accept?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We accept all major credit cards, PayPal, and bank transfers for annual plans.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Do you offer refunds?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    We offer a 30-day money-back guarantee for all paid plans.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">Can I cancel anytime?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Yes, you can cancel your subscription at any time. No long-term contracts required.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 text-sm sm:text-base">What about enterprise features?</h4>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Contact our sales team for custom enterprise solutions and pricing.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20 mx-4 sm:mx-0">
          <CardContent className="pt-6 px-4 sm:px-6">
            <div className="text-center space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold">Ready to get started?</h2>
              <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
                Join thousands of businesses using AI Panel to create amazing AI chatbots
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="gap-2 text-sm sm:text-base">
                  <Rocket className="h-4 w-4" />
                  Start Free Trial
                </Button>
                <Button variant="outline" size="lg" className="gap-2 text-sm sm:text-base">
                  <MessageSquare className="h-4 w-4" />
                  Talk to Sales
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </ViewComponent>
  );
};

export default PricingView; 