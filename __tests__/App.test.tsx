import "react-native";
import App from "../App";
import { it } from "@jest/globals";
import { render } from "@testing-library/react-native";

it("renders correctly", () => {
  render(<App />);
});
