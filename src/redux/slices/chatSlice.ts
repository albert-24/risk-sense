import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchChatbotResponse } from "../thunks/chatThunks";
import type { ChatClassifierResponse } from "@/services/mordorService";
import { generateRandomID } from "@/lib/utils";

export interface Message {
  id: string;
  status: "rejected" | "fulfilled";
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  geoJson?: GeoJSON.FeatureCollection;
}

interface ChatState {
  messages: Message[];
  receivingStatus: "idle" | "pending" | "received" | "error";
}

const initialState: ChatState = {
  messages: [],
  receivingStatus: "idle",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    sendToChatbot: (state, action: PayloadAction<string>) => {
      const newMessage: Message = {
        // id: crypto.randomUUID(),
        id: generateRandomID(),
        status: "fulfilled",
        content: action.payload,
        role: "user",
        timestamp: new Date().toISOString(),
      };

      state.messages = [...state.messages, newMessage];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChatbotResponse.pending, (state) => {
      state.receivingStatus = "pending";
    });

    builder.addCase(fetchChatbotResponse.fulfilled, (state, action) => {
      const { aiResponse, classificationResponse } = action.payload;

      const newMessage: Message = {
        // id: crypto.randomUUID(),
        id: Math.random().toString(32),
        status: aiResponse.status,
        content: aiResponse.status == "rejected" ?
          "Cannot generate response. Please try again later." : 
          formatToMarkdown(aiResponse.value.text, classificationResponse),
        role: "assistant",
        timestamp: new Date().toISOString(),
        geoJson: aiResponse.status == "rejected" ? undefined : aiResponse.value.geoJson,
      };

      state.messages = [...state.messages, newMessage];
      state.receivingStatus = "received";
    });

    builder.addCase(fetchChatbotResponse.rejected, (state) => {
      state.receivingStatus = "error";
    });
  },
});

function formatToMarkdown(
  aiResponseText: string,
  classificationResponse: PromiseSettledResult<ChatClassifierResponse>
): string {
  var redirectionUrl = null;
  if (classificationResponse.status == "rejected") {
    return aiResponseText;
  }

  const classificationValue = classificationResponse.value;

  try {
    redirectionUrl = new URL(classificationValue.url)
  } catch {}

  console.log("Redirection URL:", redirectionUrl);
  
  var redirectionName = 'this website';
  if (classificationValue.target == "analytics") {
    redirectionName = 'GATES Analytics Dashboard';
  } else {
    redirectionName = `${classificationValue.target} website`;
  }
  const redirectionMessage = redirectionUrl ? `<br /><br />For more detailed information, please visit the <a class="underline text-blue-600 hover:text-blue-800 visited:text-purple-600" href="${redirectionUrl.href}" target="_blank">${redirectionName}</a>` : '';
  return `${aiResponseText}${redirectionMessage}`;
}

export const { sendToChatbot } = chatSlice.actions;

export default chatSlice.reducer;
