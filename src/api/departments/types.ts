import type { Employee } from "../employees/types";
import type { Base } from "../types";

type Department = Base<{
	description: string;
	details?: string;
	managerId?: number | null;
	manager?: Employee | null;
}>;

export type { Department };
