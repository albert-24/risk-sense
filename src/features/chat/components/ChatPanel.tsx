// import { useChat } from "../hooks/useChat";
import ChatConversation from "./ChatConversation";
import ChatInput from "./ChatInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { sendToChatbot } from "../../../redux/slices/chatSlice";
import { fetchChatbotResponse } from "../../../redux/thunks/chatThunks";

export default function ChatPanel() {
  // const { addMessage, isLoading, setIsLoading } = useChat();
  const dispatch = useAppDispatch();
  const receivingStatus = useAppSelector((state) => state.chat.receivingStatus);

  async function handleSend(message: string) {
    if (!message.trim()) return;

    dispatch(sendToChatbot(message));
    dispatch(fetchChatbotResponse(message));
  }

  return (
    <>
      <div className="grow">
        <ChatConversation />
      </div>
      <div className="w-full grow-0 py-4">
        <ChatInput
          onSend={handleSend}
          isLoading={receivingStatus == "pending"}
        />
      </div>
    </>
  );
}
