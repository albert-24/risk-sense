import { render, screen } from "@testing-library/react";
import ChatInput from "../../../../src/features/chat/components/ChatInput";
import { describe, expect, it, vi } from "vitest";
import { ChatProvider } from "../../../../src/features/chat/contexts/ChatContext";
import { MapLayerProvider } from "../../../../src/features/map/contexts/MapLayerContext";
import ChatPanel from "../../../../src/features/chat/components/ChatPanel";
import { generateResponse } from "../../../../src/services/geminiService";
import userEvent from "@testing-library/user-event";

vi.mock("../../../../src/services/geminiService", () => ({
  generateResponse: vi.fn().mockImplementation((message) => {
    return "Mocked response for: " + message;
  }),
}));

describe("ChatInput", () => {
  it("renders an input field", () => {
    render(
      <MapLayerProvider>
        <ChatProvider>
          <ChatInput />
        </ChatProvider>
      </MapLayerProvider>
    );
    expect(
      screen.getByPlaceholderText("Ask about the Philippine geography...")
    ).toBeInTheDocument();
  });

  it("should NOT call generateResponse if input is empty", () => {
    render(
      <MapLayerProvider>
        <ChatProvider>
          <ChatPanel />
        </ChatProvider>
      </MapLayerProvider>
    );
    const input = screen.getByPlaceholderText(
      "Ask about the Philippine geography..."
    );

    // Simulate pressing Enter without typing anything
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    // Verify generateResponse was not called
    expect(generateResponse).not.toHaveBeenCalled();
  });

  it("should call generateResponse if input contains message", async () => {
    render(
      <MapLayerProvider>
        <ChatProvider>
          <ChatPanel />
        </ChatProvider>
      </MapLayerProvider>
    );
    const input = screen.getByPlaceholderText(
      "Ask about the Philippine geography..."
    );
    const message = "Please show me all provincial capitals in Luzon";

    const user = userEvent.setup();
    await user.type(input, message);
    await user.keyboard("{Enter}");

    expect(generateResponse).toHaveBeenCalledWith(message);
  });
});
