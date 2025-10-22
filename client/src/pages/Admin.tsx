import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { ArrowLeft, Download, TrendingUp, Users, BarChart } from 'lucide-react';
import { useLocation } from 'wouter';

interface SurveyResponse {
  id: number;
  overallScore: number;
  maturityLevel: string;
  dimensionScores: any[];
  responses: any;
  opportunity: string | null;
  obstacle: string | null;
  readyDepartment: string | null;
  companyName: string | null;
  contactEmail: string | null;
  contactName: string | null;
  completedAt: string;
}

interface Stats {
  totalResponses: number;
  averageScore: number;
  maturityDistribution: { level: string; count: number }[];
}

export default function Admin() {
  const [, setLocation] = useLocation();
  const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadData();
  }, [page]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load surveys
      const surveysRes = await fetch(`/api/admin/surveys?page=${page}&limit=10`);
      const surveysData = await surveysRes.json();
      
      if (surveysData.success) {
        setSurveys(surveysData.data);
        setTotalPages(surveysData.pagination.totalPages);
      }

      // Load stats
      const statsRes = await fetch('/api/admin/stats');
      const statsData = await statsRes.json();
      
      if (statsData.success) {
        setStats(statsData.stats);
      }
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = [
      'ID',
      'Date',
      'Overall Score',
      'Maturity Level',
      'Opportunity',
      'Obstacle',
      'Ready Department',
      'Company',
      'Contact Name',
      'Contact Email'
    ];

    const rows = surveys.map(s => [
      s.id,
      new Date(s.completedAt).toLocaleDateString(),
      s.overallScore,
      s.maturityLevel,
      s.opportunity || '',
      s.obstacle || '',
      s.readyDepartment || '',
      s.companyName || '',
      s.contactName || '',
      s.contactEmail || ''
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `survey-responses-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getMaturityColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'leading': return 'bg-green-100 text-green-800';
      case 'scaling': return 'bg-blue-100 text-blue-800';
      case 'experimenting': return 'bg-orange-100 text-orange-800';
      case 'exploring': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !stats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-orange-100">
      <div className="container py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-4"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              View and analyze all survey responses
            </p>
          </div>
          <Button onClick={exportToCSV} variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalResponses}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.averageScore}/100</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Maturity Distribution</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {stats.maturityDistribution.map(d => (
                    <div key={d.level} className="flex justify-between text-sm">
                      <span>{d.level}:</span>
                      <span className="font-medium">{d.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Responses Table */}
        <Card>
          <CardHeader>
            <CardTitle>Survey Responses</CardTitle>
            <CardDescription>
              All submitted assessments sorted by completion date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {surveys.map(survey => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-medium">
                          {new Date(survey.completedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Score</p>
                        <p className="font-bold text-2xl text-orange-600">
                          {survey.overallScore}/100
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Maturity Level</p>
                        <Badge className={getMaturityColor(survey.maturityLevel)}>
                          {survey.maturityLevel}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Company</p>
                        <p className="font-medium">{survey.companyName || 'Anonymous'}</p>
                      </div>
                    </div>
                    
                    {(survey.opportunity || survey.obstacle) && (
                      <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
                        {survey.opportunity && (
                          <div>
                            <p className="text-sm text-muted-foreground">Biggest Opportunity</p>
                            <p className="text-sm">{survey.opportunity}</p>
                          </div>
                        )}
                        {survey.obstacle && (
                          <div>
                            <p className="text-sm text-muted-foreground">Biggest Obstacle</p>
                            <p className="text-sm">{survey.obstacle}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center px-4">
                  Page {page} of {totalPages}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

