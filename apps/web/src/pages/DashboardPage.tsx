import { useDashboard } from '@/hooks/useDashboard';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { StatusChart } from '@/components/dashboard/StatusChart';
import { WeeklyTrendChart } from '@/components/dashboard/WeeklyTrendChart';
import { RecentApplications } from '@/components/dashboard/RecentApplications';
import { CardSkeleton, TableSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  CheckCircle2,
  XCircle,
  TrendingUp,
  UserPlus,
  FilePlus2,
  Layers,
} from 'lucide-react';

export function DashboardPage() {
  const { data: metrics, isLoading, isError, error, refetch } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-8 animate-in fade-in-50 duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
            <div className="h-4 w-72 bg-muted/60 rounded-md animate-pulse" />
          </div>
        </div>

        {/* 6 Metric Cards Skeletons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>

        {/* Charts Skeletons */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-[320px] bg-muted/50 rounded-xl animate-pulse" />
          <div className="h-[320px] bg-muted/50 rounded-xl animate-pulse" />
        </div>

        <TableSkeleton rows={5} cols={5} />
      </div>
    );
  }

  if (isError || !metrics) {
    return (
      <ErrorState
        title="Unable to load dashboard metrics"
        message={error?.message || 'Could not connect to the API server.'}
        onRetry={() => refetch()}
      />
    );
  }

  // Calculate active interviews count
  const interviewCount =
    metrics.applicationsByStatus.find((s) => s.status === 'interview')?.count || 0;
  const offerCount =
    metrics.applicationsByStatus.find((s) => s.status === 'offer')?.count || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Page Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Pipeline Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time candidate metrics and recruitment velocity overview.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/applications/kanban">
              <Layers className="h-4 w-4" />
              Kanban View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="gap-2">
            <Link to="/candidates">
              <UserPlus className="h-4 w-4" />
              Candidates
            </Link>
          </Button>
          <Button asChild size="sm" className="gap-2 shadow-xs">
            <Link to="/applications">
              <FilePlus2 className="h-4 w-4" />
              Applications
            </Link>
          </Button>
        </div>
      </div>

      {/* 6 Key Required Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Candidates"
          value={metrics.totalCandidates}
          description="Active registered candidates in directory"
          icon={Users}
          iconColor="text-blue-600 bg-blue-50 dark:bg-blue-950/50 dark:text-blue-400"
          trend={{ value: `${metrics.totalCandidates} Total`, isPositive: true }}
        />

        <MetricCard
          title="Total Applications"
          value={metrics.totalApplications}
          description={`${interviewCount + offerCount} active in interview/offer stage`}
          icon={Briefcase}
          iconColor="text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 dark:text-indigo-400"
          trend={{ value: 'All Time', isPositive: true }}
        />

        <MetricCard
          title="Hired This Month"
          value={metrics.hiredThisMonth}
          description="Successful placements this calendar month"
          icon={CheckCircle2}
          iconColor="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400"
          trend={{ value: 'Target +15%', isPositive: true }}
        />

        <MetricCard
          title="Rejection Rate"
          value={`${metrics.rejectionRate}%`}
          description="Ratio of closed rejected applications"
          icon={XCircle}
          iconColor="text-rose-600 bg-rose-50 dark:bg-rose-950/50 dark:text-rose-400"
          trend={{
            value: metrics.rejectionRate > 40 ? 'High' : 'Normal',
            isPositive: metrics.rejectionRate <= 35,
          }}
        />
      </div>

      {/* Status Breakdown Charts (Bar & Doughnut) */}
      <StatusChart data={metrics.applicationsByStatus} />

      {/* Weekly Velocity Chart */}
      <WeeklyTrendChart data={metrics.weeklyApplications} />

      {/* Recent Applications Table */}
      <RecentApplications applications={metrics.latestApplications} />
    </div>
  );
}
