import type { Account } from "../accounts/types";
import type { AuxiliarySystem } from "../auxiliary-systems/types";
import type { Base } from "../types";

type AccountingEntry = Base<{
	id: number;
	description: string;
	account: Account;
	accountId: number;
	auxiliary: AuxiliarySystem;
	auxiliaryId: number;
	movementType: "DB" | "CR";
	entryDate: string;
	amount: number;
	status: string;
}>;

export type { AccountingEntry };
