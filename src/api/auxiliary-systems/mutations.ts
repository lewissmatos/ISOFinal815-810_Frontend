import { useGenericMutate } from "../mutations";
import {
	createAuxiliarySystem,
	deleteAuxiliarySystem,
	toggleAuxiliarySystemStatus,
	updateAuxiliarySystem,
} from "./services";

export const useAddAuxiliarySystem = () => {
	return useGenericMutate(createAuxiliarySystem, ["auxiliary-systems"]);
};

export const useUpdateAuxiliarySystem = () => {
	return useGenericMutate(updateAuxiliarySystem, ["auxiliary-systems"]);
};

export const useToggleAuxiliarySystemsStatus = () => {
	return useGenericMutate(toggleAuxiliarySystemStatus, ["auxiliary-systems"]);
};

export const useDeleteAuxiliarySystem = () => {
	return useGenericMutate(deleteAuxiliarySystem, ["auxiliary-systems"]);
};
