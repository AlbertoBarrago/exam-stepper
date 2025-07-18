import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import StartButton from "@/components/StartButton";

// This mock needs to useRouter in test
jest.mock("next/navigation", () => ({
    useRouter: () => ({ push: jest.fn() })
}));

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({ attemptId: "test-attempt" })
        })
    ) as jest.Mock;
});

afterEach(() => {
    jest.clearAllMocks();
});

// Example test
test("renders the start button and handles click", async () => {
    render(<StartButton />);
    const btn = screen.getByRole("button", { name: /start the free english test/i });
    expect(btn).toBeDefined()
    fireEvent.click(btn);

    expect(global.fetch).toHaveBeenCalledWith("/api/start", { method: "POST" });
});