import { useMutation } from "@tanstack/react-query";
import { login } from "./services";
import type { LoginPayload, LoginResponse } from "./types";

export const useLogin = () => {
	return useMutation<LoginResponse, unknown, LoginPayload>({
		mutationFn: login,
	});
};
