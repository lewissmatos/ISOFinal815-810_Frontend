import { Button, useDisclosure } from "@heroui/react";
import { ScreenLayout } from "../../components/ui/screen-layout";
import ScreenTitle from "../../components/ui/screen-title";

import {
	RiCheckboxCircleLine,
	RiEditLine,
	RiForbidLine,
} from "@remixicon/react";
import { useState } from "react";
import DeleteButton from "../../components/ui/delete-button";
import AppTable from "../../components/ui/app-table";
import { useFetchAccountTypes } from "../../api/account-types/queries";
import type { AccountType } from "../../api/account-types/types";
import {
	useDeleteAccountType,
	useToggleAccountTypeTypesStatus,
} from "../../api/account-types/mutations";
import AccountTypeForm from "./account-type-form";

const AccountTypesScreen = () => {
	const { data: accountTypesData, isFetching } = useFetchAccountTypes();
	const { isOpen, onOpenChange, onClose } = useDisclosure();

	const [accountTypeToEdit, setAccountTypeToEdit] =
		useState<AccountType | null>(null);

	const handleSetAccountTypeToEdit = (accountType: AccountType) => {
		setAccountTypeToEdit(accountType);
		onOpenChange();
	};

	const { mutateAsync: onToggleStatus, isPending: isToggling } =
		useToggleAccountTypeTypesStatus();
	const { mutateAsync: onDelete, isPending: isDeleting } =
		useDeleteAccountType();

	const columns = [
		{
			headerLabel: "Descripción",
			selector: (row: AccountType) => (
				<span className="font-semibold">{row?.description}</span>
			),
		},

		{
			headerLabel: "Estado",
			selector: (row: AccountType) => (row.isActive ? "Activo" : "Inactivo"),
		},

		{
			headerLabel: "Estado",
			selector: (row: AccountType) => (row.isActive ? "Activo" : "Inactivo"),
		},
		{
			headerLabel: "Acciones",
			selector: (row: AccountType) => (
				<div className="flex gap-2">
					<Button
						isIconOnly
						size="sm"
						variant="light"
						onPress={() => handleSetAccountTypeToEdit(row)}
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
				<ScreenTitle>Tipos de Cuenta</ScreenTitle>
				<AccountTypeForm
					accountTypeToEdit={accountTypeToEdit}
					isOpen={isOpen}
					onClose={() => {
						setAccountTypeToEdit(null);
						onClose();
					}}
					onOpenChange={onOpenChange}
				/>
			</div>
			<AppTable
				columns={columns}
				isLoading={isFetching}
				data={accountTypesData?.data || []}
			/>
		</ScreenLayout>
	);
};

export default AccountTypesScreen;
