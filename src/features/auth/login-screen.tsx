import {
	Button,
	Card,
	CardBody,
	CardHeader,
	Form,
	Input,
	addToast,
} from "@heroui/react";
import { RiArrowRightBoxLine, RiLock2Line, RiUserLine } from "@remixicon/react";
import { useSetAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLogin } from "../../api/auth/mutations";
import { loginAtom } from "../../atoms/auth.atom";
import useSystemRouter from "../../hooks/useSystemRouter";

type LoginFormValues = {
	username: string;
	password: string;
};

const LoginScreen = () => {
	const navigate = useNavigate();
	const setAuthState = useSetAtom(loginAtom);
	const { getHomePath } = useSystemRouter();
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<LoginFormValues>({
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const { mutateAsync: authenticate, isPending } = useLogin();

	const onSubmit: SubmitHandler<LoginFormValues> = async (values) => {
		try {
			const response = await authenticate(values);
			setAuthState(response);
			reset();
			addToast({ title: "Bienvenido de nuevo", color: "success" });
			navigate(`/${getHomePath()}`, { replace: true, viewTransition: true });
		} catch {
			// The request interceptor already surfaces error feedback.
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
			<Card className="w-full max-w-md shadow-medium">
				<CardHeader className="flex flex-col gap-1">
					<h1 className="text-2xl font-semibold text-foreground">
						Iniciar sesión
					</h1>
					<p className="text-sm text-foreground-500">
						Ingresa tus credenciales para acceder al sistema.
					</p>
				</CardHeader>
				<CardBody>
					<Form
						className="flex flex-col gap-5"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Input
							label="Usuario"
							labelPlacement="outside"
							placeholder="Ingresa tu usuario"
							autoComplete="username"
							startContent={<RiUserLine size={18} />}
							isInvalid={Boolean(errors.username)}
							errorMessage={errors.username?.message}
							{...register("username", {
								required: "El usuario es requerido",
							})}
						/>
						<Input
							label="Contraseña"
							labelPlacement="outside"
							placeholder="Ingresa tu contraseña"
							autoComplete="current-password"
							type="password"
							startContent={<RiLock2Line size={18} />}
							isInvalid={Boolean(errors.password)}
							errorMessage={errors.password?.message}
							{...register("password", {
								required: "La contraseña es requerida",
							})}
						/>
						<div className="w-full flex justify-end">
							<Button
								color="primary"
								type="submit"
								isLoading={isPending}
								endContent={<RiArrowRightBoxLine size={18} />}
							>
								Ingresar
							</Button>
						</div>
					</Form>
				</CardBody>
			</Card>
		</div>
	);
};

export default LoginScreen;
