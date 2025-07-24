import { motion } from "framer-motion";
// import { useChat } from "../hooks/useChat";
import MessageItem from "./MessageItem";
import { useAppSelector } from "../../../redux/hooks";
// import { useSelector } from "../../redux/chatSlice";

export default function ChatConversation() {
  const messages = useAppSelector((state) => state.chat.messages);

  return (
    <motion.div
      initial={{ x: "100%" }}
      animate={{ x: messages.length > 0 ? 0 : "100%" }}
      transition={{ type: "spring", damping: 20 }}
      className="fixed right-0 top-0 bottom-0 w-96 bg-white shadow-lg border-l border-gray-200 overflow-hidden"
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Exploration</h2>
      </div>
      <div className="overflow-y-auto h-[calc(100vh-64px)] p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem key={message.id} message={message} />
        ))}
      </div>
    </motion.div>
  );
}
