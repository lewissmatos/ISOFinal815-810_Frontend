import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import CurrencyForm from "./currency-form";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
	RiRefreshLine,
} from "@remixicon/react";
import { useState } from "react";
import DeleteButton from "../../components/ui/delete-button";
import AppTable from "../../components/ui/app-table";
import type { Currency } from "../../api/currencies/types";
import {
	useFetchCurrencies,
	useSyncCurrencies,
	useSyncCurrency,
} from "../../api/currencies/queries";
import {
	useDeleteCurrency,
	useToggleCurrenciesStatus,
} from "../../api/currencies/mutations";
import { formatCurrency } from "../../utils/ui.util";

const CurrenciesScreen = () => {
	const {
		data: currenciesData,
		isLoading,
		refetch: refetchCurrencies,
	} = useFetchCurrencies();

	const { mutateAsync: onSyncCurrencies, isPending: isSyncing } =
		useSyncCurrencies();

	const { mutateAsync: onSyncCurrency, isPending: isSyncingSingle } =
		useSyncCurrency();

	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [currencyToEdit, setCurrencyToEdit] = useState<Currency | null>(null);

	const handleSetCurrencyToEdit = (currency: Currency) => {
		setCurrencyToEdit(currency);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleCurrenciesStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } = useDeleteCurrency();

	const handleSyncCurrencies = async () => {
		await onSyncCurrencies(undefined, { onSuccess: () => refetchCurrencies() });
	};

	const handleSyncCurrency = async (code: string) => {
		await onSyncCurrency(code, { onSuccess: () => refetchCurrencies() });
	};

	const columns = [
		{
			headerLabel: "Código",
			selector: (row: Currency) => (
				<span className="font-semibold">{row?.ISOCode}</span>
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
						color="primary"
						isDisabled={isSyncingSingle}
						onPress={() => handleSyncCurrency(row.ISOCode)}
					>
						<RiRefreshLine size={18} />
					</Button>
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
						isLoading={isToggling || isLoading}
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
						isLoading={isDeleting || isLoading}
					/>
				</div>
			),
		},
	];

	return (
		<ScreenLayout>
			<div className="flex items-center w-full justify-between mb-4">
				<ScreenTitle>Monedas</ScreenTitle>
				<div className="flex items-center justify-between gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						color="primary"
						isLoading={isSyncing}
						onPress={handleSyncCurrencies}
					>
						<RiRefreshLine />
					</Button>
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
			</div>
			<AppTable
				columns={columns}
				isLoading={isLoading}
				data={currenciesData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default CurrenciesScreen;
