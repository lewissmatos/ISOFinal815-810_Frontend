import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import AuxiliarySystemForm from "./auxiliary-system-form";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import { useState } from "react";
import DeleteButton from "../../components/ui/delete-button";
import AppTable from "../../components/ui/app-table";
import { useFetchAuxiliarySystems } from "../../api/auxiliary-systems/queries";
import type { AuxiliarySystem } from "../../api/auxiliary-systems/types";
import {
	useDeleteAuxiliarySystem,
	useToggleAuxiliarySystemsStatus,
} from "../../api/auxiliary-systems/mutations";

const AuxiliarySystemsScreen = () => {
	const { data: auxiliarySystemsData, isFetching } = useFetchAuxiliarySystems();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [auxiliarySystemToEdit, setAuxiliarySystemToEdit] =
		useState<AuxiliarySystem | null>(null);

	const handleSetAuxiliarySystemToEdit = (auxiliarySystem: AuxiliarySystem) => {
		setAuxiliarySystemToEdit(auxiliarySystem);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleAuxiliarySystemsStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } =
		useDeleteAuxiliarySystem();

	const columns = [
		{
			headerLabel: "Nombre",
			selector: (row: AuxiliarySystem) => (
				<span className="font-semibold">{row?.name}</span>
			),
		},
		{
			headerLabel: "Estado",
			selector: (row: AuxiliarySystem) =>
				row.isActive ? "Activo" : "Inactivo",
		},
		{
			headerLabel: "Acciones",
			selector: (row: AuxiliarySystem) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetAuxiliarySystemToEdit(row)}
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
				<ScreenTitle>Sistemas Auxiliares</ScreenTitle>
				<AuxiliarySystemForm
					auxiliarySystemToEdit={auxiliarySystemToEdit}
					isOpen={isOpen}
					onClose={() => {
						setAuxiliarySystemToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={auxiliarySystemsData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default AuxiliarySystemsScreen;
