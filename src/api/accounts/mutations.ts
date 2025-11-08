import { useGenericMutate } from "../mutations";
import {
	createAccount,
	deleteAccount,
	toggleAccountStatus,
	updateAccount,
} from "./services";

export const useAddAccount = () => {
	return useGenericMutate(createAccount, ["accounts"]);
};

export const useUpdateAccount = () => {
	return useGenericMutate(updateAccount, ["accounts"]);
};

export const useToggleAccountsStatus = () => {
	return useGenericMutate(toggleAccountStatus, ["accounts"]);
};

export const useDeleteAccount = () => {
	return useGenericMutate(deleteAccount, ["accounts"]);
};
