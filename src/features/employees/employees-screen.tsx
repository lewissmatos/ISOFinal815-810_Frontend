import { Button, useDisclosure } from "@heroui/react";
import type { Employee } from "../../api/employees/types";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";
import { useFetchEmployees } from "../../api/employees/queries";
import EmployeeForm from "./employee-form";
import AppTable from "../../components/ui/app-table";
import {
	useDeleteEmployee,
	useToggleEmployeeStatus,
} from "../../api/employees/mutations";
import { useState } from "react";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import DeleteButton from "../../components/ui/delete-button";
import { formatDate } from "date-fns";
import { parseDate } from "@internationalized/date";

const EmployeesScreen = () => {
	const { data: employeesData, isFetching } = useFetchEmployees();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

	const handleSetEmployeeToEdit = (employee: Employee) => {
		setEmployeeToEdit(employee);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleEmployeeStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } = useDeleteEmployee();

	const columns = [
		{
			headerLabel: "Gerente",
			selector: (row: Employee) => row.cedula,
		},
		{
			headerLabel: "Descripción",
			selector: (row: Employee) => (
				<span className="font-semibold">{row.name}</span>
			),
		},
		{
			headerLabel: "Puesto",
			selector: (row: Employee) => row.position,
		},
		{
			headerLabel: "Departamento",
			selector: (row: Employee) => row?.department?.description,
		},
		{
			headerLabel: "Tipo de Persona",
			selector: (row: Employee) => row.kindOfPerson,
		},
		{
			headerLabel: "Fecha de Ingreso",
			selector: (row: Employee) =>
				row.enrollmentDate
					? formatDate(parseDate(row.enrollmentDate).toDate("AST"), "P")
					: "-",
		},
		{
			headerLabel: "Estado",
			selector: (row: Employee) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: Employee) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetEmployeeToEdit(row)}
					>
						<RiEditLine size={18} />
					</Button>

					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => {
							onToggleStatus(row.id);
						}}
						isLoading={isToggling || isFetching}
					>
						{row.isActive ? (
							<RiForbidLine size={18} className="text-danger-500" />
						) : (
							<RiCheckboxCircleLine size={18} className="text-success-500" />
						)}
					</Button>
					<DeleteButton
						onConfirm={() => {
							onDelete(row.id);
						}}
						isLoading={isDeleting || isFetching}
					/>
				</div>
			),
		},
	];

	return (
		<ScreenLayout>
			<div className="flex items-center w-full justify-between mb-4">
				<ScreenTitle>Empleados</ScreenTitle>
				<EmployeeForm
					employeeToEdit={employeeToEdit}
					isOpen={isOpen}
					onClose={() => {
						setEmployeeToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={employeesData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default EmployeesScreen;
