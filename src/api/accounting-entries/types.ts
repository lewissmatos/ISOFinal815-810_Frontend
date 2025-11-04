import type { Account } from "../accounts/types";
import type { Depreciation } from "../depreciations/types";
import type { TypeOfAsset } from "../type-of-assets/types";
import type { Base } from "../types";

type AccountingEntry = Base<{
	id: number;
	description: string;
	inventoryType?: TypeOfAsset;
	account: Account;
	depreciationCalculation: Depreciation;
	movementType: "DB" | "CR";
	entryDate: string;
	amount: number;
	status: "PENDIENTE" | "PROCESADO" | "ANULADO";
}>;

export type { AccountingEntry };
