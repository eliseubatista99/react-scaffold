import { FeedbackExample } from "../packages/core/src/providers/feedback/_example/feedbackExample";
import { NavigationExample } from "../packages/core/src/providers/navigation/_example/navigationExample";
import type { ExampleItem } from "./example";

export const examples: ExampleItem[] = [
  {
    title: "Feedback Provider",
    content: <FeedbackExample />,
  },
  {
    title: "Navigation Provider",
    content: <NavigationExample />,
  },
];
