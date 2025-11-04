import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { FixedAsset } from "./types";
import type { ServiceResponse } from "../types";
import { fetchFixedAssets, fetchActiveFixedAssets } from "./services";

export const useFetchFixedAssets = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<FixedAsset[]>>({
		queryKey: ["fixed-assets", { showInactive }],
		queryFn: showInactive ? fetchFixedAssets : fetchActiveFixedAssets,
		enabled: Boolean(enabled),
	});
	return data;
};
