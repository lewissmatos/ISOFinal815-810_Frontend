import {
	useMutation,
	useQueryClient,
	type MutationFunction,
} from "@tanstack/react-query";

export const useGenericMutate = (fn: unknown, queryKey: string[]) => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: fn as MutationFunction<unknown, unknown> | undefined,
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey,
				exact: false,
			});
		},
	});
};
