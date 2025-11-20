import type { Base } from "../types";

type Currency = Base<{
	ISOCode: string;
	description: string;
	exchangeRate: number;
}>;

type UpdateCurrencyRate = {
	code: string;
	rate: number;
};

export type { Currency, UpdateCurrencyRate };
