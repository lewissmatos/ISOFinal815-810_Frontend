import { useForm, type SubmitHandler } from "react-hook-form";
import type { AccountingEntry } from "../../api/accounting-entries/types";
import { Button, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { useFetchAccounts } from "../../api/accounts/queries";
import { useFetchAuxiliarySystems } from "../../api/auxiliary-systems/queries";
import { RiAddCircleLine } from "@remixicon/react";
import { useSaveAccountingEntry } from "../../api/accounting-entries/mutations";

type Inputs = Partial<AccountingEntry>;
const AccountingEntryForm = () => {
	const { register, handleSubmit, reset, watch, setValue } = useForm<Inputs>();

	const { data: accountsData, isFetching: isFetchingAccounts } =
		useFetchAccounts();
	const { data: auxiliarySystemsData, isFetching: isFetchingAuxiliarySystems } =
		useFetchAuxiliarySystems();

	const { mutateAsync: onSaveAccountingEntry, isPending: isSaving } =
		useSaveAccountingEntry();
	const handleSave: SubmitHandler<Inputs> = async (data) => {
		await onSaveAccountingEntry(data);
		reset();
	};
	return (
		<form
			className="flex flex-col w-full gap-4"
			onSubmit={handleSubmit(handleSave)}
		>
			<Textarea
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
			<div className="flex justify-between gap-4">
				<Select
					label="Cuenta Contable"
					labelPlacement="outside"
					placeholder="Seleccione una cuenta"
					isLoading={isFetchingAccounts}
					{...register("accountId", { required: true })}
					isRequired
					disallowEmptySelection
					selectedKeys={
						watch("accountId")
							? new Set([watch("accountId")!.toString()])
							: new Set()
					}
					onSelectionChange={(value) => {
						const accountId = [...value][0]?.toString();
						const account = accountsData?.data.find(
							(type) => type.id === Number(accountId)
						);
						if (!account) return;
						setValue("accountId", Number(accountId));
						setValue("account", account);
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
					{...register("auxiliaryId", { required: true })}
					isRequired
					disallowEmptySelection
					selectedKeys={
						watch("auxiliaryId")
							? new Set([watch("auxiliaryId")!.toString()])
							: new Set()
					}
					onSelectionChange={(value) => {
						const auxiliaryId = [...value][0]?.toString();
						const auxiliary = auxiliarySystemsData?.data.find(
							(type) => type.id === Number(auxiliaryId)
						);
						if (!auxiliary) return;
						setValue("auxiliaryId", Number(auxiliaryId));
						setValue("auxiliary", auxiliary);
					}}
				>
					{
						auxiliarySystemsData?.data.map((item) => (
							<SelectItem key={item.id}>{item.name}</SelectItem>
						)) as []
					}
				</Select>
			</div>
			<div className="flex justify-between gap-4">
				<Select
					label="Tipo de Movimiento"
					labelPlacement="outside"
					placeholder="Seleccione un tipo de movimiento"
					isLoading={isFetchingAccounts}
					{...register("movementType", { required: true })}
					isRequired
					disallowEmptySelection
					selectedKeys={
						watch("movementType")
							? new Set([watch("movementType")!.toString()])
							: new Set()
					}
					onSelectionChange={(value) => {
						const movementType = [...value][0]?.toString();

						if (!movementType) return;
						setValue("movementType", movementType as unknown as "CR" | "DB");
					}}
				>
					{
						["DB", "CR"]?.map((item) => (
							<SelectItem key={item}>{item}</SelectItem>
						)) as []
					}
				</Select>
				<Input
					isRequired
					errorMessage={({ validationDetails }) => {
						if (validationDetails.valueMissing) {
							return "Por favor introduzca el valor de Asiento";
						}
					}}
					{...register("amount", { required: true })}
					label="Valor de Asiento"
					type="number"
					min={1}
					labelPlacement="outside-top"
				/>
			</div>

			<div className="flex w-full justify-end">
				<Button
					type="submit"
					color="primary"
					endContent={<RiAddCircleLine size={16} />}
					isLoading={isSaving}
				>
					Guardar Asiento Contable
				</Button>
			</div>
		</form>
	);
};

export default AccountingEntryForm;
