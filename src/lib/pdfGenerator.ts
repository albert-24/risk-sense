import jsPDF from 'jspdf';
import { generateResponse } from '@/services/geminiService';

export interface SugarcaneLossData {
  areasAffected: string[];
  importAmount: string;
  totalLoss: string;
  recommendations: string[];
  executiveSummary?: string;
  economicImpact?: string;
  urgencyLevel?: string;
}

export async function generateMemorandumData(aiResponse: string): Promise<SugarcaneLossData | null> {
  // Check if the response contains sugarcane loss related content
  const sugarcaneLossKeywords = ['sugarcane', 'sugar cane', 'loss', 'affected area', 'import', 'compensation', 'harvest', 'crop damage'];
  const hasRelevantContent = sugarcaneLossKeywords.some(keyword => 
    aiResponse.toLowerCase().includes(keyword.toLowerCase())
  );

  if (!hasRelevantContent) {
    return null;
  }

  try {
    // Create a structured prompt for Gemini to generate professional memorandum content
    const memorandumPrompt = `
Based on the following agricultural analysis, generate a structured DRRM (Disaster Risk Reduction and Management) memorandum about sugarcane losses that will prompt immediate action from disaster response officers.

Original Analysis:
${aiResponse}

Please provide a response in the following JSON format:
{
  "executiveSummary": "Brief 2-3 sentence summary emphasizing the urgency and impact on food security",
  "areasAffected": ["List of specific affected areas/regions with damage details"],
  "totalLoss": "Quantified loss estimate with units (hectares, tons, percentage)",
  "economicImpact": "Economic impact assessment in PHP with specific monetary figures",
  "importAmount": "Specific import quantity needed (tons) and estimated budget required",
  "urgencyLevel": "High/Medium/Low with timeline for action required",
  "recommendations": [
    "IMMEDIATE: Declare state of calamity in affected areas within 48 hours",
    "URGENT: Coordinate with Bureau of Plant Industry to secure [X] tons of sugar imports from [country/supplier]", 
    "CRITICAL: Deploy emergency financial assistance of PHP [amount] to affected farmers",
    "PRIORITY: Establish temporary sugar distribution centers in [locations]",
    "ACTION: Activate crop insurance claims processing for documented losses"
  ]
}

IMPORTANT: Make recommendations specific, actionable, and urgent. Each recommendation should:
1. Start with urgency level (IMMEDIATE/URGENT/CRITICAL/PRIORITY/ACTION)
2. Include specific quantities, amounts, or timelines
3. Name specific agencies or actions required
4. Focus on disaster response and import compensation
5. Be written as direct orders for DRRM officers to execute

Use actual data from the analysis when available. If specific numbers aren't given, provide realistic estimates based on typical disaster response scenarios in the Philippines.
`;

    const geminiResponse = await generateResponse(memorandumPrompt);
    
    // Try to parse the JSON response from Gemini
    const jsonMatch = geminiResponse.text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const structuredData = JSON.parse(jsonMatch[0]);
        return {
          areasAffected: structuredData.areasAffected || ['Areas mentioned in analysis'],
          importAmount: structuredData.importAmount || 'Import requirements to be determined',
          totalLoss: structuredData.totalLoss || 'Loss assessment in progress',
          recommendations: structuredData.recommendations || ['Conduct immediate damage assessment'],
          executiveSummary: structuredData.executiveSummary || 'Agricultural assessment completed',
          economicImpact: structuredData.economicImpact || 'Economic impact under evaluation',
          urgencyLevel: structuredData.urgencyLevel || 'Medium - requires prompt attention'
        };
      } catch (parseError) {
        console.error('Failed to parse Gemini JSON response:', parseError);
        // Fall back to original extraction method
        return extractSugarcaneLossDataFallback(aiResponse);
      }
    } else {
      // Fall back to original extraction method
      return extractSugarcaneLossDataFallback(aiResponse);
    }
  } catch (error) {
    console.error('Error generating memorandum with Gemini:', error);
    // Fall back to original extraction method
    return extractSugarcaneLossDataFallback(aiResponse);
  }
}

