import React, { createContext, useState } from "react";
import type { ChatContextType, Message } from "../../../types";

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (
    content: string,
    role: Message["role"],
    geoJson?: GeoJSON.FeatureCollection
  ) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      content,
      role,
      timestamp: new Date(),
      geoJson,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <ChatContext.Provider
      value={{ messages, addMessage, isLoading, setIsLoading }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export { ChatContext };
