import {
	Button,
	Popover,
	PopoverContent,
	PopoverTrigger,
	useDisclosure,
} from "@heroui/react";
import { RiDeleteBinLine } from "@remixicon/react";

type Props = {
	onConfirm: () => void;
	isLoading?: boolean;
};
const DeleteButton = ({ onConfirm, isLoading }: Props) => {
	const { isOpen, onOpenChange, onClose } = useDisclosure();
	return (
		<Popover size="sm" isOpen={isOpen} onOpenChange={onOpenChange}>
			<PopoverTrigger>
				<Button isIconOnly size="sm" variant="light" isLoading={isLoading}>
					<RiDeleteBinLine size={18} className="text-danger-500" />
				</Button>
			</PopoverTrigger>
			<PopoverContent>
				<div className="w-full justify-between gap-2 flex flex-col p-2">
					<p className="font-medium text-medium">
						Seguro que deseas eliminar este elemento?
					</p>
					<div className="flex justify-end gap-2">
						<Button
							variant="light"
							onPress={() => {
								onConfirm();
								onClose();
							}}
							isLoading={isLoading}
						>
							Sí, eliminar
						</Button>
						<Button
							color="danger"
							variant="solid"
							onPress={() => {
								onClose();
							}}
						>
							Cancelar
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	);
};

export default DeleteButton;
