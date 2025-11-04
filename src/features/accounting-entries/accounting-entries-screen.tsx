import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";
import AppTable from "../../components/ui/app-table";
import { useFetchAccountingEntries } from "../../api/accounting-entries/queries";
import type { AccountingEntry } from "../../api/accounting-entries/types";

const AccountingEntriesScreen = () => {
	const { data: accountingEntriesData, isFetching } =
		useFetchAccountingEntries();

	const columns = [
		{
			headerLabel: "Descripción",
			selector: (row: AccountingEntry) => (
				<span className="capitalize font-semibold">{row.description}</span>
			),
		},
		{
			headerLabel: "Cuenta",
			selector: (row: AccountingEntry) => row?.account?.description,
		},
		{
			headerLabel: "Cálculo de Depreciación",
			selector: (row: AccountingEntry) =>
				row.depreciationCalculation.depreciatedAmount.toLocaleString("es-DO", {
					style: "currency",
					currency: "DOP",
				}),
		},

		// {
		// 	headerLabel: "Vida Útil",
		// 	selector: (row: AccountingEntry) => {
		// 		const entryDate = row.entryDate
		// 			? parseDate(row.entryDate).toDate("AST")
		// 			: new Date();
		// 		const currentDate = new Date();

		// 		const monthsUsed =
		// 			differenceInMonths(currentDate, entryDate) > 0
		// 				? differenceInMonths(currentDate, entryDate)
		// 				: 0;

		// 		const remainingLife = row. - monthsUsed;

		// 		return (
		// 			<div className="flex flex-col gap-2">
		// 				<div>
		// 					<span className="font-semibold">Meses restantes: </span>{" "}
		// 					{remainingLife}/{row.usefulLifeMonths}
		// 				</div>
		// 				<div>
		// 					<span className="font-semibold">Fecha de compra: </span>
		// 					{row.purchaseDate
		// 						? formatDate(parseDate(row.purchaseDate).toDate("AST"), "P")
		// 						: "-"}
		// 				</div>
		// 			</div>
		// 		);
		// 	},
		// },

		{
			headerLabel: "Cuenta",
			selector: (row: AccountingEntry) => row.account?.description,
		},
	];

	return (
		<ScreenLayout>
			<div className="flex items-center w-full justify-between mb-4">
				<ScreenTitle>Asientos Contables</ScreenTitle>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={accountingEntriesData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default AccountingEntriesScreen;
