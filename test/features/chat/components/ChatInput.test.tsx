import { render, screen } from "@testing-library/react";
import ChatInput from "../../../../src/features/chat/components/ChatInput";
import { describe, expect, it } from "vitest";
import { ChatProvider } from "../../../../src/features/chat/contexts/ChatContext";
import { MapLayerProvider } from "../../../../src/features/map/contexts/MapLayerContext";
// import userEvent from "@testing-library/user-event";

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
});
