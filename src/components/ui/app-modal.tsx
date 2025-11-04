import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
} from "@heroui/react";
import type { RemixiconComponentType } from "@remixicon/react";

type Props = {
	title: string;
	children: React.ReactNode;

	isOpen?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
	onOpenChange: (isOpen: boolean) => void;
	onClose?: () => void;
} & (
	| {
			TriggerIcon: RemixiconComponentType;
			Trigger?: never;
	  }
	| {
			Trigger: React.ReactNode;
			TriggerIcon?: never;
	  }
);
const AppModal = (props: Props) => {
	const { title, children, isOpen, size = "md", onOpenChange, onClose } = props;

	const renderTrigger = () => {
		if ("Trigger" in props) {
			return props.Trigger;
		}

		return (
			<Button
				onPress={() => onOpenChange(true)}
				isIconOnly
				variant="light"
				color="primary"
			>
				<props.TriggerIcon />
			</Button>
		);
	};

	return (
		<>
			{renderTrigger()}
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
