import type { Department } from "../departments/types";
import type { Base } from "../types";

type Employee = Base<{
	name: string;
	cedula: string;
	departmentId: number;
	department: Department;
	position: string;
	kindOfPerson: KindOfPerson;
	enrollmentDate: string;
}>;

type KindOfPerson = "FISICA" | "JURIDICA";

export type { Employee, KindOfPerson };
