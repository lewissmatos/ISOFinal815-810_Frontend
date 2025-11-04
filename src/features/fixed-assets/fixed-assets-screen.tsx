import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";
import AppTable from "../../components/ui/app-table";
import {
	RiCalculatorLine,
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import DeleteButton from "../../components/ui/delete-button";
import { useState } from "react";
import FixedAssetForm from "./fixed-assets-form";
import type { FixedAsset } from "../../api/fixed-assets/types";
import {
	useDeleteFixedAsset,
	useToggleFixedAssetStatus,
} from "../../api/fixed-assets/mutations";
import { useFetchFixedAssets } from "../../api/fixed-assets/queries";
import { differenceInMonths, formatDate } from "date-fns";
import { parseDate } from "@internationalized/date";
import { useExecuteDepreciationProcess } from "../../api/accounting-entries/mutations";
import DepreciationsDetails from "./depreciations-details";

const FixedAssetsScreen = () => {
	const { data: fixedAssetsData, isFetching } = useFetchFixedAssets();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [fixedAssetToEdit, setFixedAssetToEdit] = useState<FixedAsset | null>(
		null
	);

	const handleSetFixedAssetToEdit = (fixedAsset: FixedAsset) => {
		setFixedAssetToEdit(fixedAsset);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleFixedAssetStatus();

	const { mutateAsync: onDelete, isPending: isDeleting } =
		useDeleteFixedAsset();

	const {
		mutateAsync: onExecuteDepreciation,
		isPending: isExecutingDepreciation,
	} = useExecuteDepreciationProcess();

	const columns = [
		{
			headerLabel: "Descripción",
			selector: (row: FixedAsset) => (
				<span className="capitalize font-semibold">{row.description}</span>
			),
		},
		{
			headerLabel: "Departamento",
			selector: (row: FixedAsset) => row?.department?.description,
		},
		{
			headerLabel: "Tipo de Activo",
			selector: (row: FixedAsset) => row.typeOfAsset?.description,
		},
		{
			headerLabel: "Valor de Compra",
			selector: (row: FixedAsset) =>
				row.purchaseValue.toLocaleString("es-DO", {
					style: "currency",
					currency: "DOP",
				}),
		},

		{
			headerLabel: "Vida Útil",
			selector: (row: FixedAsset) => {
				const purchaseDate = row.purchaseDate
					? parseDate(row.purchaseDate).toDate("AST")
					: new Date();
				const currentDate = new Date();

				const monthsUsed =
					differenceInMonths(currentDate, purchaseDate) > 0
						? differenceInMonths(currentDate, purchaseDate)
						: 0;

				const remainingLife = row.usefulLifeMonths - monthsUsed;

				return (
					<div className="flex flex-col gap-2">
						<div>
							<span className="font-semibold">Meses restantes: </span>{" "}
							{remainingLife}/{row.usefulLifeMonths}
						</div>
						<div>
							<span className="font-semibold">Fecha de compra: </span>
							{row.purchaseDate
								? formatDate(parseDate(row.purchaseDate).toDate("AST"), "P")
								: "-"}
						</div>
					</div>
				);
			},
		},

		{
			headerLabel: "Cuentas",
			selector: (row: FixedAsset) => (
				<div className="flex flex-col gap-2">
					<div>
						<span className="font-semibold">Compra: </span>{" "}
						{row.typeOfAsset?.purchaseAccount?.description}
					</div>
					<div>
						<span className="font-semibold">Depreciación: </span>{" "}
						{row.typeOfAsset?.depreciationAccount?.description}
					</div>
				</div>
			),
		},
		{
			headerLabel: "Depreciación Acumulada",
			selector: (row: FixedAsset) => <DepreciationsDetails fixedAsset={row} />,
		},
		{
			headerLabel: "Estado",
			selector: (row: FixedAsset) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: FixedAsset) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetFixedAssetToEdit(row)}
					>
						<RiEditLine size={18} />
					</Button>
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => onExecuteDepreciation(row?.id)}
						isLoading={isExecutingDepreciation || isFetching}
					>
						<RiCalculatorLine size={18} />
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
				<ScreenTitle>Activos Fijos</ScreenTitle>
				<FixedAssetForm
					fixedAssetToEdit={fixedAssetToEdit}
					isOpen={isOpen}
					onClose={() => {
						setFixedAssetToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={fixedAssetsData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default FixedAssetsScreen;
