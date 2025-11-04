import type { AccountingEntry } from "../accounting-entries/types";
import type { Account } from "../accounts/types";
import type { FixedAsset } from "../fixed-assets/types";

type Depreciation = {
	id: number;
	processYear: number;
	processMonth: number;
	asset: FixedAsset;
	processDate: string;
	depreciatedAmount: number;
	accumulatedDepreciation: number;
	purchaseAccount: Account;
	depreciationAccount: Account;
	accountingEntries: AccountingEntry[];
};

type FetchDepreciationsParams = {
	fixedAssetId?: number;
	processYear?: number;
	processMonth?: number;
};
export type { Depreciation, FetchDepreciationsParams };
