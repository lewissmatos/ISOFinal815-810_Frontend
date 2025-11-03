import { QueryClient } from "@tanstack/query-core";
let qc: any;
const getQueryClient: any = () => {
	if (!qc)
		qc = new QueryClient({
			defaultOptions: {
				queries: { staleTime: 5000, refetchOnWindowFocus: false, retry: false },
				mutations: { retry: false },
			},
		});

	return qc;
};

export default getQueryClient;
