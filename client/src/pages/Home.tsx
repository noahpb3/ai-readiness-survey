import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dimensions } from "@/lib/surveyData";
import { useLocation } from "wouter";
import { ArrowRight, CheckCircle2, BarChart3, FileText, Sparkles } from "lucide-react";

export default function Home() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-orange-600 to-red-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-medium">MESH AI Readiness Assessment</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Your Organization's AI Readiness
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Designed for small to mid-sized businesses. Understand your AI maturity level and get practical, actionable recommendations.
            </p>
            <Button
              size="lg"
              className="bg-white text-orange-600 hover:bg-white/90 text-lg px-8 py-6 h-auto font-bold"
              onClick={() => setLocation('/survey')}
            >
              Start Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm text-white/80">
              ⏱️ Takes approximately 8-12 minutes
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What You'll Get</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our assessment provides actionable insights to guide your AI transformation journey
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>AI Readiness Score</CardTitle>
                <CardDescription>
                  Get a clear score across 5 key areas: Strategy, Data & Systems, People, Governance, and Execution.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Maturity Assessment</CardTitle>
                <CardDescription>
                  See if you're Exploring, Experimenting, Scaling, or Leading in AI adoption for SMBs.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 hover:border-primary transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Personalized Recommendations</CardTitle>
                <CardDescription>
                  Get practical, budget-conscious recommendations designed specifically for small to mid-sized businesses.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Dimensions Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">5 Key Assessment Dimensions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We evaluate your organization across these critical areas
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {dimensions.map((dimension) => (
              <Card key={dimension.id} className="bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="text-4xl mb-2">{dimension.icon}</div>
                  <CardTitle className="text-lg">{dimension.name}</CardTitle>
                  <CardDescription>{dimension.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container">
          <Card className="bg-gradient-to-br from-orange-600 via-red-600 to-orange-700 text-white border-0">
            <CardContent className="py-16 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to Begin Your AI Journey?
              </h2>
              <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                Take the first step towards AI transformation with our comprehensive readiness assessment.
              </p>
              <Button
                size="lg"
                className="bg-white text-orange-600 hover:bg-white/90 text-lg px-8 py-6 h-auto font-bold"
                onClick={() => setLocation('/survey')}
              >
                Start Your Assessment Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground">
            © 2025 MESH. A Creative Brand Agency Driven By Results. | <a href="https://whenwemesh.com" target="_blank" rel="noopener noreferrer" className="hover:text-primary">whenwemesh.com</a>
          </p>
        </div>
      </footer>
    </div>
  );
}
