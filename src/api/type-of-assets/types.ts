import type { Account } from "../accounts/types";
import type { Base } from "../types";

type TypeOfAsset = Base<{
	description: string;
	buyingAccount: Account;
	buyingAccountId: number;
	depreciationAccount: Account;
	depreciationAccountId: number;
}>;

export type { TypeOfAsset };
