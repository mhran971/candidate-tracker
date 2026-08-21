import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/badge';
import { ApplicationWithCandidate } from '@candidate-tracker/shared';
import { formatDate, formatCurrency } from '@/lib/formatters';
import { ArrowUpRight, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RecentApplicationsProps {
  applications: ApplicationWithCandidate[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Latest Applications</CardTitle>
          <CardDescription>Most recently submitted applications across candidates</CardDescription>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/applications" className="gap-1 text-xs">
            View All
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase font-medium border-y border-border/80">
              <tr>
                <th className="px-6 py-3">Role & Company</th>
                <th className="px-6 py-3">Candidate</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Salary Expectation</th>
                <th className="px-6 py-3">Applied Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                    No recent applications found.
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-foreground">
                      <Link
                        to={`/applications/${app.id}`}
                        className="hover:text-primary transition-colors flex flex-col"
                      >
                        <span className="font-semibold">{app.jobTitle}</span>
                        <span className="text-xs text-muted-foreground font-normal">{app.company}</span>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <Link
                        to={`/candidates/${app.candidate.id}`}
                        className="hover:text-primary font-medium text-foreground flex items-center gap-1.5 transition-colors group"
                      >
                        <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <div className="flex flex-col truncate max-w-[160px]">
                          <span className="truncate group-hover:underline">{app.candidate.name}</span>
                          <span className="text-[11px] text-muted-foreground truncate">
                            {app.candidate.email}
                          </span>
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-3.5">
                      <StatusBadge status={app.status} />
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground text-xs font-medium">
                      {formatCurrency(app.salaryExpectation)}
                    </td>
                    <td className="px-6 py-3.5 text-muted-foreground text-xs">
                      {formatDate(app.appliedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
