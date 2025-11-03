import {
	Table,
	TableHeader,
	TableColumn,
	TableBody,
	TableRow,
	TableCell,
	type TableProps,
	Spinner,
} from "@heroui/react";

type TableColumnType<T> =
	| {
			headerLabel: React.ReactNode | string;
			selector: (item: T) => React.ReactNode;
			className?: string;
	  }
	| {
			key?: string | number;
			headerLabel?: React.ReactNode | string;
			selector: (item: T) => React.ReactNode;
			className?: string;
	  };
type Props<T extends { id: string | number }> = {
	columns: TableColumnType<T>[];
	data: T[];
	isLoading?: boolean;
	rowIdGetter?: (row: T) => string | number;
};
const AppTable = <T extends { id: string | number }>({
	columns = [],
	data = [],
	isLoading,
	rowIdGetter,
	...props
}: TableProps & Props<T>) => {
	if (isLoading) {
		return (
			<div className="flex justify-center items-center mt-8">
				<Spinner size="lg" />
			</div>
		);
	}
	return (
		<Table
			classNames={{
				base: "flex flex-col h-full ",
				wrapper: "shadow-none p-0 ",
				th: "font-semibold text-sm h-12 text-start !rounded-none text-foreground bg-default-200 border-none",
				tr: "max-h-[52px] even:bg-default-100 odd:bg-background ",
				td: "p-2 border-b border-default-200 ",
			}}
			shadow="none"
			// isVirtualized={false}
			isStriped
			selectionMode="none"
			isHeaderSticky
			{...props}
		>
			<TableHeader>
				{columns.map((column, index) => (
					<TableColumn
						key={
							typeof column?.headerLabel === "string"
								? column.headerLabel
								: index
						}
						className={`${column.className} capitalize`}
					>
						{column.headerLabel}
					</TableColumn>
				))}
			</TableHeader>
			<TableBody
				isLoading={isLoading}
				loadingContent={
					<div className="w-full min-h-[200px] backdrop-blur-sm flex items-center justify-center">
						<Spinner label={"Cargando..."} />
					</div>
				}
			>
				{data?.length ? (
					data.map((row, index) => (
						<TableRow key={row?.id || (rowIdGetter ? rowIdGetter(row) : index)}>
							{columns.map((column, index) => (
								<TableCell key={`${row?.id}-${index}`}>
									{column.selector(row)}
								</TableCell>
							))}
						</TableRow>
					))
				) : (
					<TableRow>
						{Array.from({ length: columns.length }).map((_, i) => (
							<TableCell key={i}>{"Sin datos"}</TableCell>
						))}
					</TableRow>
				)}
			</TableBody>
		</Table>
	);
};

export default AppTable;
