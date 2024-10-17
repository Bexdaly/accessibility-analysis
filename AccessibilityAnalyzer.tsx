"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { 
  Card, CardContent, CardDescription, 
  CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Download, AlertTriangle } from "lucide-react";
import jsPDF from "jspdf";
import "jspdf-autotable";

type AccessibilityResult = {
  score: number;
  level: "AAA" | "AA" | "A";
  wcagViolations: number;
  aiSuggestions: number;
  pagesScanned: number;
  estimatedFixTime: string;
  colorContrastIssues: number;
  ariaLabelIssues: number;
  keyboardNavigationIssues: number;
  industryComparison: number;
  perceivable: boolean;
  operable: boolean;
  understandable: boolean;
  robust: boolean;
};

export default function AccessibilityAnalyzer() {
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<AccessibilityResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset progress and results on every new analysis
  useEffect(() => {
    if (websiteUrl) resetAnalysis();
  }, [websiteUrl]);

  const resetAnalysis = () => {
    setProgress(0);
    setResults(null);
    setError(null);
  };

  const analyzeWebsite = async () => {
    try {
      setIsAnalyzing(true);
      resetAnalysis();

      // Simulate API call
      for (let i = 10; i <= 100; i += 10) {
        setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      // Mock results
      const mockResults: AccessibilityResult = {
        score: 85,
        level: "AA",
        wcagViolations: 15,
        aiSuggestions: 5,
        pagesScanned: 20,
        estimatedFixTime: "2 hours",
        colorContrastIssues: 3,
        ariaLabelIssues: 5,
        keyboardNavigationIssues: 2,
        industryComparison: 75,
        perceivable: true,
        operable: true,
        understandable: false,
        robust: true,
      };
      setResults(mockResults);
    } catch (err) {
      setError("Failed to analyze website. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generatePDFReport = () => {
    if (!results) return;

    const pdf = new jsPDF();
    pdf.setFontSize(18);
    pdf.text("Accessibility Analysis Report", 20, 20);

    pdf.setFontSize(12);
    pdf.text(`Website: ${websiteUrl}`, 20, 30);
    pdf.text(`Overall Score: ${results.score}`, 20, 40);
    pdf.text(`WCAG Compliance Level: ${results.level}`, 20, 50);

    pdf.autoTable({
      startY: 60,
      head: [["WCAG Guideline", "Status"]],
      body: [
        ["Perceivable", results.perceivable ? "Pass" : "Fail"],
        ["Operable", results.operable ? "Pass" : "Fail"],
        ["Understandable", results.understandable ? "Pass" : "Fail"],
        ["Robust", results.robust ? "Pass" : "Fail"],
      ],
    });

    pdf.autoTable({
      startY: pdf.lastAutoTable.finalY + 10,
      head: [["Metric", "Value"]],
      body: [
        ["WCAG Violations", results.wcagViolations.toString()],
        ["AI Suggestions", results.aiSuggestions.toString()],
        ["Pages Scanned", results.pagesScanned.toString()],
        ["Estimated Fix Time", results.estimatedFixTime],
        ["Color Contrast Issues", results.colorContrastIssues.toString()],
        ["ARIA Label Issues", results.ariaLabelIssues.toString()],
        ["Keyboard Navigation Issues", results.keyboardNavigationIssues.toString()],
      ],
    });

    pdf.save("accessibility-report.pdf");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Website Accessibility Analyzer</h1>
      <p className="mb-4">
        Analyze your website based on the{" "}
        <a
          href="https://www.w3.org/WAI/standards-guidelines/wcag/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          WCAG guidelines
        </a>.
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          analyzeWebsite();
        }}
        className="mb-8"
      >
        <div className="flex gap-2 mb-4">
          <Input
            type="url"
            placeholder="Enter website URL"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            aria-label="Website URL"
          />
          <Button type="submit" disabled={isAnalyzing}>
            {isAnalyzing ? "Analyzing..." : "Analyze"}
          </Button>
        </div>
      </form>

      {error && (
        <div className="text-red-600" role="alert">
          {error}
        </div>
      )}

      {isAnalyzing && (
        <div aria-live="polite">
          <Progress value={progress} className="mb-4" />
        </div>
      )}

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Analysis Results</CardTitle>
            <CardDescription>
              Accessibility score and key findings for {websiteUrl}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold">WCAG Compliance</h3>
                <ul className="list-disc list-inside">
                  <li>Perceivable: {results.perceivable ? "Pass" : "Fail"}</li>
                  <li>Operable: {results.operable ? "Pass" : "Fail"}</li>
                  <li>Understandable: {results.understandable ? "Pass" : "Fail"}</li>
                  <li>Robust: {results.robust ? "Pass" : "Fail"}</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Key Metrics</h3>
                <ul className="list-disc list-inside">
                  <li>WCAG Violations: {results.wcagViolations}</li>
                  <li>AI Suggestions: {results.aiSuggestions}</li>
                  <li>Pages Scanned: {results.pagesScanned}</li>
                </ul>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={generatePDFReport} className="w-full">
              <Download className="mr-2 h-4 w-4" aria-hidden="true" /> Download PDF Report
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
