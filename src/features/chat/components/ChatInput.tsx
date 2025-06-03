import React, { useState } from "react";
import { Send } from "lucide-react";
import { useChat } from "../hooks/useChat";
import { useMapLayer } from "../../map/hooks/useMapLayer";
import { generateResponse } from "../../../services/geminiService";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const { addMessage, isLoading, setIsLoading } = useChat();
  const { setGeoJsonData } = useMapLayer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input;
    setInput("");
    addMessage(userMessage, "user");

    try {
      setIsLoading(true);

      const response = await generateResponse(userMessage);

      setIsLoading(false);

      addMessage(response.text, "assistant", response.geoJson);
      if (response.geoJson) {
        setGeoJsonData(response.geoJson);
      }
    } catch {
      setIsLoading(false);

      addMessage(
        "Sorry, I encountered an error processing your request.",
        "assistant"
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-2xl"
    >
      <div
        className={`mx-4 flex items-center gap-2 bg-white rounded-lg shadow-lg border border-gray-200  ${
          isLoading ? "animate-pulse" : ""
        }`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isLoading}
          placeholder={
            isLoading ? "Exploring..." : "Ask about the Philippine geography..."
          }
          className={`flex-1 px-4 py-3 bg-transparent outline-none`}
        />
        {!isLoading && (
          <button
            type="submit"
            className="p-2 mr-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Send size={20} />
          </button>
        )}
      </div>
    </form>
  );
}
