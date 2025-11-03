import {
	Form,
	Button,
	Input,
	Select,
	SelectItem,
	DatePicker,
} from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import {
	useAddEmployee,
	useUpdateEmployee,
} from "../../api/employees/mutations";
import type { Employee, KindOfPerson } from "../../api/employees/types";
import { useEffect } from "react";
import { useFetchDepartments } from "../../api/departments/queries";
import { parseDate } from "@internationalized/date";
type Props = {
	employeeToEdit?: Employee | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<Employee>;
const EmployeeForm = ({
	employeeToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, setValue, watch } = useForm<Inputs>({
		defaultValues: {},
	});

	const { data: departmentsData, isFetching: isFetchingDepartments } =
		useFetchDepartments();

	useEffect(() => {
		reset({
			name: employeeToEdit?.name || "",
			cedula: employeeToEdit?.cedula || "",
			position: employeeToEdit?.position || "",
			kindOfPerson: employeeToEdit?.kindOfPerson,
			departmentId:
				employeeToEdit?.department?.id || employeeToEdit?.departmentId || 0,
			enrollmentDate: (employeeToEdit?.enrollmentDate as string) || "",
		});
	}, [employeeToEdit, isOpen, reset]);

	const idEditMode = Boolean(employeeToEdit?.id);

	const { mutateAsync: onAddEmployee, isPending: isAdding } = useAddEmployee();

	const { mutateAsync: onUpdateEmployee, isPending: isUpdating } =
		useUpdateEmployee();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (idEditMode
			? onUpdateEmployee({
					employeeId: employeeToEdit!.id,
					...data,
			  })
			: onAddEmployee(data));
		onCloseForm();
	};

	return (
		<AppModal
			title={(idEditMode ? "Actualizar" : "Agregar") + " Empleado"}
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
								return "Por favor introduzca el nombre";
							}
						}}
						{...register("name", { required: true })}
						label="Nombre"
						labelPlacement="outside-top"
					/>
					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la cédula";
							}
						}}
						{...register("cedula", {
							required: true,
							maxLength: 11,
							// Validate that the cedula contains only numbers, no dashes
							validate: (value) => /^\d+$/.test(value || ""),
						})}
						label="Cédula (sin guiones)"
						type="number"
						step={1}
						labelPlacement="outside-top"
					/>
					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca el puesto";
							}
						}}
						{...register("position", { required: true })}
						label="Puesto"
						labelPlacement="outside-top"
					/>

					<Select
						label="Tipo de Persona"
						labelPlacement="outside"
						placeholder="Seleccione un tipo de persona"
						isLoading={isFetchingDepartments}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("kindOfPerson")
								? new Set([watch("kindOfPerson")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const kindOfPerson = [...value][0].toString();
							setValue("kindOfPerson", kindOfPerson as KindOfPerson);
						}}
					>
						{
							["FISICA", "JURIDICA"].map((kindOfPerson) => (
								<SelectItem key={kindOfPerson}>{kindOfPerson}</SelectItem>
							)) as []
						}
					</Select>

					<DatePicker
						label="Fecha de entrada"
						labelPlacement="outside"
						defaultValue={
							employeeToEdit?.enrollmentDate
								? parseDate(employeeToEdit.enrollmentDate)
								: undefined
						}
						isRequired
						onChange={(date) => {
							if (!date) return;
							setValue("enrollmentDate", date?.toString());
						}}
					/>
					<Select
						label="Departamento"
						labelPlacement="outside"
						placeholder="Seleccione un gerente"
						isLoading={isFetchingDepartments}
						{...register("departmentId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("departmentId")
								? new Set([watch("departmentId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const departmentId = [...value][0].toString();
							const department = departmentsData?.data.find(
								(dept) => dept.id === Number(departmentId)
							);
							if (!department) return;
							setValue("departmentId", Number(departmentId));
							setValue("department", department);
						}}
					>
						{
							departmentsData?.data.map((department) => (
								<SelectItem key={department.id}>
									{department.description}
								</SelectItem>
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

export default EmployeeForm;
