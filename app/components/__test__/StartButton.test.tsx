import React from "react";
import {render, screen, fireEvent} from "@testing-library/react";
import StartButton from "@/components/StartButton";

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

test("calls handleStart when button is clicked", () => {
    const handleStart = jest.fn();
    render(<StartButton handleStart={handleStart} />);
    const btn = screen.getByRole("button", { name: /start the free english test/i });
    fireEvent.click(btn);
    expect(handleStart).toHaveBeenCalled();
});

