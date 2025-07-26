import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import ViewComponent from '@/components/layout/TheView';
import {
  Search,
  BookOpen,
  Code,
  Settings,
  Bot,
  MessageSquare,
  BarChart,
  Users,
  Zap,
  ArrowRight,
  ExternalLink,
  Copy,
  Check,
  ChevronRight,
  FileText,
  Video,
  HelpCircle,
  Lightbulb,
  AlertCircle,
  Star,
} from 'lucide-react';

interface DocSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  articles: DocArticle[];
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  readTime: string;
  tags: string[];
}

const DocsView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState('getting-started');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const docSections: DocSection[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'Quick start guide and basic setup',
      icon: <Zap className="h-5 w-5" />,
      articles: [
        {
          id: 'introduction',
          title: 'Introduction to MatDash',
          description: 'Learn about MatDash and its key features for building AI chatbots.',
          difficulty: 'beginner',
          readTime: '5 min read',
          tags: ['overview', 'features'],
        },
        {
          id: 'quick-start',
          title: 'Quick Start Guide',
          description: 'Get up and running with your first chatbot in minutes.',
          difficulty: 'beginner',
          readTime: '10 min read',
          tags: ['setup', 'tutorial'],
        },
        {
          id: 'installation',
          title: 'Installation & Setup',
          description: 'Complete installation guide for MatDash platform.',
          difficulty: 'beginner',
          readTime: '15 min read',
          tags: ['installation', 'configuration'],
        },
      ],
    },
    {
      id: 'chatbots',
      title: 'Chatbots',
      description: 'Building and managing AI chatbots',
      icon: <Bot className="h-5 w-5" />,
      articles: [
        {
          id: 'create-chatbot',
          title: 'Creating Your First Chatbot',
          description: 'Step-by-step guide to create and configure your first AI chatbot.',
          difficulty: 'beginner',
          readTime: '12 min read',
          tags: ['creation', 'configuration'],
        },
        {
          id: 'chatbot-training',
          title: 'Training Your Chatbot',
          description: 'Learn how to train your chatbot with custom data and knowledge.',
          difficulty: 'intermediate',
          readTime: '20 min read',
          tags: ['training', 'ai', 'machine-learning'],
        },
        {
          id: 'chatbot-analytics',
          title: 'Chatbot Analytics & Insights',
          description: 'Monitor performance and gain insights from your chatbot interactions.',
          difficulty: 'intermediate',
          readTime: '8 min read',
          tags: ['analytics', 'performance', 'insights'],
        },
      ],
    },
    {
      id: 'conversations',
      title: 'Conversations',
      description: 'Managing chat conversations and history',
      icon: <MessageSquare className="h-5 w-5" />,
      articles: [
        {
          id: 'conversation-management',
          title: 'Conversation Management',
          description: 'How to view, search, and manage chat conversations.',
          difficulty: 'beginner',
          readTime: '6 min read',
          tags: ['conversations', 'management'],
        },
        {
          id: 'conversation-analytics',
          title: 'Conversation Analytics',
          description: 'Analyze conversation patterns and user engagement.',
          difficulty: 'intermediate',
          readTime: '10 min read',
          tags: ['analytics', 'patterns'],
        },
      ],
    },
    {
      id: 'integrations',
      title: 'Integrations',
      description: 'Connecting with external services and APIs',
      icon: <Settings className="h-5 w-5" />,
      articles: [
        {
          id: 'api-integration',
          title: 'API Integration',
          description: 'Integrate MatDash with your existing applications via REST API.',
          difficulty: 'intermediate',
          readTime: '25 min read',
          tags: ['api', 'integration', 'rest'],
        },
        {
          id: 'webhook-setup',
          title: 'Webhook Setup',
          description: 'Configure webhooks to receive real-time updates and events.',
          difficulty: 'intermediate',
          readTime: '15 min read',
          tags: ['webhooks', 'events'],
        },
        {
          id: 'third-party-services',
          title: 'Third-Party Services',
          description: 'Connect with popular services like Slack, Discord, and more.',
          difficulty: 'intermediate',
          readTime: '18 min read',
          tags: ['slack', 'discord', 'integrations'],
        },
      ],
    },
    {
      id: 'analytics',
      title: 'Analytics',
      description: 'Understanding your chatbot performance',
      icon: <BarChart className="h-5 w-5" />,
      articles: [
        {
          id: 'performance-metrics',
          title: 'Performance Metrics',
          description: 'Key metrics to track your chatbot\'s performance and success.',
          difficulty: 'intermediate',
          readTime: '12 min read',
          tags: ['metrics', 'performance', 'kpi'],
        },
        {
          id: 'user-behavior',
          title: 'User Behavior Analysis',
          description: 'Understand how users interact with your chatbots.',
          difficulty: 'advanced',
          readTime: '15 min read',
          tags: ['behavior', 'analysis', 'users'],
        },
      ],
    },
    {
      id: 'api-reference',
      title: 'API Reference',
      description: 'Complete API documentation and examples',
      icon: <Code className="h-5 w-5" />,
      articles: [
        {
          id: 'authentication',
          title: 'Authentication',
          description: 'Learn how to authenticate with the MatDash API.',
          difficulty: 'intermediate',
          readTime: '8 min read',
          tags: ['auth', 'api', 'security'],
        },
        {
          id: 'endpoints',
          title: 'API Endpoints',
          description: 'Complete reference of all available API endpoints.',
          difficulty: 'intermediate',
          readTime: '30 min read',
          tags: ['endpoints', 'reference'],
        },
        {
          id: 'code-examples',
          title: 'Code Examples',
          description: 'Practical code examples in multiple programming languages.',
          difficulty: 'intermediate',
          readTime: '20 min read',
          tags: ['examples', 'code', 'sdk'],
        },
      ],
    },
  ];

  const filteredSections = docSections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.articles.some(article =>
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast({
      title: "Code copied! 📋",
      description: "The code has been copied to your clipboard.",
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const selectedSectionData = docSections.find(section => section.id === selectedSection);

  return (
    <ViewComponent
      title="Documentation"
      description="Complete guide to using MatDash - from getting started to advanced features"
      actionButton={
        <Button variant="outline" className="gap-2">
          <ExternalLink className="h-4 w-4" />
          API Reference
        </Button>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader className="pb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {filteredSections.map((section) => (
                <div key={section.id} className="space-y-2">
                  <button
                    onClick={() => setSelectedSection(section.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      selectedSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {section.icon}
                      <div className="flex-1">
                        <h3 className="font-medium">{section.title}</h3>
                        <p className="text-sm opacity-80">{section.description}</p>
                      </div>
                    </div>
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {selectedSectionData && (
            <>
              {/* Section Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  {selectedSectionData.icon}
                  <div>
                    <h1 className="text-3xl font-bold">{selectedSectionData.title}</h1>
                    <p className="text-muted-foreground">{selectedSectionData.description}</p>
                  </div>
                </div>
                <Separator />
              </div>

              {/* Articles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedSectionData.articles.map((article) => (
                  <Card key={article.id} className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{article.title}</CardTitle>
                          <CardDescription className="text-sm mb-3">
                            {article.description}
                          </CardDescription>
                        </div>
                        <ArrowRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getDifficultyColor(article.difficulty)}>
                          {article.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{article.readTime}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Start Example */}
              {selectedSectionData.id === 'getting-started' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Start Example
                    </CardTitle>
                    <CardDescription>
                      Get started with a simple chatbot in just a few lines of code
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">JavaScript</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyCode(`// Initialize MatDash chatbot
const chatbot = new MatDash({
  apiKey: 'your-api-key',
  botId: 'your-bot-id'
});

// Send a message
chatbot.sendMessage('Hello, how can you help me?')
  .then(response => {
    console.log('Bot response:', response);
  });`)}
                        >
                          {copiedCode ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                      <pre className="text-sm overflow-x-auto">
                        <code>{`// Initialize MatDash chatbot
const chatbot = new MatDash({
  apiKey: 'your-api-key',
  botId: 'your-bot-id'
});

// Send a message
chatbot.sendMessage('Hello, how can you help me?')
  .then(response => {
    console.log('Bot response:', response);
  });`}</code>
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Help Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Need Help?
                  </CardTitle>
                  <CardDescription>
                    Can't find what you're looking for? We're here to help!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <FileText className="h-5 w-5" />
                      <span>Browse All Docs</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <Video className="h-5 w-5" />
                      <span>Watch Tutorials</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex-col gap-2">
                      <MessageSquare className="h-5 w-5" />
                      <span>Contact Support</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {/* Popular Articles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Popular Articles
              </CardTitle>
              <CardDescription>
                Most viewed and helpful documentation articles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { title: 'Creating Your First Chatbot', views: '2.5k' },
                  { title: 'API Authentication Guide', views: '1.8k' },
                  { title: 'Training Your Chatbot', views: '1.2k' },
                  { title: 'Webhook Setup', views: '950' },
                ].map((article, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                    <span className="font-medium">{article.title}</span>
                    <span className="text-sm text-muted-foreground">{article.views} views</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ViewComponent>
  );
};

export default DocsView; 