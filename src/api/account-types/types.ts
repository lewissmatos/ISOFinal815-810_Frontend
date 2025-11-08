import type { Base } from "../types";

type AccountTypeOrigin = "CR" | "DB";

type AccountType = Base<{
	description: string;
	origin: AccountTypeOrigin;
}>;

export type { AccountType, AccountTypeOrigin };
