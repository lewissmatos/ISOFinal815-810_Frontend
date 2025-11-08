import { Form, Button, Input, Select, SelectItem } from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import { useEffect } from "react";
import type { AccountType } from "../../api/account-types/types";
import {
	useAddAccountType,
	useUpdateAccountType,
} from "../../api/account-types/mutations";
type Props = {
	accountTypeToEdit?: AccountType | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<AccountType>;
const AccountTypeForm = ({
	accountTypeToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, setValue } = useForm<Inputs>({
		defaultValues: { description: "" },
	});

	useEffect(() => {
		reset({
			description: accountTypeToEdit?.description || "",
			origin: accountTypeToEdit?.origin || "DB",
		});
	}, [accountTypeToEdit, isOpen, reset]);

	const isEditMode = Boolean(accountTypeToEdit?.id);

	const { mutateAsync: onAddAccountType, isPending: isAdding } =
		useAddAccountType();

	const { mutateAsync: onUpdateAccountType, isPending: isUpdating } =
		useUpdateAccountType();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateAccountType({
					accountTypeId: accountTypeToEdit!.id,
					...data,
			  })
			: onAddAccountType(data));
		onCloseForm();
	};
	return (
		<AppModal
			title={(isEditMode ? "Editar" : "Agregar") + " Tipo de Cuenta"}
			TriggerIcon={RiAddCircleLine}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onClose={onCloseForm}
		>
			<Form
				className="w-full justify-center items-center py-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-4 w-full">
					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la descripción";
							}
						}}
						{...register("description", { required: true })}
						label="Descripción"
						labelPlacement="outside-top"
					/>

					<Select
						label="Origen"
						placeholder="Selecciona un origen"
						labelPlacement="outside"
						{...register("origin", { required: true })}
						isRequired
						disallowEmptySelection
						onSelectionChange={(value) => {
							const origin = [...value][0]?.toString();
							if (!origin) return;
							setValue("origin", origin as unknown as "DB" | "CR");
						}}
					>
						{
							["DB", "CR"].map((item) => (
								<SelectItem key={item}>{item}</SelectItem>
							)) as []
						}
					</Select>
					<div className="flex justify-end">
						<Button
							type="submit"
							color="primary"
							isLoading={isAdding || isUpdating}
							endContent={<RiCheckboxCircleLine size={18} />}
						>
							{(isEditMode ? "Actualizar" : "Agregar") + " Departamento"}
						</Button>
					</div>
				</div>
			</Form>
		</AppModal>
	);
};

export default AccountTypeForm;
