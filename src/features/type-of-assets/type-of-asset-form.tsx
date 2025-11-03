import { Form, Button, Input, Select, SelectItem } from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import { useEffect } from "react";
import type { TypeOfAsset } from "../../api/type-of-assets/types";
import {
	useAddTypeOfAsset,
	useUpdateTypeOfAsset,
} from "../../api/type-of-assets/mutations";
import { useFetchAccounts } from "../../api/accounts/queries";
type Props = {
	typeOfAssetToEdit?: TypeOfAsset | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<TypeOfAsset>;
const TypeOfAssetForm = ({
	typeOfAssetToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, setValue, watch } = useForm<Inputs>({
		defaultValues: {},
	});

	const { data: accountsData, isFetching: isFetchingAccounts } =
		useFetchAccounts({
			enabled: isOpen,
		});

	useEffect(() => {
		reset({
			description: typeOfAssetToEdit?.description || "",
			depreciationAccount: typeOfAssetToEdit?.depreciationAccount,
			buyingAccount: typeOfAssetToEdit?.buyingAccount,
			buyingAccountId:
				typeOfAssetToEdit?.buyingAccount?.id ||
				typeOfAssetToEdit?.buyingAccountId,
			depreciationAccountId:
				typeOfAssetToEdit?.depreciationAccount?.id ||
				typeOfAssetToEdit?.depreciationAccountId,
		});
	}, [typeOfAssetToEdit, isOpen, reset]);

	const idEditMode = Boolean(typeOfAssetToEdit?.id);

	const { mutateAsync: onAddTypeOfAsset, isPending: isAdding } =
		useAddTypeOfAsset();

	const { mutateAsync: onUpdateTypeOfAsset, isPending: isUpdating } =
		useUpdateTypeOfAsset();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (idEditMode
			? onUpdateTypeOfAsset({
					typeOfAssetId: typeOfAssetToEdit!.id,
					...data,
			  })
			: onAddTypeOfAsset(data));
		onCloseForm();
	};

	return (
		<AppModal
			title={(idEditMode ? "Editar" : "Agregar") + " Tipo de Activo"}
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
								return "Por favor introduzca el nombre";
							}
						}}
						{...register("description", { required: true })}
						label="Nombre"
						labelPlacement="outside-top"
					/>

					<Select
						label="Cuenta de Compra"
						labelPlacement="outside"
						placeholder="Seleccione una cuenta"
						isLoading={isFetchingAccounts}
						{...register("buyingAccountId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("buyingAccountId")
								? new Set([watch("buyingAccountId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const accountId = [...value][0].toString();
							const account = accountsData?.data.find(
								(acc) => acc.id === Number(accountId)
							);
							if (!account) return;
							setValue("buyingAccountId", Number(accountId));
							setValue("buyingAccount", account);
						}}
					>
						{
							accountsData?.data.map((account) => (
								<SelectItem key={account.id}>{account.description}</SelectItem>
							)) as []
						}
					</Select>

					<Select
						label="Cuenta de Depreciación"
						labelPlacement="outside"
						placeholder="Seleccione una cuenta"
						isLoading={isFetchingAccounts}
						{...register("depreciationAccountId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("depreciationAccountId")
								? new Set([watch("depreciationAccountId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const accountId = [...value][0].toString();
							const account = accountsData?.data.find(
								(acc) => acc.id === Number(accountId)
							);
							if (!account) return;
							setValue("depreciationAccountId", Number(accountId));
							setValue("depreciationAccount", account);
						}}
					>
						{
							accountsData?.data.map((account) => (
								<SelectItem key={account.id}>{account.description}</SelectItem>
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
							{(idEditMode ? "Actualizar" : "Agregar") + " Departamento"}
						</Button>
					</div>
				</div>
			</Form>
		</AppModal>
	);
};

export default TypeOfAssetForm;
