import React from "react";
import { useFetchDepreciations } from "../../api/depreciations/queries";
import AppModal from "../../components/ui/app-modal";
import type { FixedAsset } from "../../api/fixed-assets/types";
import AppTable from "../../components/ui/app-table";
import type { Depreciation } from "../../api/depreciations/types";
import { formatDate } from "date-fns";
import { parseDate } from "@internationalized/date";

type Props = {
	fixedAsset?: FixedAsset;
};
const DepreciationsDetails = ({ fixedAsset }: Props) => {
	const [isOpen, setIsOpen] = React.useState(false);
	const { data, isLoading } = useFetchDepreciations(
		{ fixedAssetId: fixedAsset?.id },
		{ enabled: isOpen && Boolean(fixedAsset) }
	);
	const columns = [
		{
			headerLabel: "Año / Mes de Proceso",
			selector: (row: Depreciation) => {
				return `${row.processYear} / ${row.processMonth
					.toString()
					.padStart(2, "0")}`;
			},
		},
		{
			headerLabel: "Fecha de Proceso",
			selector: (row: Depreciation) =>
				formatDate(parseDate(row.processDate).toDate("AST"), "P"),
		},
		{
			headerLabel: "Depreciación del Mes",
			selector: (row: Depreciation) =>
				row.depreciatedAmount.toLocaleString("es-DO", {
					style: "currency",
					currency: "DOP",
				}),
		},
		{
			headerLabel: "Depreciación Acumulada",
			selector: (row: Depreciation) =>
				row.accumulatedDepreciation.toLocaleString("es-DO", {
					style: "currency",
					currency: "DOP",
				}),
		},
		{
			headerLabel: "Valor Neto",
			selector: (row: Depreciation) => {
				const netValue = row.asset.purchaseValue - row.accumulatedDepreciation;
				return netValue.toLocaleString("es-DO", {
					style: "currency",
					currency: "DOP",
				});
			},
		},
	];

	return (
		<AppModal
			title="Detalles de Depreciaciones"
			size="5xl"
			Trigger={
				<span
					className="underline font-medium cursor-pointer"
					onClick={() => setIsOpen(true)}
					role="button"
				>
					{fixedAsset?.accumulatedDepreciation.toLocaleString("es-DO", {
						style: "currency",
						currency: "DOP",
					})}
				</span>
			}
			isOpen={isOpen}
			onOpenChange={setIsOpen}
		>
			<AppTable
				columns={columns}
				data={data?.data || []}
				isLoading={isLoading}
			/>
		</AppModal>
	);
};

export default DepreciationsDetails;
