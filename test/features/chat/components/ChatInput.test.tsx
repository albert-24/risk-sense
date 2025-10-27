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
    expect(screen.getByPlaceholderText("Ask GATES...")).toBeInTheDocument();
  });

  it("should NOT call generateResponse if input is empty", () => {
    const mockOnSend = vi.fn();

    render(
      <Provider store={store}>
        <ChatInput onSend={mockOnSend} />
      </Provider>
    );
    const input = screen.getByPlaceholderText("Ask GATES...");

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
    const input = screen.getByPlaceholderText("Ask GATES...");
    const message = "Please show me all provincial capitals in Luzon";

    const user = userEvent.setup();
    await user.type(input, message);
    await user.keyboard("{Enter}");

    expect(mockOnSend).toHaveBeenCalledWith(message);
    expect(mockOnSend).toHaveBeenCalledTimes(1);
  });

  it("should clear the input box after sending a message", async () => {
  const mockOnSend = vi.fn();

  render(
    <Provider store={store}>
      <ChatInput onSend={mockOnSend} />
    </Provider>
  );

  const input = screen.getByPlaceholderText(
    "Ask about the Philippine geography..."
  );
  const message = "Show me all cities in Mindanao";

  const user = userEvent.setup();

  // Type a message
  await user.type(input, message);
  // Press Enter
  await user.keyboard("{Enter}");

  // Check that the message was sent
  expect(mockOnSend).toHaveBeenCalledWith(message);

  // Check that the input is now empty
  expect(input).toHaveValue("");

  });

  it("should NOT call generateResponse if input contains only spaces", async () => {
  const mockOnSend = vi.fn();

  render(
    <Provider store={store}>
      <ChatInput onSend={mockOnSend} />
    </Provider>
  );

  const input = screen.getByPlaceholderText(
    "Ask about the Philippine geography..."
  );
  const user = userEvent.setup();

  // Type only spaces
  await user.type(input, "     ");
  // Press Enter
  await user.keyboard("{Enter}");

  // Expect that the send function was NOT called
  expect(mockOnSend).not.toHaveBeenCalled();
  });

  it("should trim extra spaces before sending a message", async () => {
  const mockOnSend = vi.fn();

  render(
    <Provider store={store}>
      <ChatInput onSend={mockOnSend} />
    </Provider>
  );

  const input = screen.getByPlaceholderText(
    "Ask about the Philippine geography..."
  );
  const user = userEvent.setup();

  // Type a message with spaces before and after
  await user.type(input, "   Hello Mindanao   ");
  await user.keyboard("{Enter}");

  // Expect that it sends the trimmed version only
  expect(mockOnSend).toHaveBeenCalledWith("Hello Mindanao");

  // Confirm it only sent once
  expect(mockOnSend).toHaveBeenCalledTimes(1);
  })

  it("should disable the input field while waiting for a response", () => {
  render(
    <Provider store={store}>
      <ChatInput isLoading={true} />
    </Provider>
  );

  const input = screen.getByPlaceholderText("Exploring...");

  // Expect the input to be disabled
  expect(input).toBeDisabled();
});
});
