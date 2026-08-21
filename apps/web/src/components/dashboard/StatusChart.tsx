import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusCount, APPLICATION_STATUS_LABELS } from '@candidate-tracker/shared';

const STATUS_HEX_COLORS: Record<string, string> = {
  applied: '#64748b', // Slate
  screening: '#f59e0b', // Amber
  interview: '#3b82f6', // Blue
  offer: '#a855f7', // Purple
  hired: '#10b981', // Emerald
  rejected: '#f43f5e', // Rose
};

interface StatusChartProps {
  data: StatusCount[];
}

export function StatusChart({ data }: StatusChartProps) {
  const chartData = data.map((item) => ({
    name: APPLICATION_STATUS_LABELS[item.status] || item.status,
    rawStatus: item.status,
    count: item.count,
  }));

  const total = data.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Bar Chart */}
      <Card className="lg:col-span-2 shadow-xs">
        <CardHeader>
          <CardTitle className="text-base">Applications by Pipeline Status</CardTitle>
          <CardDescription>Current volume of active and closed job applications</CardDescription>
        </CardHeader>
        <CardContent className="h-[280px] w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="name"
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
                cursor={{ fill: 'currentColor', opacity: 0.05 }}
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                  color: '#ffffff',
                }}
                itemStyle={{
                  color: '#ffffff',
                  fontWeight: 500,
                }}
                labelStyle={{
                  color: '#ffffff',
                  fontWeight: 600,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {chartData.map((entry) => (
                  <Cell
                    key={`cell-${entry.rawStatus}`}
                    fill={STATUS_HEX_COLORS[entry.rawStatus] || '#3b82f6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Doughnut Distribution Chart */}
      <Card className="shadow-xs flex flex-col">
        <CardHeader>
          <CardTitle className="text-base">Status Distribution</CardTitle>
          <CardDescription>Pipeline proportion breakdown</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col items-center justify-center pt-0">
          <div className="h-[180px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={`pie-${entry.rawStatus}`}
                      fill={STATUS_HEX_COLORS[entry.rawStatus] || '#3b82f6'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
                    color: '#ffffff',
                  }}
                  itemStyle={{
                    color: '#ffffff',
                    fontWeight: 500,
                  }}
                  labelStyle={{
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-[11px] text-muted-foreground">Total Apps</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 w-full mt-2 text-xs">
            {chartData.map((item) => (
              <div key={item.rawStatus} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 truncate">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: STATUS_HEX_COLORS[item.rawStatus] }}
                  />
                  <span className="truncate text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-semibold text-foreground">{item.count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
