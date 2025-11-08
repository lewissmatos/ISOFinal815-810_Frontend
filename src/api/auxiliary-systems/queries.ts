import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AuxiliarySystem } from "./types";
import type { ServiceResponse } from "../types";
import { fetchAuxiliarySystems, fetchActiveAuxiliarySystems } from "./services";

export const useFetchAuxiliarySystems = (
	options?: Partial<UseQueryOptions> & { showInactive?: boolean }
) => {
	const { enabled = true, showInactive = true } = options || {};
	const data = useQuery<ServiceResponse<AuxiliarySystem[]>>({
		queryKey: ["auxiliary-systems", { showInactive }],
		queryFn: showInactive ? fetchAuxiliarySystems : fetchActiveAuxiliarySystems,
		enabled: Boolean(enabled),
	});
	return data;
};
