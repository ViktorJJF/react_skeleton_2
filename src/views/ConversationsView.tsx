import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MessageCircle, Search, Filter, Clock, CheckCircle, AlertCircle, User, Bot } from 'lucide-react';

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

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Conversations</h1>
          <p className="text-muted-foreground">Monitor and analyze customer conversations</p>
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {filterStatus === "all" ? "All Status" : filterStatus}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setFilterStatus("all")}>All Status</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("active")}>Active</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("resolved")}>Resolved</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setFilterStatus("pending")}>Pending</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Conversations List */}
      <div className="space-y-4">
        {filteredConversations.map((conv) => (
          <Card key={conv.id} className="group hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {conv.user.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{conv.user}</h3>
                      <span className="text-sm text-muted-foreground">{conv.email}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      with <span className="font-medium text-foreground">{conv.bot}</span>
                    </p>
                    <p className="text-sm text-foreground mb-2">{conv.lastMessage}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {getStatusIcon(conv.status)}
                        <Badge className={getStatusColor(conv.status)}>
                          {conv.status}
                        </Badge>
                      </span>
                      <span>{conv.timestamp}</span>
                      <span>{conv.duration}</span>
                      <span>{conv.messages} messages</span>
                      {conv.satisfaction && (
                        <span className="flex items-center gap-1">
                          ⭐ {conv.satisfaction}/5
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">No conversations found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery ? `No conversations match "${searchQuery}"` : "Start engaging with your customers"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationsView;
