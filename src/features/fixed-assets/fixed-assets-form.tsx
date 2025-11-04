import {
	Form,
	Button,
	Input,
	Select,
	SelectItem,
	DatePicker,
} from "@heroui/react";
import { RiAddCircleLine, RiCheckboxCircleLine } from "@remixicon/react";
import { useForm, type SubmitHandler } from "react-hook-form";
import AppModal from "../../components/ui/app-modal";
import { useEffect } from "react";
import type { FixedAsset } from "../../api/fixed-assets/types";
import {
	useAddFixedAsset,
	useUpdateFixedAsset,
} from "../../api/fixed-assets/mutations";
import { useFetchDepartments } from "../../api/departments/queries";
import { useFetchTypeOfAssets } from "../../api/type-of-assets/queries";
import { parseDate } from "@internationalized/date";
type Props = {
	fixedAssetToEdit?: FixedAsset | null;
	isOpen: boolean;
	onClose: () => void;
	onOpenChange: () => void;
};

type Inputs = Partial<FixedAsset>;
const FixedAssetForm = ({
	fixedAssetToEdit,
	isOpen,
	onClose,
	onOpenChange,
}: Props) => {
	const { register, handleSubmit, reset, setValue, watch } = useForm<Inputs>({
		defaultValues: {},
	});

	const { data: departmentsData, isFetching: isFetchingDepartments } =
		useFetchDepartments({
			enabled: isOpen,
		});

	const { data: typeOfAssetsData, isFetching: isFetchingTypeOfAssets } =
		useFetchTypeOfAssets({
			enabled: isOpen,
		});

	useEffect(() => {
		reset({
			description: fixedAssetToEdit?.description || "",
			department: fixedAssetToEdit?.department,
			typeOfAsset: fixedAssetToEdit?.typeOfAsset,
			typeOfAssetId:
				fixedAssetToEdit?.typeOfAsset?.id ||
				fixedAssetToEdit?.typeOfAssetId ||
				undefined,
			isActive:
				typeof fixedAssetToEdit?.isActive === "boolean"
					? fixedAssetToEdit?.isActive
					: true,
			purchaseDate: fixedAssetToEdit?.purchaseDate,
			purchaseValue: fixedAssetToEdit?.purchaseValue || 1,
			usefulLifeMonths: fixedAssetToEdit?.usefulLifeMonths || 1,
			departmentId:
				fixedAssetToEdit?.department?.id ||
				fixedAssetToEdit?.departmentId ||
				undefined,
		});
	}, [fixedAssetToEdit, isOpen, reset]);

	const isEditMode = Boolean(fixedAssetToEdit?.id);

	const { mutateAsync: onAddFixedAsset, isPending: isAdding } =
		useAddFixedAsset();

	const { mutateAsync: onUpdateFixedAsset, isPending: isUpdating } =
		useUpdateFixedAsset();

	const onCloseForm = () => {
		reset();
		onClose();
	};

	const onSubmit: SubmitHandler<Inputs> = async (data) => {
		await (isEditMode
			? onUpdateFixedAsset({
					fixedAssetId: fixedAssetToEdit!.id,
					...data,
			  })
			: onAddFixedAsset(data));
		onCloseForm();
	};

	return (
		<AppModal
			title={(isEditMode ? "Editar" : "Agregar") + " Activo Fijo"}
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

					<Select
						label="Departamento"
						labelPlacement="outside"
						placeholder="Seleccione un departamento"
						isLoading={isFetchingDepartments}
						{...register("departmentId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("departmentId")
								? new Set([watch("departmentId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const departmentId = [...value][0]?.toString();
							const department = departmentsData?.data.find(
								(dept) => dept.id === Number(departmentId)
							);
							if (!department) return;
							setValue("departmentId", Number(departmentId));
							setValue("department", department);
						}}
					>
						{
							departmentsData?.data.map((department) => (
								<SelectItem key={department.id}>
									{department.description}
								</SelectItem>
							)) as []
						}
					</Select>

					<Select
						label="Tipo de Activo"
						labelPlacement="outside"
						placeholder="Seleccione un tipo de activo"
						isLoading={isFetchingTypeOfAssets}
						{...register("typeOfAssetId", { required: true })}
						isRequired
						disallowEmptySelection
						selectedKeys={
							watch("typeOfAssetId")
								? new Set([watch("typeOfAssetId")!.toString()])
								: new Set()
						}
						onSelectionChange={(value) => {
							const typeOfAssetId = [...value][0]?.toString();
							const typeOfAsset = typeOfAssetsData?.data.find(
								(type) => type.id === Number(typeOfAssetId)
							);
							if (!typeOfAsset) return;
							setValue("typeOfAssetId", Number(typeOfAssetId));
							setValue("typeOfAsset", typeOfAsset);
						}}
					>
						{
							typeOfAssetsData?.data.map((type) => (
								<SelectItem key={type.id}>{type.description}</SelectItem>
							)) as []
						}
					</Select>
					<Input
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca el valor de compra";
							}
						}}
						{...register("purchaseValue", {
							required: !isEditMode,
							maxLength: 11,
							validate: (value) => /^\d+$/.test(value?.toString() || ""),
						})}
						label="Valor de compra"
						type="number"
						step={1}
						isRequired={!isEditMode}
						isReadOnly={isEditMode}
						labelPlacement="outside-top"
						min={1}
					/>
					<Input
						errorMessage={({ validationDetails }) => {
							if (validationDetails.valueMissing) {
								return "Por favor introduzca la vida útil en meses";
							}
						}}
						{...register("usefulLifeMonths", {
							required: !isEditMode,
							maxLength: 11,
							validate: (value) => /^\d+$/.test(value?.toString() || ""),
						})}
						label="Vida útil (meses)"
						type="number"
						step={1}
						isRequired={!isEditMode}
						isReadOnly={isEditMode}
						labelPlacement="outside-top"
						min={1}
					/>
					<DatePicker
						label="Fecha de Compra"
						labelPlacement="outside"
						defaultValue={
							fixedAssetToEdit?.purchaseDate
								? parseDate(fixedAssetToEdit.purchaseDate)
								: undefined
						}
						{...register("purchaseDate", { required: !isEditMode })}
						isRequired={!isEditMode}
						isReadOnly={isEditMode}
						onChange={(date) => {
							if (!date) return;
							setValue("purchaseDate", date?.toString());
						}}
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

export default FixedAssetForm;
