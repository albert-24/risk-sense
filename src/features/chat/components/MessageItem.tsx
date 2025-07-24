import { User, Bot } from "lucide-react";
import type { Message } from "../../../redux/slices/chatSlice";

interface MessageItemProps {
  message: Message;
}

export default function MessageItem({ message }: MessageItemProps) {
  return (
    <div
      className={`flex gap-3 ${
        message.role === "assistant" ? "bg-blue-50" : ""
      } p-3 rounded-lg`}
    >
      {message.role === "user" ? (
        <User className="w-6 h-6 text-blue-600" />
      ) : (
        <Bot className="w-6 h-6 text-green-600" />
      )}
      <div className="flex-1">
        <p className="text-sm text-gray-900">{message.content}</p>
      </div>
    </div>
  );
}
