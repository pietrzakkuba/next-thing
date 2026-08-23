/**
 * Smoke test — verifies Jest + RTL + jest-dom are wired up correctly.
 * Replace with real component tests as the app grows.
 */
import { render, screen } from "@testing-library/react";

function Hello({ name }: { name: string }) {
  return <p>Hello, {name}!</p>;
}

describe("testing setup", () => {
  it("renders a component and asserts DOM content", () => {
    render(<Hello name="world" />);
    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
  });
});
