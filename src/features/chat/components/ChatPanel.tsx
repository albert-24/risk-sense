// import { useChat } from "../hooks/useChat";
import ChatConversation from "./ChatConversation";
import ChatInput from "./ChatInput";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { sendToChatbot } from "../../../redux/slices/chatSlice";
import { fetchChatbotResponse } from "../../../redux/thunks/chatThunks";

export default function ChatPanel() {
  // const { addMessage, isLoading, setIsLoading } = useChat();
  const dispatch = useAppDispatch();
  const sendingStatus = useAppSelector((state) => state.chat.sendingStatus);

  async function handleSend(message: string) {
    if (!message.trim()) return;

    dispatch(sendToChatbot(message));
    dispatch(fetchChatbotResponse(message));
  }

  return (
    <>
      <div className="fixed flex flex-col max-md:w-full max-lg:w-80 w-96 max-md:h-80 justify-between md:left-4 bottom-4 md:top-4 rounded-lg z-50 bg-white shadow-lg">
        <div className="grow">
          <ChatConversation />
        </div>
        <div className="w-full py-4 max-w-2xl">
          <ChatInput
            onSend={handleSend}
            isLoading={sendingStatus == "sending"}
          />
        </div>
      </div>
    </>
  );
}
