export type RuntimeEvent =
  | { type: "task.started"; taskId: string }
  | { type: "task.completed"; taskId: string; output: unknown }
  | { type: "task.failed"; taskId: string; error: string }
  | { type: "tool.called"; toolName: string }
  | { type: "tool.completed"; toolName: string };