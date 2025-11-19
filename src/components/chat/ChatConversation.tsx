import MessageItem from "./MessageItem";
import { useAppSelector } from "@/redux/hooks";

export default function ChatConversation() {
  const messages = useAppSelector((state) => state.chat.messages);

  return (
    <>
      <div className="overflow-y-auto p-4 space-y-4 max-md:max-h-96 h-[calc(100vh-7.5rem)]">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </>
  );
}
