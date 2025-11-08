import { useGenericMutate } from "../mutations";
import {
	createCurrency,
	deleteCurrency,
	toggleCurrencyStatus,
	updateCurrency,
} from "./services";

export const useAddCurrency = () => {
	return useGenericMutate(createCurrency, ["currencies"]);
};

export const useUpdateCurrency = () => {
	return useGenericMutate(updateCurrency, ["currencies"]);
};

export const useToggleCurrenciesStatus = () => {
	return useGenericMutate(toggleCurrencyStatus, ["currencies"]);
};

export const useDeleteCurrency = () => {
	return useGenericMutate(deleteCurrency, ["currencies"]);
};
