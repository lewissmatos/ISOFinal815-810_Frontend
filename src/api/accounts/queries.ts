import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Account } from "./types";
import type { ServiceResponse } from "../types";
import { fetchAccounts, fetchActiveAccounts } from "./services";

export const useFetchAccounts = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<Account[]>>({
		queryKey: ["accounts", { showInactive }],
		queryFn: showInactive ? fetchAccounts : fetchActiveAccounts,
		enabled: Boolean(enabled),
	});
	return data;
};
