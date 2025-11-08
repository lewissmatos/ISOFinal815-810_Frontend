import { Form, Button, Input } from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import {
	useAddAuxiliarySystem,
	useUpdateAuxiliarySystem,
} from "../../api/auxiliary-systems/mutations";
import type { AuxiliarySystem } from "../../api/auxiliary-systems/types";
import { useEffect } from "react";

type Props = {
	auxiliarySystemToEdit?: AuxiliarySystem | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<AuxiliarySystem>;
const AuxiliarySystemForm = ({
	auxiliarySystemToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset } = useForm<Inputs>({
		defaultValues: { name: "" },
	});

	useEffect(() => {
		reset({
			name: auxiliarySystemToEdit?.name || "",
		});
	}, [auxiliarySystemToEdit, isOpen, reset]);

	const isEditMode = Boolean(auxiliarySystemToEdit?.id);

	const { mutateAsync: onAddAuxiliarySystem, isPending: isAdding } =
		useAddAuxiliarySystem();

	const { mutateAsync: onUpdateAuxiliarySystem, isPending: isUpdating } =
		useUpdateAuxiliarySystem();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateAuxiliarySystem({
					auxiliarySystemId: auxiliarySystemToEdit!.id,
					...data,
			  })
			: onAddAuxiliarySystem(data));
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
								return "Por favor introduzca la descripción";
							}
						}}
						{...register("name", { required: true })}
						label="Nombre"
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

export default AuxiliarySystemForm;
