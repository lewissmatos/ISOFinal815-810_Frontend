export type ServiceResponse<T> = {
	data: T;
	isOk?: boolean;
	message?: string;
};

export type Base<T> = {
	id: number;
	isActive: boolean;
} & T;
