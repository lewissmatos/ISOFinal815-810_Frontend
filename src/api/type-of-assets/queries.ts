import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { TypeOfAsset } from "./types";
import type { ServiceResponse } from "../types";
import { fetchTypeOfAssets } from "./services";

export const useFetchTypeOfAssets = (options?: Partial<UseQueryOptions>) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<TypeOfAsset[]>>({
		queryKey: ["type-of-assets"],
		queryFn: fetchTypeOfAssets,
		enabled: Boolean(enabled),
	});
	return data;
};
