import type { Department } from "../departments/types";
import type { TypeOfAsset } from "../type-of-assets/types";
import type { Base } from "../types";

type FixedAsset = Base<{
	description: string;
	department: Department;
	departmentId?: number;
	typeOfAsset: TypeOfAsset;
	typeOfAssetId?: number;
	purchaseDate: string;
	purchaseValue: number;
	usefulLifeMonths: number;
	accumulatedDepreciation: number;
}>;

export type { FixedAsset };
