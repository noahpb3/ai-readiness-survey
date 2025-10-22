import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { generateRecommendations, type SurveyResult } from '@/lib/scoring';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { 
  ArrowLeft, 
  Download, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  Target,
  Lightbulb,
  Share2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export default function Results() {
  const [, setLocation] = useLocation();
  const [results, setResults] = useState<SurveyResult | null>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  useEffect(() => {
    const storedResults = sessionStorage.getItem('surveyResults');
    if (storedResults) {
      setResults(JSON.parse(storedResults));
    } else {
      // Redirect to home if no results found
      setLocation('/');
    }
  }, [setLocation]);

  if (!results) {
    return null;
  }

  const recommendations = generateRecommendations(results);
  const highPriorityRecs = recommendations.filter(r => r.priority === 'high');
  const mediumPriorityRecs = recommendations.filter(r => r.priority === 'medium');

  const getScoreColor = (score: number) => {
    if (score >= 76) return 'text-green-600';
    if (score >= 51) return 'text-blue-600';
    if (score >= 26) return 'text-orange-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 76) return 'bg-green-100';
    if (score >= 51) return 'bg-blue-100';
    if (score >= 26) return 'bg-orange-100';
    return 'bg-red-100';
  };

  const handleDownloadReport = () => {
    // Create a simple text report
    let reportText = '='.repeat(60) + '\n';
    reportText += 'AI READINESS ASSESSMENT REPORT\n';
    reportText += '='.repeat(60) + '\n\n';
    reportText += `Generated: ${new Date(results.completedAt).toLocaleDateString()}\n\n`;
    
    reportText += 'OVERALL RESULTS\n';
    reportText += '-'.repeat(60) + '\n';
    reportText += `Overall AI Readiness Score: ${results.overallScore}/100\n`;
    reportText += `Maturity Level: ${results.maturityLevel.name}\n`;
    reportText += `Description: ${results.maturityLevel.description}\n\n`;
    
    reportText += 'DIMENSION SCORES\n';
    reportText += '-'.repeat(60) + '\n';
    results.dimensionScores.forEach(ds => {
      reportText += `\n${ds.dimension.icon} ${ds.dimension.name}\n`;
      reportText += `Score: ${ds.score}/100 (${ds.maturityLevel.name})\n`;
      reportText += `${ds.dimension.description}\n`;
    });
    
    reportText += '\n\nRECOMMENDATIONS\n';
    reportText += '='.repeat(60) + '\n\n';
    
    reportText += 'HIGH PRIORITY\n';
    reportText += '-'.repeat(60) + '\n';
    highPriorityRecs.forEach((rec, idx) => {
      reportText += `\n${idx + 1}. ${rec.title} (${rec.dimension})\n`;
      reportText += `${rec.description}\n\n`;
      reportText += 'Action Items:\n';
      rec.actions.forEach((action, i) => {
        reportText += `  ${i + 1}. ${action}\n`;
      });
    });
    
    if (mediumPriorityRecs.length > 0) {
      reportText += '\n\nMEDIUM PRIORITY\n';
      reportText += '-'.repeat(60) + '\n';
      mediumPriorityRecs.forEach((rec, idx) => {
        reportText += `\n${idx + 1}. ${rec.title} (${rec.dimension})\n`;
        reportText += `${rec.description}\n\n`;
        reportText += 'Action Items:\n';
        rec.actions.forEach((action, i) => {
          reportText += `  ${i + 1}. ${action}\n`;
        });
      });
    }
    
    reportText += '\n\n' + '='.repeat(60) + '\n';
    reportText += 'End of Report\n';
    reportText += '='.repeat(60) + '\n';
    
    // Create and download file
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-readiness-report-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your AI Readiness Report</h1>
              <p className="text-muted-foreground">
                Completed on {new Date(results.completedAt).toLocaleDateString()}
              </p>
            </div>
            <Button onClick={handleDownloadReport} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-8 border-2">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6" />
              Overall AI Readiness Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-8 mb-6">
              <div className={`text-6xl font-bold ${getScoreColor(results.overallScore)}`}>
                {results.overallScore}
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Maturity Level:</span>
                  <Badge className={`${getScoreBgColor(results.overallScore)} ${getScoreColor(results.overallScore)} border-0`}>
                    {results.maturityLevel.name}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{results.maturityLevel.description}</p>
              </div>
            </div>
            <Progress value={results.overallScore} className="h-3" />
          </CardContent>
        </Card>

        {/* Dimension Scores */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Dimension Breakdown</CardTitle>
            <CardDescription>
              Your scores across the 7 key dimensions of AI readiness
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {results.dimensionScores.map((dimScore) => (
                <div key={dimScore.dimension.id}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{dimScore.dimension.icon}</span>
                      <div>
                        <div className="font-semibold">{dimScore.dimension.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {dimScore.dimension.description}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getScoreColor(dimScore.score)}>
                        {dimScore.maturityLevel.name}
                      </Badge>
                      <div className={`text-2xl font-bold ${getScoreColor(dimScore.score)} min-w-[80px] text-right`}>
                        {dimScore.score}
                        <span className="text-sm text-muted-foreground">/100</span>
                      </div>
                    </div>
                  </div>
                  <Progress value={dimScore.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reflections */}
        {(results.reflections?.opportunity || results.reflections?.obstacle || results.reflections?.readyDepartment) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Insights</CardTitle>
              <CardDescription>What you shared about your AI journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {results.reflections.opportunity && (
                <div>
                  <div className="font-semibold text-sm mb-1">Biggest Opportunity:</div>
                  <p className="text-muted-foreground">{results.reflections.opportunity}</p>
                </div>
              )}
              {results.reflections.obstacle && (
                <div>
                  <div className="font-semibold text-sm mb-1">Biggest Obstacle:</div>
                  <p className="text-muted-foreground">{results.reflections.obstacle}</p>
                </div>
              )}
              {results.reflections.readyDepartment && (
                <div>
                  <div className="font-semibold text-sm mb-1">Most AI-Ready Department:</div>
                  <p className="text-muted-foreground">{results.reflections.readyDepartment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
              <Lightbulb className="h-6 w-6" />
              Personalized Recommendations
            </h2>
            <p className="text-muted-foreground">
              Based on your assessment, here are prioritized actions to improve your AI readiness
            </p>
          </div>

          {/* High Priority Recommendations */}
          {highPriorityRecs.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <h3 className="text-xl font-semibold">High Priority</h3>
              </div>
              <div className="space-y-4">
                {highPriorityRecs.map((rec, idx) => (
                  <Card key={idx} className="border-l-4 border-l-red-600">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="outline" className="mb-2">{rec.dimension}</Badge>
                            <p>{rec.description}</p>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Recommended Actions:
                        </div>
                        <ul className="space-y-2">
                          {rec.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Medium Priority Recommendations */}
          {mediumPriorityRecs.length > 0 && (
            <div>
              <Separator className="my-8" />
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <h3 className="text-xl font-semibold">Medium Priority</h3>
              </div>
              <div className="space-y-4">
                {mediumPriorityRecs.map((rec, idx) => (
                  <Card key={idx} className="border-l-4 border-l-orange-600">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <CardDescription className="mt-1">
                            <Badge variant="outline" className="mb-2">{rec.dimension}</Badge>
                            <p>{rec.description}</p>
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="font-semibold text-sm flex items-center gap-2">
                          <Target className="h-4 w-4" />
                          Recommended Actions:
                        </div>
                        <ul className="space-y-2">
                          {rec.actions.map((action, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Next Steps CTA */}
        <Card className="mt-8 bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 text-white border-0">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-2">Ready to Take Action?</h3>
            <p className="text-white/90 mb-6">
              Use these recommendations to guide your AI transformation journey
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="lg"
                    className="bg-white text-orange-600 hover:bg-white/90 font-bold"
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Results with MESH
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Get Expert Help from MESH</DialogTitle>
                    <DialogDescription className="pt-4 space-y-4">
                      <p>
                        MESH can create a <strong>custom implementation plan</strong> to help you achieve some or all of these recommendations.
                      </p>
                      <p>
                        One of our AI Advisors will schedule a call to:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-sm">
                        <li>Review your assessment results in detail</li>
                        <li>Discuss your specific business goals and challenges</li>
                        <li>Develop a tailored roadmap for AI implementation</li>
                        <li>Provide guidance on next steps and resources</li>
                      </ul>
                      <div className="pt-4">
                        <Button
                          className="w-full bg-orange-600 hover:bg-orange-700"
                          onClick={() => window.open('https://whenwemesh.com/contact/', '_blank')}
                        >
                          Schedule Your Consultation
                        </Button>
                      </div>
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={handleDownloadReport}
              >
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setLocation('/')}
              >
                Take Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

