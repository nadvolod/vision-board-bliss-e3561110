import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format, subDays } from 'date-fns';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar, ReferenceLine } from 'recharts';

// Mock release data - in a real app, this would come from a releases table
const mockReleases = [
  { version: '1.0.0', date: '2024-01-01', features: 'Initial launch' },
  { version: '1.1.0', date: '2024-01-15', features: 'Achievement system' },
  { version: '1.2.0', date: '2024-02-01', features: 'Social sharing' },
  { version: '1.3.0', date: '2024-02-15', features: 'NPS feedback' },
];

const NPSAnalytics = () => {
  const { user } = useAuth();

  const { data: npsData, isLoading } = useQuery({
    queryKey: ['nps-analytics'],
    queryFn: async () => {
      // Get all NPS feedback
      const { data: feedback, error } = await supabase
        .from('nps_feedback')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process data for charts
      const dailyScores = feedback?.reduce((acc: any, item) => {
        const date = format(new Date(item.created_at), 'yyyy-MM-dd');
        if (!acc[date]) {
          acc[date] = { scores: [], count: 0, total: 0 };
        }
        acc[date].scores.push(parseInt(item.score));
        acc[date].count++;
        acc[date].total += parseInt(item.score);
        return acc;
      }, {}) || {};

      // Convert to chart format
      const chartData = Object.entries(dailyScores).map(([date, data]: [string, any]) => ({
        date,
        average: (data.total / data.count).toFixed(1),
        count: data.count,
        total: data.total,
      }));

      // Calculate overall stats
      const allScores = feedback?.map(f => parseInt(f.score)) || [];
      const overallAverage = allScores.length > 0 
        ? (allScores.reduce((a, b) => a + b, 0) / allScores.length).toFixed(1)
        : '0';

      const promoters = allScores.filter(s => s >= 9).length;
      const detractors = allScores.filter(s => s <= 6).length;
      const npsScore = allScores.length > 0 
        ? Math.round(((promoters - detractors) / allScores.length) * 100)
        : 0;

      return {
        chartData,
        totalResponses: allScores.length,
        overallAverage: parseFloat(overallAverage),
        npsScore,
        promoters,
        detractors,
        passives: allScores.filter(s => s === 7 || s === 8).length,
      };
    },
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded"></div>
            ))}
          </div>
          <div className="h-96 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const chartConfig = {
    average: {
      label: 'Average Score',
      color: 'hsl(var(--primary))',
    },
    count: {
      label: 'Response Count',
      color: 'hsl(var(--secondary))',
    },
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">NPS Analytics</h1>
          <p className="text-muted-foreground">
            Track user satisfaction and correlate with app releases
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            {npsData?.npsScore >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-600" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-600" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{npsData?.npsScore || 0}</div>
            <p className="text-xs text-muted-foreground">
              {npsData?.npsScore >= 50 ? 'Excellent' : 
               npsData?.npsScore >= 0 ? 'Good' : 'Needs Improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{npsData?.overallAverage || 0}</div>
            <p className="text-xs text-muted-foreground">Out of 10</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{npsData?.totalResponses || 0}</div>
            <p className="text-xs text-muted-foreground">Feedback submissions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promoters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{npsData?.promoters || 0}</div>
            <p className="text-xs text-muted-foreground">
              Score 9-10 • {npsData?.passives || 0} passives • {npsData?.detractors || 0} detractors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPS Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>NPS Trend Over Time</CardTitle>
            <CardDescription>
              Average scores with app release markers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={npsData?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  />
                  <YAxis domain={[0, 10]} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="average" 
                    stroke="var(--color-average)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-average)', r: 4 }}
                  />
                  {/* Release markers */}
                  {mockReleases.map((release) => (
                    <ReferenceLine 
                      key={release.version}
                      x={release.date} 
                      stroke="hsl(var(--destructive))" 
                      strokeDasharray="5 5"
                      label={{ value: release.version, position: 'top' }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Response Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Response Volume</CardTitle>
            <CardDescription>
              Number of feedback submissions per day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={npsData?.chartData || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                  />
                  <YAxis />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => format(new Date(value), 'MMM dd, yyyy')}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="var(--color-count)" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Release Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>App Releases</CardTitle>
          <CardDescription>
            Timeline of app versions and their impact on user satisfaction
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockReleases.reverse().map((release, index) => (
              <div key={release.version} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full"></div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Version {release.version}</h3>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(release.date), 'MMM dd, yyyy')}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{release.features}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NPSAnalytics;