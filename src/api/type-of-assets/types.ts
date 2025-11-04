import type { Account } from "../accounts/types";
import type { Base } from "../types";

type TypeOfAsset = Base<{
	description: string;
	purchaseAccount: Account;
	purchaseAccountId: number;
	depreciationAccount: Account;
	depreciationAccountId: number;
}>;

export type { TypeOfAsset };
