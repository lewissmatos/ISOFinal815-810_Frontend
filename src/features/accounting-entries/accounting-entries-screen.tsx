import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";
import AppTable from "../../components/ui/app-table";
import { useFetchAccountingEntries } from "../../api/accounting-entries/queries";
import type {
	AccountingEntry,
	FetchAccountingEntriesFilter,
} from "../../api/accounting-entries/types";
import { formatDate } from "date-fns";
import { parseDate } from "@internationalized/date";
import { formatCurrency } from "../../utils/ui.util";
import AccountingEntryForm from "./accounting-entry-form";
import { Accordion, AccordionItem } from "@heroui/react";
import { useState } from "react";
import AccountingEntriesFilters from "./accounting-entries-filters";

const AccountingEntriesScreen = () => {
	const [filters, setFilters] = useState<FetchAccountingEntriesFilter>({
		accountId: undefined,
		auxiliaryId: undefined,
		description: undefined,
		movementType: undefined,
		startDate: undefined,
		endDate: undefined,
	});

	const handleUpdateFilters = ({
		name,
		value,
	}: {
		name: keyof FetchAccountingEntriesFilter;
		value: string | number | undefined;
	}) => {
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const { data: accountingEntriesData, isFetching } =
		useFetchAccountingEntries(filters);

	const columns = [
		{
			headerLabel: "No. Asiento",
			selector: (row: AccountingEntry) => (
				<span className="capitalize font-semibold">{`#${row.id}`}</span>
			),
		},
		{
			headerLabel: "Descripción",
			selector: (row: AccountingEntry) => row.description,
		},
		{
			headerLabel: "Sistema Auxiliar",
			selector: (row: AccountingEntry) => row?.auxiliary?.name,
		},
		{
			headerLabel: "Cuenta",
			selector: (row: AccountingEntry) => row?.account?.description,
		},
		{
			headerLabel: "Tipo de Movimiento",
			selector: (row: AccountingEntry) => row.movementType,
		},
		{
			headerLabel: "Fecha de Asiento",
			selector: (row: AccountingEntry) =>
				formatDate(parseDate(row.entryDate).toDate("AST"), "P"),
		},
		{
			headerLabel: "Monto",
			selector: (row: AccountingEntry) => formatCurrency(row.amount),
		},
	];

	return (
		<ScreenLayout>
			<div className="flex items-center w-full justify-between mb-4">
				<ScreenTitle>Registrar Asiento Contable</ScreenTitle>
			</div>
			<div className="flex w-full flex-col gap-4 h-full">
				<AccountingEntryForm />
				<h2 className="text-lg font-semibold">Asientos Contables</h2>
				<AccountingEntriesFilters
					filters={filters}
					onUpdateFilters={handleUpdateFilters}
				/>
				<Accordion variant="splitted" defaultExpandedKeys={"all"}>
					<AccordionItem title="Lista de Asientos Contables">
						<AppTable
							columns={columns}
							isLoading={isFetching}
							data={accountingEntriesData?.data || []}
						/>
					</AccordionItem>
				</Accordion>
			</div>
		</ScreenLayout>
	);
};

export default AccountingEntriesScreen;
