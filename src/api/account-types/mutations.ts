import { useGenericMutate } from "../mutations";
import {
	createAccountType,
	deleteAccountType,
	toggleAccountTypeStatus,
	updateAccountType,
} from "./services";

export const useAddAccountType = () => {
	return useGenericMutate(createAccountType, ["account-types"]);
};

export const useUpdateAccountType = () => {
	return useGenericMutate(updateAccountType, ["account-types"]);
};

export const useToggleAccountTypeTypesStatus = () => {
	return useGenericMutate(toggleAccountTypeStatus, ["account-types"]);
};

export const useDeleteAccountType = () => {
	return useGenericMutate(deleteAccountType, ["account-types"]);
};
