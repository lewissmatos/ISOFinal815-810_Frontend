import type { Base } from "../types";

type Currency = Base<{
	ISOCode: string;
	description: string;
	exchangeRate: number;
}>;

export type { Currency };
