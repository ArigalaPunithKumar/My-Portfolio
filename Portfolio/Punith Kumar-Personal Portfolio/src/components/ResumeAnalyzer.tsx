import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";

interface ResumeAnalysis {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
}

const ResumeAnalyzer = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
      if (!validTypes.includes(selectedFile.type)) {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, or TXT file.",
          variant: "destructive",
        });
        return;
      }
      if (selectedFile.size > 20 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 20MB.",
          variant: "destructive",
        });
        return;
      }
      setFile(selectedFile);
      setAnalysis(null);
    }
  };

  const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'text/plain') {
      return await file.text();
    }
    
    // For PDFs and DOC files, we'll read as text (simplified)
    // In production, you might want to use a proper PDF/DOC parser
    const text = await file.text();
    return text || "Unable to extract text from file";
  };

  const analyzeResume = async () => {
    if (!file) return;

    setAnalyzing(true);
    try {
      const resumeText = await extractTextFromFile(file);

      const { data, error } = await supabase.functions.invoke('analyze-resume', {
        body: { resumeText }
      });

      if (error) throw error;

      if (data?.analysis) {
        setAnalysis(data.analysis);
        toast({
          title: "Analysis complete!",
          description: `Your resume scored ${data.analysis.score}/100`,
        });
      } else {
        throw new Error("No analysis data received");
      }
    } catch (error: any) {
      console.error('Resume analysis error:', error);
      toast({
        title: "Analysis failed",
        description: error.message || "Failed to analyze resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-6">
      <Card className="glass border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <FileText className="w-6 h-6 text-primary" />
            AI Resume Analyzer
          </CardTitle>
          <CardDescription>
            Upload your resume and get instant AI-powered feedback with a detailed score
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Section */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-8 text-center hover:border-primary/40 transition-colors">
              <input
                type="file"
                id="resume-upload"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileChange}
                disabled={analyzing}
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center gap-4"
              >
                <Upload className="w-12 h-12 text-primary" />
                <div>
                  <p className="text-lg font-medium">
                    {file ? file.name : "Click to upload your resume"}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Supports PDF, DOC, DOCX, TXT (Max 20MB)
                  </p>
                </div>
              </label>
            </div>

            {file && (
              <Button
                onClick={analyzeResume}
                disabled={analyzing}
                className="w-full"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing Resume...
                  </>
                ) : (
                  "Analyze Resume"
                )}
              </Button>
            )}
          </div>

          {/* Results Section */}
          {analysis && (
            <div className="space-y-6 animate-fade-in">
              {/* Score */}
              <div className="text-center py-8 border-b border-border/30">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <p className="text-sm text-muted-foreground mt-2">out of 100</p>
                <Progress value={analysis.score} className="mt-4 h-3" />
              </div>

              {/* Summary */}
              <div>
                <h3 className="font-semibold text-lg mb-2">Overall Assessment</h3>
                <p className="text-muted-foreground">{analysis.summary}</p>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  Strengths
                </h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 dark:text-green-400 mt-1">•</span>
                      <span className="text-muted-foreground">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Improvements */}
              <div>
                <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  Areas for Improvement
                </h3>
                <ul className="space-y-2">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-yellow-600 dark:text-yellow-400 mt-1">•</span>
                      <span className="text-muted-foreground">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {analysis.recommendations.map((recommendation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="text-muted-foreground">{recommendation}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeAnalyzer;
