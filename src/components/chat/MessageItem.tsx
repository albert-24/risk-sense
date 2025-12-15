import { User, Bot, FileDown, Loader2 } from "lucide-react";
import { useState } from "react";
import type { Message } from "@/redux/slices/chatSlice";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { generateMemorandumData, generateSugarcaneLossPDF } from "@/lib/pdfGenerator";
// import rehypeSanitize from "rehype-sanitize";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      const sugarcaneLossData = await generateMemorandumData(message.content);
      if (sugarcaneLossData) {
        generateSugarcaneLossPDF(sugarcaneLossData);
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Check if this is an AI response that contains sugarcane loss data
  const sugarcaneLossKeywords = ['sugarcane', 'sugar cane', 'loss', 'affected area', 'import', 'compensation', 'harvest', 'crop damage'];
  const showPDFButton = message.role === "assistant" && 
    message.status !== "rejected" && 
    sugarcaneLossKeywords.some(keyword => message.content.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div
      className={`flex gap-3 ${
        message.status == "rejected"
          ? "bg-red-50"
          : message.role === "assistant"
          ? "bg-blue-50"
          : ""
      } p-3 rounded-lg`}
    >
      {message.role === "user" ? (
        <User className="w-6 h-6 text-blue-600" />
      ) : (
        <Bot
          className={`w-6 h-6 ${
            message.status == "rejected" ? "text-red-600" : "text-green-600"
          }`}
        />
      )}
      <div className="flex-1 text-sm text-gray-900">
        {message.role === "user" ? (
          <p>{message.content}</p>
        ) : (
          <Markdown rehypePlugins={[rehypeRaw]}>{message.content}</Markdown>
        )}
        
        {showPDFButton && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <button
              onClick={handleGeneratePDF}
              disabled={isGenerating}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors duration-200"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileDown className="w-4 h-4" />
              )}
              {isGenerating ? 'Generating Report...' : 'Generate Sugarcane Loss Report (PDF)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
