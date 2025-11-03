import { useQuery } from "@tanstack/react-query";
import type { Department } from "./types";
import type { ServiceResponse } from "../types";
import { fetchDepartments } from "./services";

export const useFetchDepartments = () => {
	const data = useQuery<ServiceResponse<Department[]>>({
		queryKey: ["departments"],
		queryFn: fetchDepartments,
	});
	return data;
};
