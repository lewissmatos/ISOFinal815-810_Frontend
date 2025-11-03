import {
	createEmployee,
	updateEmployee,
	toggleEmployeeStatus,
	deleteEmployee,
} from "./services";
import { useGenericMutate } from "../mutations";

export const useAddEmployee = () => {
	return useGenericMutate(createEmployee, ["employees"]);
};

export const useUpdateEmployee = () => {
	return useGenericMutate(updateEmployee, ["employees"]);
};

export const useToggleEmployeeStatus = () => {
	return useGenericMutate(toggleEmployeeStatus, ["employees"]);
};

export const useDeleteEmployee = () => {
	return useGenericMutate(deleteEmployee, ["employees"]);
};
