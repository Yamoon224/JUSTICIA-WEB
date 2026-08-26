import type { Agent } from "./agent";

export interface AgentListePage {
  data: Agent[];
  meta: { current_page: number; last_page: number; total: number };
}
