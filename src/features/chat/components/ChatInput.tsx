import React, { useState } from "react";
import { Send } from "lucide-react";

type ChatInputProps = {
  onSend?: (message: string) => Promise<void>;
  isLoading?: boolean;
};

export default function ChatInput({
  onSend,
  isLoading = false,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await onSend?.(input);
  };

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Chat input"
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
