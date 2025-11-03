import { Button, useDisclosure } from "@heroui/react";
import { useFetchDepartments } from "../../api/departments/queries";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import DepartmentForm from "./department-form";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import { useState } from "react";
import type { Department } from "../../api/departments/types";
import DeleteButton from "../../components/ui/delete-button";
import {
	useDeleteDepartment,
	useToggleDepartmentStatus,
} from "../../api/departments/mutations";
import AppTable from "../../components/ui/app-table";

const DepartmentsScreen = () => {
	const { data: departmentsData, isFetching } = useFetchDepartments();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [departmentToEdit, setDepartmentToEdit] = useState<Department | null>(
		null
	);

	const handleSetDepartmentToEdit = (department: Department) => {
		setDepartmentToEdit(department);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleDepartmentStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } =
		useDeleteDepartment();

	const columns = [
		{
			headerLabel: "Descripción",
			selector: (row: Department) => (
				<span className="font-semibold">{row?.description}</span>
			),
		},
		{
			headerLabel: "Detalles",
			selector: (row: Department) => row.details,
		},
		{
			headerLabel: "Gerente",
			selector: (row: Department) => row.manager?.name || "-",
		},
		{
			headerLabel: "Estado",
			selector: (row: Department) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: Department) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetDepartmentToEdit(row)}
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
				<ScreenTitle>Departamentos</ScreenTitle>
				<DepartmentForm
					departmentToEdit={departmentToEdit}
					isOpen={isOpen}
					onClose={() => {
						setDepartmentToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={departmentsData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default DepartmentsScreen;
