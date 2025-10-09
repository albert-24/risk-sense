import { User, Bot } from "lucide-react";
import type { Message } from "../../../redux/slices/chatSlice";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
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
      </div>
    </div>
  );
}
