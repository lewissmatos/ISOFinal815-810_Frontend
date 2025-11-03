import {
	createTypeOfAsset,
	updateTypeOfAsset,
	toggleTypeOfAssetStatus,
	deleteTypeOfAsset,
} from "./services";
import { useGenericMutate } from "../mutations";

export const useAddTypeOfAsset = () => {
	return useGenericMutate(createTypeOfAsset, ["type-of-assets"]);
};

export const useUpdateTypeOfAsset = () => {
	return useGenericMutate(updateTypeOfAsset, ["type-of-assets"]);
};

export const useToggleTypeOfAssetStatus = () => {
	return useGenericMutate(toggleTypeOfAssetStatus, ["type-of-assets"]);
};

export const useDeleteTypeOfAsset = () => {
	return useGenericMutate(deleteTypeOfAsset, ["type-of-assets"]);
};
