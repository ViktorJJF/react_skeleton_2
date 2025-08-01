import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageCircle, Search, Filter, Clock, CheckCircle, AlertCircle, User } from 'lucide-react';

const conversations = [
  {
    id: 1,
    user: "Sarah Johnson",
    email: "sarah@company.com",
    bot: "Customer Support Bot",
    status: "resolved",
    lastMessage: "Thank you for your help!",
    timestamp: "2 minutes ago",
    duration: "5 min",
    satisfaction: 5,
    messages: 12
  },
  {
    id: 2,
    user: "Mike Chen",
    email: "mike@startup.com",
    bot: "Sales Assistant",
    status: "active",
    lastMessage: "Can you tell me more about the pricing?",
    timestamp: "1 minute ago",
    duration: "3 min",
    satisfaction: null,
    messages: 8
  },
  {
    id: 3,
    user: "Emma Wilson",
    email: "emma@techcorp.com",
    bot: "FAQ Bot",
    status: "pending",
    lastMessage: "I'm still having issues with the setup",
    timestamp: "15 minutes ago",
    duration: "12 min",
    satisfaction: null,
    messages: 23
  },
  {
    id: 4,
    user: "David Kim",
    email: "david@enterprise.com",
    bot: "Customer Support Bot",
    status: "resolved",
    lastMessage: "Perfect, that solved it!",
    timestamp: "1 hour ago",
    duration: "8 min",
    satisfaction: 5,
    messages: 15
  },
  {
    id: 5,
    user: "Lisa Anderson",
    email: "lisa@smallbiz.com",
    bot: "Onboarding Bot",
    status: "active",
    lastMessage: "How do I connect my CRM?",
    timestamp: "5 minutes ago",
    duration: "2 min",
    satisfaction: null,
    messages: 6
  }
];

const ConversationsView = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.bot.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || conv.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <Clock className="w-4 h-4 text-blue-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "pending": return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-800";
      case "resolved": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return t('conversations.active');
      case "resolved": return t('conversations.resolved');
      case "pending": return t('conversations.pending');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t('conversations.title')}</h1>
          <p className="text-muted-foreground">{t('conversations.description')}</p>
        </div>
        <Button>
          <MessageCircle className="w-4 h-4 mr-2" />
          {t('conversations.newConversation')}
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={t('conversations.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  {t('conversations.filterByStatus')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus("all")}>
                  {t('conversations.allConversations')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("active")}>
                  {t('conversations.activeConversations')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>
                  {t('conversations.resolvedConversations')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus("pending")}>
                  {t('conversations.pendingConversations')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="grid gap-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{conversation.user}</h3>
                      <Badge variant="outline" className={getStatusColor(conversation.status)}>
                        {getStatusIcon(conversation.status)}
                        <span className="ml-1">{getStatusText(conversation.status)}</span>
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-1">{conversation.email}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      {t('conversations.withBot')} <span className="font-medium">{conversation.bot}</span>
                    </p>
                    
                    <p className="text-sm mb-3">{conversation.lastMessage}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{t('conversations.lastMessage')}: {conversation.timestamp}</span>
                      <span>{t('conversations.duration')}: {conversation.duration}</span>
                      <span>{t('conversations.messages')}: {conversation.messages}</span>
                      {conversation.satisfaction && (
                        <span>{t('conversations.satisfaction')}: {conversation.satisfaction}/5</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">{t('common.openMenu')}</span>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>{t('conversations.viewConversation')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('conversations.exportChat')}</DropdownMenuItem>
                    <DropdownMenuItem>{t('conversations.markAsResolved')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">{t('conversations.noConversations')}</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? t('conversations.noConversationsMatch', { query: searchQuery }) : t('conversations.noConversationsDescription')}
            </p>
            <Button>
              <MessageCircle className="w-4 h-4 mr-2" />
              {t('conversations.startFirstConversation')}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationsView;
