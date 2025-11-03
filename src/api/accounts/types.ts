type Account = {
	id: number;
	description: string;
	allowsMovement: "S" | "N";
	type: number;
	level: number;
	balance: number;
	parentAccountCode?: number | null;
};

export type { Account };
