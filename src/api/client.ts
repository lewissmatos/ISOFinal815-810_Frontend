import { addToast } from "@heroui/react";
import axios, { AxiosError, type AxiosInstance } from "axios";

const createClient = (): AxiosInstance => {
	const client = axios.create({
		baseURL: `${import.meta.env.VITE_REACT_APP_API_URL}/api/v1`,
		timeout: 60_000,
		headers: {
			"Content-Type": "application/json",
		},
	});

	client.interceptors.request.use(
		(config) => {
			const token = localStorage.getItem("token");
			const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

			if (token) {
				config.headers.Authorization = `Bearer ${token}`;
			}

			config.headers["X-Timezone"] = timezone;

			return config;
		},
		(error) => {
			return Promise.reject(error);
		}
	);

	client.interceptors.response.use(
		(response) => response,
		async (error: AxiosError) => {
			try {
				const {
					response: { status, data },
				} = error as {
					response: {
						status: number;
						data: { message: string };
					};
				};

				if (![200, 201].includes(status) && data?.message) {
					addToast({
						title: data.message,
						color: "danger",
					});
				} else {
					addToast({
						title: "An unexpected error occurred.",
						color: "danger",
					});
				}
			} catch (error) {
				console.error("Error in response interceptor:", error);
				addToast({
					title: "An unexpected error occurred.",
					color: "danger",
				});
			}
			return Promise.reject(error);
		}
	);

	return client;
};

export const client = createClient();

export default client;
