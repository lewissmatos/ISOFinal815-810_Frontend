import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import CurrencyForm from "./currency-form";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import { useState } from "react";
import DeleteButton from "../../components/ui/delete-button";
import AppTable from "../../components/ui/app-table";
import type { Currency } from "../../api/currencies/types";
import { useFetchCurrencies } from "../../api/currencies/queries";
import {
	useDeleteCurrency,
	useToggleCurrenciesStatus,
} from "../../api/currencies/mutations";
import { formatCurrency } from "../../utils/ui.util";

const CurrenciesScreen = () => {
	const { data: currenciesData, isFetching } = useFetchCurrencies();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [currencyToEdit, setCurrencyToEdit] = useState<Currency | null>(null);

	const handleSetCurrencyToEdit = (currency: Currency) => {
		setCurrencyToEdit(currency);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleCurrenciesStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } = useDeleteCurrency();

	const columns = [
		{
			headerLabel: "id",
			selector: (row: Currency) => (
				<span className="font-semibold">{row?.id}</span>
			),
		},
		{
			headerLabel: "Descripción",
			selector: (row: Currency) => row?.description,
		},
		{
			headerLabel: "Taza de Cambio",
			selector: (row: Currency) => (
				<span className="font-semibold">
					{formatCurrency(row?.exchangeRate)}
				</span>
			),
		},
		{
			headerLabel: "Estado",
			selector: (row: Currency) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: Currency) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetCurrencyToEdit(row)}
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
				<ScreenTitle>Monedas</ScreenTitle>
				<CurrencyForm
					currencyToEdit={currencyToEdit}
					isOpen={isOpen}
					onClose={() => {
						setCurrencyToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={currenciesData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default CurrenciesScreen;
