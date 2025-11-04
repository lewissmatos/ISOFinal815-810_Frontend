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
			purchaseAccount: typeOfAssetToEdit?.purchaseAccount,
			purchaseAccountId:
				typeOfAssetToEdit?.purchaseAccount?.id ||
				typeOfAssetToEdit?.purchaseAccountId,
			depreciationAccountId:
				typeOfAssetToEdit?.depreciationAccount?.id ||
				typeOfAssetToEdit?.depreciationAccountId,
		});
	}, [typeOfAssetToEdit, isOpen, reset]);

	const isEditMode = Boolean(typeOfAssetToEdit?.id);

	const { mutateAsync: onAddTypeOfAsset, isPending: isAdding } =
		useAddTypeOfAsset();

	const { mutateAsync: onUpdateTypeOfAsset, isPending: isUpdating } =
		useUpdateTypeOfAsset();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateTypeOfAsset({
					typeOfAssetId: typeOfAssetToEdit!.id,
					...data,
			  })
			: onAddTypeOfAsset(data));
		onCloseForm();
	};

	return (
		<AppModal
			title={(isEditMode ? "Editar" : "Agregar") + " Tipo de Activo"}
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
						label="Descripción"
						labelPlacement="outside-top"
					/>

					<AccountSelector
						isFetchingAccounts={isFetchingAccounts}
						accountsData={accountsData}
						register={register}
						watch={watch}
						setValue={setValue}
						property="purchaseAccountId"
					/>

					<AccountSelector
						isFetchingAccounts={isFetchingAccounts}
						accountsData={accountsData}
						register={register}
						watch={watch}
						setValue={setValue}
						property="depreciationAccountId"
					/>

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

type AccountSelectorProps = {
	isFetchingAccounts: boolean;
	accountsData:
		| {
				data: {
					id: number;
					description: string;
				}[];
		  }
		| undefined;
	register: ReturnType<typeof useForm>["register"];
	watch: ReturnType<typeof useForm>["watch"];
	setValue: ReturnType<typeof useForm>["setValue"];
	property: "purchaseAccountId" | "depreciationAccountId";
};
const AccountSelector = ({
	isFetchingAccounts,
	accountsData,
	register,
	watch,
	setValue,
	property,
}: AccountSelectorProps) => {
	return (
		<Select
			label={
				"Cuenta de " +
				(property === "purchaseAccountId" ? "Compra" : "Depreciación")
			}
			labelPlacement="outside"
			placeholder="Seleccione una cuenta"
			isLoading={isFetchingAccounts}
			{...register(property, { required: true })}
			isRequired
			disallowEmptySelection
			selectedKeys={
				watch(property) ? new Set([watch(property)!.toString()]) : new Set()
			}
			onSelectionChange={(value) => {
				const accountId = [...value][0]?.toString();
				const account = accountsData?.data.find(
					(acc) => acc.id === Number(accountId)
				);
				if (!account) return;
				setValue(property, Number(accountId));
				setValue(property.replace("Id", ""), account);
			}}
		>
			{
				accountsData?.data.map((account) => (
					<SelectItem key={account.id}>
						{`${account.id} - ${account.description}`}
					</SelectItem>
				)) as []
			}
		</Select>
	);
};

export default TypeOfAssetForm;
