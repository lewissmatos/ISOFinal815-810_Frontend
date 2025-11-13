import { Form, Button, Input, Select, SelectItem } from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import { useAddAccount, useUpdateAccount } from "../../api/accounts/mutations";
import type { Account } from "../../api/accounts/types";
import { useEffect } from "react";
import { useFetchAccountTypes } from "../../api/account-types/queries";
import { useFetchAccounts } from "../../api/accounts/queries";

type Props = {
	accountToEdit?: Account | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<Account>;
const AccountForm = ({
	accountToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, watch, setValue } = useForm<Inputs>({
		defaultValues: { description: "" },
	});

	const { data: accountTypesData, isFetching: isFetchingAccountTypes } =
		useFetchAccountTypes();

	const { data: accountsData, isFetching: isFetchingAccounts } =
		useFetchAccounts();

	useEffect(() => {
		reset({
			description: accountToEdit?.description || "",
			allowsMovement: accountToEdit?.allowsMovement || "N",
			balance: accountToEdit?.balance || 0,
			level: accountToEdit?.level || 1,
			parentAccount: accountToEdit?.parentAccount || undefined,
			parentAccountId: accountToEdit?.parentAccountId || undefined,
			accountTypeId:
				accountToEdit?.accountType?.id ||
				accountToEdit?.accountTypeId ||
				undefined,
			accountType: accountToEdit?.accountType || undefined,
		});
	}, [accountToEdit, isOpen, reset]);

	const isEditMode = Boolean(accountToEdit?.id);

	const { mutateAsync: onAddAccount, isPending: isAdding } = useAddAccount();

	const { mutateAsync: onUpdateAccount, isPending: isUpdating } =
		useUpdateAccount();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateAccount({
					accountId: accountToEdit!.id,
					...data,
			  })
			: onAddAccount(data));
		onCloseForm();
	};
	return (
		<AppModal
			title={(isEditMode ? "Editar" : "Agregar") + " Cuenta Contable"}
			TriggerIcon={RiAddCircleLine}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			onClose={onCloseForm}
		>
			<Form
				className="w-full justify-center items-center py-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-4 w-full">
					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la descripción";
							}
						}}
						{...register("description", { required: true })}
						label="Descripción"
						labelPlacement="outside-top"
					/>

					<Input
						isRequired
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la descripción";
							}
						}}
						{...register("balance", { required: true })}
						label="Balance"
						type="number"
						min={1}
						labelPlacement="outside-top"
					/>

					<Select
						label="Tipo de Cuenta"
						labelPlacement="outside"
						placeholder="Seleccione un tipo de cuenta"
						isLoading={isFetchingAccountTypes}
						{...register("accountTypeId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("accountTypeId")
								? new Set([watch("accountTypeId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const accountTypeId = [...value][0]?.toString();
							const accountType = accountTypesData?.data.find(
								(type) => type.id === Number(accountTypeId)
							);
							if (!accountType) return;
							setValue("accountTypeId", Number(accountTypeId));
							setValue("accountType", accountType);
						}}
					>
						{
							accountTypesData?.data.map((type) => (
								<SelectItem key={type.id}>{type.description}</SelectItem>
							)) as []
						}
					</Select>
					<Select
						label="Cuenta Mayor"
						labelPlacement="outside"
						placeholder="Seleccione una cuenta mayor"
						isLoading={isFetchingAccounts}
						{...register("parentAccountId")}
						disallowEmptySelection
						selectedKeys={
							watch("parentAccountId")
								? new Set([watch("parentAccountId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const parentAccountId = [...value][0]?.toString();
							const parentAccount = accountsData?.data.find(
								(type) => type.id === Number(parentAccountId)
							);
							if (!parentAccount) return;
							setValue("parentAccountId", Number(parentAccountId));
							setValue("parentAccount", parentAccount);
						}}
					>
						{
							accountsData?.data
								.filter((account) => {
									if (!isEditMode) return true;
									return account.id !== accountToEdit?.id;
								})
								.map((type) => (
									<SelectItem key={type.id}>{type.description}</SelectItem>
								)) as []
						}
					</Select>
					<Select
						label="Nivel"
						labelPlacement="outside"
						placeholder="Seleccione un nivel"
						isLoading={isFetchingAccountTypes}
						{...register("level", { required: true })}
						isRequired
						disallowEmptySelection
						onSelectionChange={(value) => {
							const level = [...value][0]?.toString();
							if (!level) return;
							setValue("level", Number(level));
						}}
					>
						{
							[1, 2, 3].map((level) => (
								<SelectItem key={level}>{level}</SelectItem>
							)) as []
						}
					</Select>
					<Select
						label="Permite Movimientos"
						placeholder="Selecciona una opción"
						labelPlacement="outside"
						isLoading={isFetchingAccountTypes}
						{...register("allowsMovement", { required: true })}
						isRequired
						disallowEmptySelection
						onSelectionChange={(value) => {
							const allowsMovement = [...value][0]?.toString();
							if (!allowsMovement) return;
							setValue(
								"allowsMovement",
								allowsMovement as unknown as "N" | "S"
							);
						}}
					>
						{
							["N", "S"].map((level) => (
								<SelectItem key={level}>{level}</SelectItem>
							)) as []
						}
					</Select>
					<div className="flex justify-end">
						<Button
							type="submit"
							color="primary"
							isLoading={isAdding || isUpdating}
							endContent={<RiCheckboxCircleLine size={18} />}
						>
							{(isEditMode ? "Actualizar" : "Agregar") + " Departamento"}
						</Button>
					</div>
				</div>
			</Form>
		</AppModal>
	);
};

export default AccountForm;
