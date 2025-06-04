import { generateResponse } from "../../../services/geminiService";
import { useMapLayer } from "../../map/hooks/useMapLayer";
import { useChat } from "../hooks/useChat";
import ChatConversation from "./ChatConversation";
import ChatInput from "./ChatInput";

export default function ChatPanel() {
  const { addMessage, isLoading, setIsLoading } = useChat();
  const { setGeoJsonData } = useMapLayer();

  async function handleSend(message: string) {
    if (!message.trim()) return;

    addMessage(message, "user");

    try {
      setIsLoading(true);

      const response = await generateResponse(message);

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
  }

  return (
    <>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
      <ChatConversation />
    </>
  );
}
