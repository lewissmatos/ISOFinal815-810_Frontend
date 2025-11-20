import axios from "axios";
import client from "../client";
import type { ServiceResponse } from "../types";
import type { Currency, UpdateCurrencyRate } from "./types";

export const fetchCurrencies = async (): Promise<
	ServiceResponse<Currency[]>
> => {
	const response = await client.get("/currencies");
	return response.data;
};

export const fetchActiveCurrencies = async (): Promise<
	ServiceResponse<Currency[]>
> => {
	const response = await client.get("/currencies/active");
	return response.data;
};

export const createCurrency = async (
	payload?: Partial<Omit<Currency, "id">>
): Promise<ServiceResponse<Currency>> => {
	const response = await client.post("/currencies", {
		...payload,
	});
	return response.data;
};

export const updateCurrency = async ({
	currencyId,
	...payload
}: {
	currencyId: number;
} & Partial<Omit<Currency, "id">>): Promise<ServiceResponse<Currency>> => {
	const response = await client.put(`/currencies/${currencyId}`, payload);
	return response.data;
};

export const deleteCurrency = async (
	currencyId: number
): Promise<ServiceResponse<Currency>> => {
	const response = await client.delete(`/currencies/${currencyId}`);
	return response.data;
};

export const toggleCurrencyStatus = async (
	currencyId: number
): Promise<ServiceResponse<Currency>> => {
	const response = await client.patch(`/currencies/${currencyId}/toggle`);
	return response.data;
};

export const updateCurrencyRate = async (
	code: string
): Promise<ServiceResponse<null>> => {
	const response = await axios.get(
		`${
			import.meta.env.VITE_REACT_APP_CURRENCIES_API_JSON_URL
		}/api/TasaCambio/${code}`
	);
	return response;
};

export const syncCurrency = async (
	id: number,
	data: UpdateCurrencyRate
): Promise<ServiceResponse<null>> => {
	const response = await client.post("/currencies/sync/" + id, data);
	return response.data;
};
