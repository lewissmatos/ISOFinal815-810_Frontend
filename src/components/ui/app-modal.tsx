import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@heroui/react";
import type { RemixiconComponentType } from "@remixicon/react";
import React from "react";

type Props = {
	title: string;
	children: React.ReactNode;
	TriggerIcon: RemixiconComponentType;
	Trigger?: React.ReactNode;
	isOpen?: boolean;
	size?: "sm" | "md" | "lg" | "xl";
	onOpenChange: (isOpen: boolean) => void;
	onClose?: () => void;
};
const AppModal = ({
	title,
	children,
	TriggerIcon,
	Trigger,
	isOpen,
	size = "md",
	onOpenChange,
	onClose,
}: Props) => {
	return (
		<>
			{!Trigger ? (
				<Button
					onPress={() => onOpenChange(true)}
					isIconOnly
					variant="light"
					color="primary"
				>
					{<TriggerIcon />}
				</Button>
			) : (
				Trigger
			)}
			<Modal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				size={size}
				onClose={onClose}
			>
				<ModalContent>
					{() => (
						<>
							<ModalHeader>{title}</ModalHeader>
							<ModalBody>{children}</ModalBody>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	);
};

export default AppModal;
