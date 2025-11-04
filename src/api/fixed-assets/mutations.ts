import {
	createFixedAsset,
	updateFixedAsset,
	toggleFixedAssetStatus,
	deleteFixedAsset,
} from "./services";
import { useGenericMutate } from "../mutations";

export const useAddFixedAsset = () => {
	return useGenericMutate(createFixedAsset, ["fixed-assets"]);
};

export const useUpdateFixedAsset = () => {
	return useGenericMutate(updateFixedAsset, ["fixed-assets"]);
};

export const useToggleFixedAssetStatus = () => {
	return useGenericMutate(toggleFixedAssetStatus, ["fixed-assets"]);
};

export const useDeleteFixedAsset = () => {
	return useGenericMutate(deleteFixedAsset, ["fixed-assets"]);
};
