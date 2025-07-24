import { render, screen } from "@testing-library/react";
import ChatInput from "../../../../src/features/chat/components/ChatInput";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { store } from "../../../../src/redux/store";
import { Provider } from "react-redux";

describe("ChatInput", () => {
  it("renders an input field", () => {
    render(
      <Provider store={store}>
        <ChatInput />
      </Provider>
    );
    expect(
      screen.getByPlaceholderText("Ask about the Philippine geography...")
    ).toBeInTheDocument();
  });

  it("should NOT call generateResponse if input is empty", () => {
    const mockOnSend = vi.fn();

    render(
      <Provider store={store}>
        <ChatInput onSend={mockOnSend} />
      </Provider>
    );
    const input = screen.getByPlaceholderText(
      "Ask about the Philippine geography..."
    );

    // Simulate pressing Enter without typing anything
    input.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));

    // Verify generateResponse was not called
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should call generateResponse if input contains message", async () => {
    const mockOnSend = vi.fn();

    render(
      <Provider store={store}>
        <ChatInput onSend={mockOnSend} />
      </Provider>
    );
    const input = screen.getByPlaceholderText(
      "Ask about the Philippine geography..."
    );
    const message = "Please show me all provincial capitals in Luzon";

    const user = userEvent.setup();
    await user.type(input, message);
    await user.keyboard("{Enter}");

    expect(mockOnSend).toHaveBeenCalledWith(message);
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });
});
