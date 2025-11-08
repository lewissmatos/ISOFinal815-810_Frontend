import { useMutation, useQueryClient } from "@tanstack/react-query";
import { saveAccountingEntry } from "./services";

export const useSaveAccountingEntry = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: saveAccountingEntry,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["accounting-entries"],
			});
		},
	});
};
