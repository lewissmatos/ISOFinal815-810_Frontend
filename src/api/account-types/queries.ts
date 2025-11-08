import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AccountType } from "./types";
import type { ServiceResponse } from "../types";
import { fetchAccountTypes, fetchActiveAccountTypes } from "./services";

export const useFetchAccountTypes = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<AccountType[]>>({
		queryKey: ["account-types", { showInactive }],
		queryFn: showInactive ? fetchAccountTypes : fetchActiveAccountTypes,
		enabled: Boolean(enabled),
	});
	return data;
};