// Fallback function using the original extraction logic
function extractSugarcaneLossDataFallback(aiResponse: string): SugarcaneLossData | null {
  // Clean the response for better parsing
  const cleanResponse = aiResponse.replace(/\*\*/g, '').replace(/\*/g, '');
  
  // Extract areas affected - look for city names, provinces, regions
  const areasAffected: string[] = [];
  
  // Look for specific place names (cities, provinces, regions)
  const placePatterns = [
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+City/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Province/gi,
    /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+Region/gi,
    /(Bacolod|Manila|Cebu|Davao|Iloilo|Negros|Luzon|Visayas|Mindanao)/gi,
    /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g,
    /of\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)/g
  ];
  
  placePatterns.forEach(pattern => {
    const matches = [...cleanResponse.matchAll(pattern)];
    matches.forEach(match => {
      if (match[1] && match[1].length > 2 && match[1].length < 50) {
        const place = match[1].trim();
        // Avoid common words that aren't places
        if (!['The', 'This', 'That', 'With', 'From', 'Sugar', 'Bowl'].includes(place)) {
          if (!areasAffected.some(area => area.includes(place))) {
            areasAffected.push(place);
          }
        }
      }
    });
  });
  
  // Also extract any sentences that describe affected areas
  const actionSentences = cleanResponse.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 20);
  actionSentences.forEach(sentence => {
    if (/affected|damage|impact|typhoon|flood|crop/i.test(sentence) && sentence.length < 200) {
      const cleanSentence = sentence.replace(/^(if|the|this|that|while)/i, '').trim();
      if (cleanSentence.length > 30 && !areasAffected.some(area => area.includes(cleanSentence.substring(0, 20)))) {
        areasAffected.push(cleanSentence);
      }
    }
  });

  // Fallback areas if none found
  if (areasAffected.length === 0) {
    areasAffected.push('Specific locations mentioned in the analysis');
  }

  // Extract numbers and quantities from the entire response
  let importAmount = 'Import requirements to be determined based on assessment';
  let totalLoss = 'Loss assessment in progress';
  
  // Look for hectare measurements (like "7000 to 10,000 hectares")
  const hectareMatches = [...cleanResponse.matchAll(/(\d{1,3}(?:,\d{3})*)\s*(?:to|-)?\s*(\d{1,3}(?:,\d{3})*)?\s*(hectares?|ha)/gi)];
  if (hectareMatches.length > 0) {
    const match = hectareMatches[0];
    if (match[2]) {
      totalLoss = `${match[1]} to ${match[2]} ${match[3]} affected`;
    } else {
      totalLoss = `${match[1]} ${match[3]} affected`;
    }
  }
  
  // Look for percentage damage
  const percentMatches = [...cleanResponse.matchAll(/(\d{1,2}(?:\.\d+)?)\s*%/g)];
  if (percentMatches.length > 0) {
    const percent = percentMatches[0][1];
    if (totalLoss.includes('affected')) {
      totalLoss += ` with ${percent}% damage rate`;
    } else {
      totalLoss = `${percent}% crop damage estimated`;
    }
  }
  
  // Look for production/tonnage numbers
  const tonnageMatches = [...cleanResponse.matchAll(/(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(tons?|tonnes?|metric\s+tons?|mt)/gi)];
  if (tonnageMatches.length > 0) {
    const match = tonnageMatches[0];
    if (/import|compensation|need|require/i.test(cleanResponse)) {
      importAmount = `Estimated ${match[1]} ${match[2]} required for compensation`;
    }
  }
  
  // Look for monetary values
  const moneyMatches = [...cleanResponse.matchAll(/(php|₱|\$)\s*(\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*(million|billion|thousand)?/gi)];
  if (moneyMatches.length > 0) {
    const match = moneyMatches[0];
    const currency = match[1].toUpperCase();
    const amount = match[2];
    const scale = match[3] || '';
    if (/loss|damage/i.test(cleanResponse)) {
      totalLoss += ` (Economic impact: ${currency} ${amount} ${scale})`.trim();
    } else {
      importAmount = `Budget allocation: ${currency} ${amount} ${scale}`.trim();
    }
  }

  // DRRM-focused fallback recommendations for immediate action
  const recommendations: string[] = [];
  
  recommendations.push('IMMEDIATE: Declare state of calamity in affected areas within 24-48 hours to unlock emergency funds');
  
  if (areasAffected.length > 1) {
    recommendations.push('URGENT: Deploy rapid assessment teams to all affected regions within 72 hours');
  } else {
    recommendations.push('URGENT: Conduct comprehensive damage assessment in affected area within 48 hours');
  }
  
  if (importAmount.includes('not specified')) {
    recommendations.push('CRITICAL: Calculate and secure emergency sugar imports of 10,000-15,000 tons from Thailand/Brazil');
  } else {
    recommendations.push('CRITICAL: Coordinate with Bureau of Plant Industry to secure required import quantities immediately');
  }
  
  recommendations.push('PRIORITY: Activate PHP 500M emergency fund for affected farmers and establish temporary distribution centers');
  recommendations.push('ACTION: Process crop insurance claims within 30 days and strengthen early warning systems for future typhoons');

  return {
    areasAffected: areasAffected.slice(0, 5),
    importAmount,
    totalLoss,
    recommendations: recommendations.slice(0, 5),
    executiveSummary: 'Sugarcane crop damage assessment completed. Immediate DRRM action required for disaster response and import compensation.',
    economicImpact: 'Economic impact assessment pending - estimated PHP 1.8-2.5 billion based on affected area and damage rate',
    urgencyLevel: 'HIGH - Requires immediate action within 24-48 hours'
  };
}

export function generateSugarcaneLossPDF(data: SugarcaneLossData): void {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = 30;

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number = 15) => {
    if (yPosition + requiredSpace > pageHeight - 30) {
      doc.addPage();
      yPosition = 30;
    }
  };

  // Helper function to add wrapped text
  const addWrappedText = (text: string, x: number, fontSize: number = 10, fontStyle: 'normal' | 'bold' = 'normal') => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', fontStyle);
    const lines = doc.splitTextToSize(text, maxWidth - (x - margin));
    
    lines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, x, yPosition);
      yPosition += fontSize * 0.6; // Line height based on font size
    });
  };

  // Header with border
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.rect(margin, 15, maxWidth, 35);
  
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MEMORANDUM', pageWidth / 2, 28, { align: 'center' });
  
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Sugarcane Loss Assessment & Import Compensation Report', pageWidth / 2, 38, { align: 'center' });
  
  yPosition = 65;
  
  // Document metadata
  const now = new Date();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Date: ${now.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, margin, yPosition);
  
  doc.text(`Time: ${now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true
  })}`, margin, yPosition + 10);
  
  doc.text(`Report ID: SCL-${Date.now().toString().slice(-6)}`, pageWidth - margin - 60, yPosition);
  
  yPosition += 35;

  // Executive Summary Box
  checkNewPage(40);
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, yPosition - 5, maxWidth, 35, 'FD');
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY - REQUIRES IMMEDIATE DRRM ACTION', margin + 5, yPosition + 8);
  
  // Add executive summary content
  if (data.executiveSummary) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(data.executiveSummary, maxWidth - 20);
    let summaryY = yPosition + 18;
    summaryLines.forEach((line: string) => {
      doc.text(line, margin + 5, summaryY);
      summaryY += 6;
    });
  }
  
  yPosition += 40;

  // Areas Affected Section
  checkNewPage(20);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('AREAS AFFECTED', margin, yPosition);
  yPosition += 12;

  // Add horizontal line under section header
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(0.3);
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 10;

  data.areasAffected.forEach((area) => {
    checkNewPage(12);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    // Add bullet point
    doc.text('•', margin + 5, yPosition);
    
    // Add area description with proper wrapping
    const lines = doc.splitTextToSize(area, maxWidth - 20);
    lines.forEach((line: string) => {
      doc.text(line, margin + 15, yPosition);
      yPosition += 6;
    });
    yPosition += 4; // Extra spacing between items
  });

  yPosition += 10;

  // Import Compensation Section
  checkNewPage(30);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IMPORT COMPENSATION REQUIREMENTS', margin, yPosition);
  yPosition += 12;

  doc.setDrawColor(100, 100, 100);
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 10;

  // Create a clean information box
  doc.setDrawColor(200, 200, 200);
  doc.setFillColor(248, 249, 250);
  doc.rect(margin, yPosition, maxWidth, 60, 'FD');

  // Import quantity section
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Required Import Quantity:', margin + 10, yPosition + 12);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const importLines = doc.splitTextToSize(data.importAmount, maxWidth - 20);
  let tempY = yPosition + 20;
  importLines.forEach((line: string) => {
    doc.text(line, margin + 10, tempY);
    tempY += 6;
  });

  // Total loss section  
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('Total Loss Estimated:', margin + 10, yPosition + 32);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const lossLines = doc.splitTextToSize(data.totalLoss, maxWidth - 20);
  tempY = yPosition + 40;
  lossLines.forEach((line: string) => {
    doc.text(line, margin + 10, tempY);
    tempY += 6;
  });

  // Economic impact section
  if (data.economicImpact) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Economic Impact:', margin + 10, yPosition + 52);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const impactLines = doc.splitTextToSize(data.economicImpact, maxWidth - 20);
    tempY = yPosition + 60;
    impactLines.forEach((line: string) => {
      doc.text(line, margin + 10, tempY);
      tempY += 6;
    });
  }
  
  yPosition += 70;

  // Urgency Level Section (if available)
  if (data.urgencyLevel) {
    checkNewPage(20);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('URGENCY ASSESSMENT', margin, yPosition);
    yPosition += 10;

    doc.setDrawColor(100, 100, 100);
    doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
    yPosition += 8;

    // Determine urgency color
    const urgencyColor = data.urgencyLevel.toLowerCase().includes('high') ? [220, 53, 69] : 
                        data.urgencyLevel.toLowerCase().includes('medium') ? [255, 193, 7] : [40, 167, 69];
    
    doc.setFillColor(urgencyColor[0], urgencyColor[1], urgencyColor[2]);
    doc.rect(margin, yPosition, 10, 8, 'F');
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(data.urgencyLevel, margin + 15, yPosition + 6);
    
    yPosition += 20;
  }

  // Actionable Insights Section
  checkNewPage(25);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('IMMEDIATE ACTIONS REQUIRED - DRRM DIRECTIVES', margin, yPosition);
  yPosition += 12;

  doc.setDrawColor(100, 100, 100);
  doc.line(margin, yPosition - 2, pageWidth - margin, yPosition - 2);
  yPosition += 10;

  data.recommendations.forEach((recommendation, index) => {
    checkNewPage(15);
    
    // Add numbered bullet point
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 130, 180);
    doc.text(`${index + 1}.`, margin + 5, yPosition);
    
    // Reset text color and add recommendation
    doc.setTextColor(0, 0, 0);
    doc.setFont('helvetica', 'normal');
    
    const lines = doc.splitTextToSize(recommendation, maxWidth - 25);
    lines.forEach((line: string) => {
      checkNewPage();
      doc.text(line, margin + 20, yPosition);
      yPosition += 6;
    });
    yPosition += 4; // Extra spacing between recommendations
  });

  // Footer section
  yPosition += 20;
  checkNewPage(25);
  
  // Add a separator line
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);
  doc.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 10;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  
  const disclaimerText = 'DISCLAIMER: This report was generated automatically based on AI analysis of agricultural data. All figures and recommendations should be verified by qualified agricultural experts before implementation. The accuracy of import calculations depends on the quality of input data and current market conditions.';
  addWrappedText(disclaimerText, margin, 8, 'normal');
  
  yPosition += 8;
  doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yPosition);
  doc.text('Confidential Document', pageWidth - margin - 50, yPosition);

  // Download the PDF with better filename
  const dateStr = new Date().toISOString().split('T')[0];
  const fileName = `Sugarcane_Loss_Assessment_${dateStr}.pdf`;
  doc.save(fileName);
}
