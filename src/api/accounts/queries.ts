import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { Account } from "./types";
import type { ServiceResponse } from "../types";
import { fetchAccounts } from "./services";

export const useFetchAccounts = (options?: Partial<UseQueryOptions>) => {
	const { enabled = true } = options || {};
	const data = useQuery<ServiceResponse<Account[]>>({
		queryKey: ["accounts"],
		queryFn: fetchAccounts,
		enabled: Boolean(enabled),
	});
	return data;
};
