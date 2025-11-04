import { useMutation, useQueryClient } from "@tanstack/react-query";
import { executeDepreciationProcess } from "./services";

export const useExecuteDepreciationProcess = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (fixedAssetId?: number) =>
			executeDepreciationProcess(fixedAssetId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["fixed-assets", "accounting-entries"],
			});
		},
	});
};
