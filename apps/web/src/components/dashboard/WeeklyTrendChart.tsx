import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { WeeklyApplicationStat } from '@candidate-tracker/shared';

interface WeeklyTrendChartProps {
  data: WeeklyApplicationStat[];
}

export function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-base">Application Velocity (Last 8 Weeks)</CardTitle>
        <CardDescription>Weekly volume of submitted job applications</CardDescription>
      </CardHeader>
      <CardContent className="h-[220px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="applicationVelocityGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.7 }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '0.75rem',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                color: 'hsl(var(--card-foreground))',
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="#3b82f6"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#applicationVelocityGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
