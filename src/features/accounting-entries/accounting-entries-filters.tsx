import { isAfter } from "date-fns";
import type { FetchAccountingEntriesFilter } from "../../api/accounting-entries/types";
import { useFetchAccounts } from "../../api/accounts/queries";
import { useFetchAuxiliarySystems } from "../../api/auxiliary-systems/queries";
import { DateRangePicker, Select, SelectItem } from "@heroui/react";

type Props = {
	filters: FetchAccountingEntriesFilter;
	onUpdateFilters: (update: {
		name: keyof FetchAccountingEntriesFilter;
		value: string | number | undefined;
	}) => void;
};
const AccountingEntriesFilters = ({ filters, onUpdateFilters }: Props) => {
	const { data: accountsData, isFetching: isFetchingAccounts } =
		useFetchAccounts();

	const { data: auxiliarySystemsData, isFetching: isFetchingAuxiliarySystems } =
		useFetchAuxiliarySystems();

	return (
		<div className="flex gap-4 justify-start">
			<Select
				label="Cuenta Contable"
				labelPlacement="outside"
				placeholder="Seleccione una cuenta"
				isLoading={isFetchingAccounts}
				selectedKeys={
					filters.accountId
						? new Set([filters.accountId.toString()])
						: new Set()
				}
				onSelectionChange={(value) => {
					const accountId = [...value][0]?.toString();
					onUpdateFilters({
						name: "accountId",
						value: accountId ? Number(accountId) : undefined,
					});
				}}
			>
				{
					accountsData?.data.map((item) => (
						<SelectItem
							key={item.id}
						>{`${item.id} - ${item.description}`}</SelectItem>
					)) as []
				}
			</Select>
			<Select
				label="Sistema Auxiliar"
				labelPlacement="outside"
				placeholder="Seleccione un sistema auxiliar"
				isLoading={isFetchingAuxiliarySystems}
				selectedKeys={
					filters.auxiliaryId
						? new Set([filters.auxiliaryId.toString()])
						: new Set()
				}
				onSelectionChange={(value) => {
					const auxiliaryId = [...value][0]?.toString();
					onUpdateFilters({
						name: "auxiliaryId",
						value: auxiliaryId ? Number(auxiliaryId) : undefined,
					});
				}}
			>
				{
					auxiliarySystemsData?.data.map((item) => (
						<SelectItem key={item.id}>{`${item.id} - ${item.name}`}</SelectItem>
					)) as []
				}
			</Select>
			<Select
				label="Tipo de Movimiento"
				labelPlacement="outside"
				placeholder="Seleccione un tipo de movimiento"
				isLoading={isFetchingAccounts}
				isRequired
				disallowEmptySelection
				selectedKeys={
					filters?.movementType ? new Set([filters.movementType]) : new Set()
				}
				onSelectionChange={(value) => {
					const movementType = [...value][0]?.toString();
					onUpdateFilters({
						name: "movementType",
						value: movementType,
					});
				}}
			>
				{
					["DB", "CR"]?.map((item) => (
						<SelectItem key={item}>{item}</SelectItem>
					)) as []
				}
			</Select>
			<DateRangePicker
				label="Rango de Fechas"
				onChange={(dates) => {
					if (!dates) {
						onUpdateFilters({
							name: "startDate",
							value: undefined,
						});
						onUpdateFilters({
							name: "endDate",
							value: undefined,
						});
						return;
					}
					const { start, end } = dates;

					if (isAfter(start.toString(), end.toString())) {
						return;
					}
					onUpdateFilters({
						name: "startDate",
						value: start.toString(),
					});
					onUpdateFilters({
						name: "endDate",
						value: end.toString(),
					});
				}}
				labelPlacement="outside"
			/>
		</div>
	);
};

export default AccountingEntriesFilters;
