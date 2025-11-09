import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import AccountForm from "./account-form";
import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import { useState } from "react";
import DeleteButton from "../../components/ui/delete-button";
import AppTable from "../../components/ui/app-table";
import { useFetchAccounts } from "../../api/accounts/queries";
import type { Account } from "../../api/accounts/types";
import {
	useDeleteAccount,
	useToggleAccountsStatus,
} from "../../api/accounts/mutations";
import { formatCurrency } from "../../utils/ui.util";

const AccountsScreen = () => {
	const { data: accountsData, isFetching } = useFetchAccounts();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [accountToEdit, setAccountToEdit] = useState<Account | null>(null);

	const handleSetAccountToEdit = (account: Account) => {
		setAccountToEdit(account);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleAccountsStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } = useDeleteAccount();

	const columns = [
		{
			headerLabel: "id",
			selector: (row: Account) => (
				<span className="font-semibold">{row?.id}</span>
			),
		},
		{
			headerLabel: "Descripción",
			selector: (row: Account) => row?.description,
		},
		{
			headerLabel: "Permite Transacciones",
			selector: (row: Account) => row.allowsMovement,
		},
		{
			headerLabel: "Tipo de Cuenta",
			selector: (row: Account) =>
				`${row.accountType?.description} (${row.accountType?.origin})`,
		},
		{
			headerLabel: "Nivel",
			selector: (row: Account) => row.level,
		},
		{
			headerLabel: "Cuenta Mayor",
			selector: (row: Account) => row.parentAccount?.description || "-",
		},
		{
			headerLabel: "Balance",
			selector: (row: Account) => formatCurrency(row.balance),
		},
		{
			headerLabel: "Estado",
			selector: (row: Account) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: Account) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetAccountToEdit(row)}
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
				<ScreenTitle>Cuentas Contables</ScreenTitle>
				<AccountForm
					accountToEdit={accountToEdit}
					isOpen={isOpen}
					onClose={() => {
						setAccountToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={accountsData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default AccountsScreen;
