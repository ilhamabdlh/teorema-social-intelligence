import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, ComposedChart, Bar } from "recharts";
import { TrendingUp, MessageSquare, Heart, Activity } from "lucide-react";
import { TimeSeriesData } from "../lib/mock-data";

interface TimeSeriesChartsProps {
  data: TimeSeriesData[];
  title?: string;
}

export function TimeSeriesCharts({ data, title = "Time Series Analysis" }: TimeSeriesChartsProps) {
  // Calculate trends
  const calculateTrend = (values: number[]) => {
    if (values.length < 2) return 0;
    const recent = values.slice(-7).reduce((a, b) => a + b, 0) / 7;
    const previous = values.slice(-14, -7).reduce((a, b) => a + b, 0) / 7;
    return ((recent - previous) / previous) * 100;
  };

  const sentimentTrend = calculateTrend(data.map(d => d.sentiment));
  const mentionsTrend = calculateTrend(data.map(d => d.mentions));
  const engagementTrend = calculateTrend(data.map(d => d.engagement));

  const getTrendColor = (trend: number) => {
    if (trend > 5) return "text-green-600";
    if (trend < -5) return "text-red-600";
    return "text-gray-600";
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 5) return "↗";
    if (trend < -5) return "↘";
    return "→";
  };

  // Format data for charts
  const chartData = data.map(d => ({
    ...d,
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sentiment Trend</p>
                <p className="text-2xl font-bold">
                  {data[data.length - 1]?.sentiment || 0}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-500" />
                <Badge variant="outline" className={getTrendColor(sentimentTrend)}>
                  {getTrendIcon(sentimentTrend)} {Math.abs(sentimentTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Mentions Trend</p>
                <p className="text-2xl font-bold">
                  {data[data.length - 1]?.mentions.toLocaleString() || 0}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <Badge variant="outline" className={getTrendColor(mentionsTrend)}>
                  {getTrendIcon(mentionsTrend)} {Math.abs(mentionsTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Engagement Trend</p>
                <p className="text-2xl font-bold">
                  {data[data.length - 1]?.engagement || 0}%
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <Badge variant="outline" className={getTrendColor(engagementTrend)}>
                  {getTrendIcon(engagementTrend)} {Math.abs(engagementTrend).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Series Charts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sentiment" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
              <TabsTrigger value="mentions">Mentions</TabsTrigger>
              <TabsTrigger value="engagement">Engagement</TabsTrigger>
              <TabsTrigger value="distribution">Distribution</TabsTrigger>
            </TabsList>

            <TabsContent value="sentiment" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Sentiment Score']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="sentiment" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="mentions" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [value, 'Mentions']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="mentions" 
                    stroke="#22c55e" 
                    fill="#22c55e" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="engagement" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 20]} />
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Engagement Rate']}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#f59e0b" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </TabsContent>

            <TabsContent value="distribution" className="space-y-4">
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value, name) => [`${value}%`, name.charAt(0).toUpperCase() + name.slice(1)]}
                    labelFormatter={(label) => `Date: ${label}`}
                  />
                  <Bar dataKey="positive" stackId="sentiment" fill="#22c55e" name="positive" />
                  <Bar dataKey="neutral" stackId="sentiment" fill="#6b7280" name="neutral" />
                  <Bar dataKey="negative" stackId="sentiment" fill="#ef4444" name="negative" />
                </ComposedChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}