import {
	Form,
	Textarea,
	Button,
	Input,
	Select,
	SelectItem,
} from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import {
	useAddDepartment,
	useUpdateDepartment,
} from "../../api/departments/mutations";
import type { Department } from "../../api/departments/types";
import { useEffect } from "react";
import { useFetchEmployees } from "../../api/employees/queries";

type Props = {
	departmentToEdit?: Department | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<Department>;
const DepartmentForm = ({
	departmentToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, watch, setValue } = useForm<Inputs>({
		defaultValues: { description: "" },
	});

	const { data: employeesData, isFetching: isFetchingEmployees } =
		useFetchEmployees();

	useEffect(() => {
		reset({
			description: departmentToEdit?.description || "",
			details: departmentToEdit?.details || "",
			managerId:
				departmentToEdit?.manager?.id || departmentToEdit?.managerId || 0,
		});
	}, [departmentToEdit, isOpen, reset]);

	const idEditMode = Boolean(departmentToEdit?.id);

	const { mutateAsync: onAddDepartment, isPending: isAdding } =
		useAddDepartment();

	const { mutateAsync: onUpdateDepartment, isPending: isUpdating } =
		useUpdateDepartment();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (idEditMode
			? onUpdateDepartment({
					departmentId: departmentToEdit!.id,
					...data,
			  })
			: onAddDepartment(data));
		onCloseForm();
	};
	return (
		<AppModal
			title="Agregar Departamento"
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
					<Textarea
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la descripción";
							}
						}}
						{...register("details")}
						label="Detalles"
						labelPlacement="outside"
					/>
					<Select
						label="Gerente"
						labelPlacement="outside"
						placeholder="Seleccione un gerente"
						selectedKeys={
							watch("managerId")
								? new Set([watch("managerId")!.toString()])
								: new Set()
						}
						onSelectionChange={(selection) => {
							const managerId = [...selection][0]?.toString() || "";
							const manager = employeesData?.data.find(
								(emp) => emp.id === Number(managerId)
							);
							setValue("manager", manager || null);
							setValue("managerId", manager?.id || null);
						}}
						isLoading={isFetchingEmployees}
					>
						{
							employeesData?.data.map((employee) => (
								<SelectItem key={employee.id}>{employee.name}</SelectItem>
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
							{(idEditMode ? "Actualizar" : "Agregar") + " Departamento"}
						</Button>
					</div>
				</div>
			</Form>
		</AppModal>
	);
};

export default DepartmentForm;
