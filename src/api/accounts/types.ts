import type { AccountType } from "../account-types/types";
import type { Base } from "../types";

type Account = Base<{
	id: number;
	description: string;
	allowsMovement: "S" | "N";
	accountType?: AccountType;
	accountTypeId: number;
	level: number;
	balance: number;
	parentAccount?: Account;
	parentAccountId?: number;
}>;

export type { Account };
