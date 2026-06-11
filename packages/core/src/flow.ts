import type { FlowState } from "./types.js";

export type FlowHandler<TState extends FlowState> = (state: TState) => Promise<unknown> | unknown;

export interface Flow<TState extends FlowState> {
  state: TState;
  start: FlowHandler<TState>;
  routes: Record<string, FlowHandler<TState>>;
}

export function createFlow<TState extends FlowState>(state: TState, start: FlowHandler<TState>): Flow<TState> {
  return {
    state,
    start,
    routes: {}
  };
}