import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { MoreHorizontal, ArrowUp, ArrowDown } from 'lucide-react';

const statCards = [
  { title: "Invoices", value: "59", icon: "🧾" },
  { title: "Chats", value: "3,560", icon: "💬" },
  { title: "Blogs", value: "696", icon: "📝" },
  { title: "Projects", value: "356", icon: "💼" },
  { title: "Products", value: "$96k", icon: "📦" },
  { title: "Followers", value: "96", icon: "👥" },
];

const revenueData = [
    { name: '16/08', value: 2.5 },
    { name: '17/08', value: -1.0 },
    { name: '18/08', value: 3.5 },
    { name: '19/08', value: 1.0 },
    { name: '20/08', value: -2.0 },
    { name: '21/08', value: 2.0 },
];

const yearlyBreakupData = [ { name: '2023', value: 180 }, { name: '2024', value: 200 } ];
const monthlyEarningsData = [
    { name: 'Week 1', value: 1000 },
    { name: 'Week 2', value: 3000 },
    { name: 'Week 3', value: 2000 },
    { name: 'Week 4', value: 2780 },
];
const COLORS = ['#3b82f6', '#e0e7ff'];

const DashboardView = () => {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {statCards.map((card, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                            <div className="text-2xl">{card.icon}</div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{card.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Revenue Updates</CardTitle>
                            <p className="text-sm text-muted-foreground">Overview of profit</p>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline">March 2024</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                                <DropdownMenuItem>April 2024</DropdownMenuItem>
                                <DropdownMenuItem>May 2024</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={revenueData}>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-col justify-center gap-4">
                            <div className="flex items-center justify-between">
                                <p className="text-lg font-bold">$63,489.50</p>
                                <MoreHorizontal className="text-muted-foreground" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="text-sm">Earnings this month</p>
                                </div>
                                <p className="font-bold text-lg">$48,820</p>
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-200"></div>
                                    <p className="text-sm">Expense this month</p>
                                </div>
                                <p className="font-bold text-lg">$26,498</p>
                            </div>
                            <Button>View Full Report</Button>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Yearly Breakup</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center gap-6">
                            <div>
                                <p className="text-3xl font-bold">$36,358</p>
                                <p className="text-sm text-green-500 flex items-center gap-1">
                                    <ArrowUp className="h-4 w-4" /> +9% last year
                                </p>
                                <div className="flex gap-4 mt-4 text-sm">
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div>2023</div>
                                    <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-200"></div>2024</div>
                                </div>
                            </div>
                            <div className="w-[100px] h-[100px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={yearlyBreakupData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={40} startAngle={90} endAngle={450}>
                                            {yearlyBreakupData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                            ))}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Monthly Earnings</CardTitle>
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-500 font-bold">$</div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2">
                                <p className="text-2xl font-bold">$6,820</p>
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <ArrowDown className="h-4 w-4" /> +9% last year
                                </p>
                            </div>
                            <div className="h-[60px] mt-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={monthlyEarningsData}>
                                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={3} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardView; 