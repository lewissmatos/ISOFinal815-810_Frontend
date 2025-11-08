import { Form, Button, Input } from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import { useEffect } from "react";
import type { Currency } from "../../api/currencies/types";
import {
	useAddCurrency,
	useUpdateCurrency,
} from "../../api/currencies/mutations";

type Props = {
	currencyToEdit?: Currency | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<Currency>;
const CurrencyForm = ({
	currencyToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: { ISOCode: "", description: "", exchangeRate: 0 },
	});

	useEffect(() => {
		reset({
			ISOCode: currencyToEdit?.ISOCode || "",
			description: currencyToEdit?.description || "",
			exchangeRate: currencyToEdit?.exchangeRate || 1,
		});
	}, [currencyToEdit, isOpen, reset]);

	const isEditMode = Boolean(currencyToEdit?.id);

	const { mutateAsync: onAddCurrency, isPending: isAdding } = useAddCurrency();

	const { mutateAsync: onUpdateCurrency, isPending: isUpdating } =
		useUpdateCurrency();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateCurrency({
					currencyId: currencyToEdit!.id,
					...data,
			  })
			: onAddCurrency(data));
		onCloseForm();
	};
	return (
		<AppModal
			title={(isEditMode ? "Editar" : "Agregar") + " Cuenta Contable"}
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
								return "Por favor introduzca el código ISO";
							}
						}}
						{...register("ISOCode", { required: true })}
						label="Código ISO"
						labelPlacement="outside-top"
					/>
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
					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la tasa de cambio";
							}
						}}
						{...register("exchangeRate", { required: true })}
						label="Tasa de Cambio"
						min={1}
						type="number"
						step={0.01}
						labelPlacement="outside-top"
					/>

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

export default CurrencyForm;
