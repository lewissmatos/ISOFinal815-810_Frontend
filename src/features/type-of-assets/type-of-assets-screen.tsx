import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";
import AppTable from "../../components/ui/app-table";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import DeleteButton from "../../components/ui/delete-button";
import { useState } from "react";
import type { TypeOfAsset } from "../../api/type-of-assets/types";
import { useFetchTypeOfAssets } from "../../api/type-of-assets/queries";
import {
	useDeleteTypeOfAsset,
	useToggleTypeOfAssetStatus,
} from "../../api/type-of-assets/mutations";
import TypeOfAssetForm from "./type-of-asset-form";

const TypeOfAssetsScreen = () => {
	const { data: typeOfAssetsData, isFetching } = useFetchTypeOfAssets();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [typeOfAssetToEdit, setTypeOfAssetToEdit] =
		useState<TypeOfAsset | null>(null);

	const handleSetTypeOfAssetToEdit = (typeOfAsset: TypeOfAsset) => {
		setTypeOfAssetToEdit(typeOfAsset);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleTypeOfAssetStatus();

	const { mutateAsync: onDelete, isPending: isDeleting } =
		useDeleteTypeOfAsset();

	const columns = [
		{
			headerLabel: "Gerente",
			selector: (row: TypeOfAsset) => (
				<span className="capitalize font-semibold">{row.description}</span>
			),
		},
		{
			headerLabel: "Cuenta de Compra",
			selector: (row: TypeOfAsset) => row.purchaseAccount?.description,
		},
		{
			headerLabel: "Cuenta de Depreciación",
			selector: (row: TypeOfAsset) => row.depreciationAccount?.description,
		},
		{
			headerLabel: "Estado",
			selector: (row: TypeOfAsset) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: TypeOfAsset) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetTypeOfAssetToEdit(row)}
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
				<ScreenTitle>Tipos de Activos</ScreenTitle>
				<TypeOfAssetForm
					typeOfAssetToEdit={typeOfAssetToEdit}
					isOpen={isOpen}
					onClose={() => {
						setTypeOfAssetToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={typeOfAssetsData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default TypeOfAssetsScreen;
