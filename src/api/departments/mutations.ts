import {
	createDepartment,
	deleteDepartment,
	toggleDepartmentStatus,
	updateDepartment,
} from "./services";
import { useGenericMutate } from "../mutations";

export const useAddDepartment = () => {
	return useGenericMutate(createDepartment, ["departments"]);
};

export const useUpdateDepartment = () => {
	return useGenericMutate(updateDepartment, ["departments"]);
};

export const useToggleDepartmentStatus = () => {
	return useGenericMutate(toggleDepartmentStatus, ["departments"]);
};

export const useDeleteDepartment = () => {
	return useGenericMutate(deleteDepartment, ["departments"]);
};
