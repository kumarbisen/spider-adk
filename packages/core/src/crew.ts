import type { Crew as CrewType, Agent, Task } from "./types.js";

let crewCounter = 0;

export function createCrew(agents: Agent[], tasks: Task[]): CrewType {
  crewCounter += 1;

  return {
    id: `crew_${crewCounter}`,
    agents,
    tasks
  };
}