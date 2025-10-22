import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { questions, dimensions } from '@/lib/surveyData';
import { calculateResults, type SurveyResponse } from '@/lib/scoring';
import { industryOptions, companySizeOptions, revenueOptions, type CompanyInfo } from '@/lib/companyInfo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Survey() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState<'company-info' | 'survey'>('company-info');
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({ industry: '', companySize: '', annualRevenue: '' });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<SurveyResponse>({});

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const currentDimension = dimensions.find(d => d.id === currentQuestion.dimension);

  const handleRatingChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const handleMultipleChoiceChange = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: parseInt(value)
    }));
  };

  const handleMultipleSelectChange = (optionIndex: number, checked: boolean) => {
    setResponses(prev => {
      const current = (prev[currentQuestion.id] as number[]) || [];
      
      // If "None of the above" is selected, clear all other selections
      if (optionIndex === currentQuestion.options!.length - 1 && checked) {
        return {
          ...prev,
          [currentQuestion.id]: [optionIndex]
        };
      }
      
      // If another option is selected, remove "None of the above"
      const noneIndex = currentQuestion.options!.length - 1;
      const filtered = current.filter(i => i !== noneIndex);
      
      if (checked) {
        return {
          ...prev,
          [currentQuestion.id]: [...filtered, optionIndex]
        };
      } else {
        return {
          ...prev,
          [currentQuestion.id]: filtered.filter(i => i !== optionIndex)
        };
      }
    });
  };

  const canProceed = () => {
    // Optional questions can always be skipped
    if (currentQuestion.optional) {
      return true;
    }
    const response = responses[currentQuestion.id];
    return response !== undefined && response !== '';
  };

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate results
      const results = calculateResults(responses);
      
      // Save to database
      try {
        // Convert dimensionScores array to object for backend
        const dimensionScoresObj = results.dimensionScores.reduce((acc, ds) => {
          acc[ds.dimension.id] = ds.score;
          return acc;
        }, {} as Record<string, number>);

        const response = await fetch('/api/survey/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            industry: companyInfo.industry,
            companySize: companyInfo.companySize,
            annualRevenue: companyInfo.annualRevenue,
            responses,
            overallScore: results.overallScore,
            maturityLevel: results.maturityLevel,
            dimensionScores: dimensionScoresObj,
            reflections: results.reflections,
          }),
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Survey saved successfully:', data);
      } catch (error) {
        console.error('Failed to save survey:', error);
        // Continue to results page even if save fails
      }
      
      // Store results in sessionStorage
      sessionStorage.setItem('surveyResults', JSON.stringify(results));
      setLocation('/results');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Company info step rendering
  if (step === 'company-info') {
    return (
      <div className="min-h-screen bg-white">
        <div className="container py-8 max-w-4xl">
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation('/')}
              className="mb-4"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold mb-2">AI Readiness Assessment</h1>
            <p className="text-muted-foreground">
              Before we begin, tell us a bit about your organization
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                This helps us provide better insights. All responses are confidential.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="industry">Industry/Sector *</Label>
                <Select value={companyInfo.industry} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, industry: value }))}>
                  <SelectTrigger id="industry">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry}>{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="companySize">Company Size *</Label>
                <Select value={companyInfo.companySize} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, companySize: value }))}>
                  <SelectTrigger id="companySize">
                    <SelectValue placeholder="Select company size" />
                  </SelectTrigger>
                  <SelectContent>
                    {companySizeOptions.map((size) => (
                      <SelectItem key={size} value={size}>{size}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="revenue">Annual Revenue (Optional)</Label>
                <Select value={companyInfo.annualRevenue} onValueChange={(value) => setCompanyInfo(prev => ({ ...prev, annualRevenue: value }))}>
                  <SelectTrigger id="revenue">
                    <SelectValue placeholder="Select revenue range" />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueOptions.map((revenue) => (
                      <SelectItem key={revenue} value={revenue}>{revenue}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 flex justify-end">
            <Button
              onClick={() => setStep('survey')}
              disabled={!companyInfo.industry || !companyInfo.companySize}
              size="lg"
            >
              Start Assessment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation('/')}
            className="mb-4"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">AI Readiness Assessment</h1>
          <p className="text-muted-foreground">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
          <Progress value={progress} className="mt-4" />
        </div>

        {/* Dimension Badge */}
        <div className="mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full">
            <span className="text-2xl">{currentDimension?.icon}</span>
            <span className="font-medium text-primary">{currentDimension?.name}</span>
          </div>
        </div>

        {/* Question Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{currentQuestion.text}</CardTitle>
            {currentDimension && (
              <CardDescription>{currentDimension.description}</CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {currentQuestion.type === 'rating' && (
              <RadioGroup
                value={responses[currentQuestion.id]?.toString() || ''}
                onValueChange={handleRatingChange}
              >
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <div key={value} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                      <Label htmlFor={`rating-${value}`} className="flex-1 cursor-pointer">
                        {value === 1 && 'Strongly Disagree'}
                        {value === 2 && 'Disagree'}
                        {value === 3 && 'Neutral'}
                        {value === 4 && 'Agree'}
                        {value === 5 && 'Strongly Agree'}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'multiple-choice' && (
              <RadioGroup
                value={responses[currentQuestion.id]?.toString() || ''}
                onValueChange={handleMultipleChoiceChange}
              >
                <div className="space-y-3">
                  {currentQuestion.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-accent transition-colors">
                      <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentQuestion.type === 'text' && (
              <div>
                <Textarea
                  placeholder={currentQuestion.optional ? "Optional - Share your thoughts..." : "Your answer..."}
                  value={(responses[currentQuestion.id] as string) || ''}
                  onChange={(e) => setResponses(prev => ({
                    ...prev,
                    [currentQuestion.id]: e.target.value
                  }))}
                  className="min-h-[120px]"
                />
                {currentQuestion.optional && (
                  <p className="text-sm text-muted-foreground mt-2">This question is optional</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
          >
            {currentQuestionIndex === questions.length - 1 ? 'View Results' : 'Next'}
            {currentQuestionIndex < questions.length - 1 && (
              <ChevronRight className="ml-2 h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

