import { QueryClient, QueryKey } from "@tanstack/react-query";

export type SelectedItemsByParentMap = Record<string, Array<number | string>>;

export type GetSelectedRowsFromQueryClientOptions<TRow> = {
	queryClient: QueryClient;
	selectedItemsByParent: SelectedItemsByParentMap;
	getRowsFromPage?: (page: unknown) => TRow[];
	getRowId?: (row: TRow) => number | string | undefined;
	shouldIncludeRow?: (row: TRow) => boolean;
};

const defaultGetRowsFromPage = <TRow>(page: unknown): TRow[] => {
	if (
		page &&
		typeof page === "object" &&
		"data" in (page as Record<string, unknown>)
	) {
		const rows = (page as Record<string, unknown>).data;
		return Array.isArray(rows) ? (rows as TRow[]) : [];
	}
	return [];
};

const defaultGetRowId = <TRow>(row: TRow): number | string | undefined => {
	if (row && typeof row === "object" && row !== null) {
		const item = (row as Record<string, unknown>).id;
		if (typeof item === "number" || typeof item === "string") {
			return item;
		}
	}
	return undefined;
};

/**
 * Extracts cached rows from React Query's QueryClient that match the provided selection map.
 */
export const getSelectedRowsFromQueryClient = <TRow>(
	options: GetSelectedRowsFromQueryClientOptions<TRow>
): TRow[] => {
	const {
		queryClient,
		selectedItemsByParent,
		getRowsFromPage = defaultGetRowsFromPage,
		getRowId = defaultGetRowId,
		shouldIncludeRow,
	} = options;

	const collected: TRow[] = [];
	const visited = new Set<number | string>();

	for (const [parentKey, selectedIds] of Object.entries(
		selectedItemsByParent
	)) {
		if (!selectedIds?.length) continue;

		const idSet = new Set<number | string>(selectedIds);
		const matchingQueries =
			queryClient.getQueriesData({ queryKey: [parentKey] }) ?? [];

		for (const [, cachedValue] of matchingQueries) {
			const pages = Array.isArray((cachedValue as any)?.pages)
				? ((cachedValue as any).pages as unknown[])
				: [];

			for (const page of pages) {
				const rows = getRowsFromPage(page) ?? [];
				for (const row of rows) {
					const rowId = getRowId(row);
					if (rowId === undefined || rowId === null) continue;
					if (!idSet.has(rowId)) continue;
					if (shouldIncludeRow && !shouldIncludeRow(row)) continue;

					if (visited.has(rowId)) continue;
					visited.add(rowId);
					collected.push(row);
				}
			}
		}
	}

	return collected;
};

type InfinitePageWithData<TItem> = {
	data?: TItem[];
} & Record<string, unknown>;

type InfiniteDataWithPages<TPage> = {
	pages?: TPage[];
} & Record<string, unknown>;

export type InfiniteOptimisticContext<TPage> = {
	previousEntries?: Array<[QueryKey, InfiniteDataWithPages<TPage> | undefined]>;
	affectedColumns?: string[];
};

const defaultSelectItems = <TItem>(page: InfinitePageWithData<TItem>) => {
	return Array.isArray(page?.data) ? [...page.data] : [];
};

const defaultUpdatePage = <TItem>(
	page: InfinitePageWithData<TItem>,
	items: TItem[]
) => ({
	...page,
	data: items,
});

const defaultGetItemId = <TItem>(item: TItem): number | string | undefined => {
	if (item && typeof item === "object") {
		const maybeId = (item as Record<string, unknown>).id;
		if (typeof maybeId === "number" || typeof maybeId === "string") {
			return maybeId;
		}
	}
	return undefined;
};

const defaultUpdateTotals = <TPage>(pages: TPage[], delta: number): TPage[] => {
	if (!delta || !pages.length) return pages;
	return pages.map((page) => {
		if (!page || typeof page !== "object") return page;
		const currentTotal = (page as Record<string, unknown>).totalItems;
		if (typeof currentTotal !== "number") return page;
		const nextTotal = Math.max(0, currentTotal + delta);
		return {
			...(page as Record<string, unknown>),
			totalItems: nextTotal,
		} as TPage;
	});
};

type CreateInfiniteOptimisticHandlersOptions<
	TVariables,
	TItem,
	TPage extends InfinitePageWithData<TItem>
> = {
	queryClient: QueryClient;
	queryKey: QueryKey;
	getIds: (variables: TVariables) => Array<number | string>;
	selectItems?: (page: TPage) => TItem[];
	updatePage?: (page: TPage, items: TItem[]) => TPage;
	getItemId?: (item: TItem) => number | string | undefined;
};

export const createInfiniteOptimisticHandlers = <
	TVariables,
	TItem,
	TPage extends InfinitePageWithData<TItem> = InfinitePageWithData<TItem>
>(
	options: CreateInfiniteOptimisticHandlersOptions<TVariables, TItem, TPage>
) => {
	const {
		queryClient,
		queryKey,
		getIds,
		selectItems = defaultSelectItems as unknown as (page: TPage) => TItem[],
		updatePage = defaultUpdatePage as unknown as (
			page: TPage,
			items: TItem[]
		) => TPage,
		getItemId = defaultGetItemId as (
			item: TItem
		) => number | string | undefined,
	} = options;

	const onMutate = (variables: TVariables) => {
		const ids = getIds(variables);
		const idSet = new Set<number | string>(ids);

		queryClient.cancelQueries({ queryKey, exact: false });
		const previousEntries =
			queryClient.getQueriesData<InfiniteDataWithPages<TPage>>({
				queryKey,
				exact: false,
			}) ?? [];

		if (!idSet.size) {
			return {
				previousEntries,
			} as InfiniteOptimisticContext<TPage>;
		}

		queryClient.setQueriesData(
			{ queryKey, exact: false },
			(oldData: InfiniteDataWithPages<TPage> | undefined) => {
				if (!oldData?.pages?.length) return oldData;

				const pages = oldData.pages.map((page) => {
					const items = selectItems(page as TPage) ?? [];
					if (!items.length) return page;

					const filteredItems = items.filter((item) => {
						const itemId = getItemId(item);
						return itemId === undefined || !idSet.has(itemId);
					});

					if (filteredItems.length === items.length) return page;

					return updatePage(page as TPage, filteredItems);
				});

				return { ...oldData, pages };
			}
		);

		return {
			previousEntries,
		} as InfiniteOptimisticContext<TPage>;
	};

	const onError = (
		_error: unknown,
		_variables: TVariables,
		context?: InfiniteOptimisticContext<TPage>
	) => {
		const previousEntries = context?.previousEntries;
		if (!previousEntries?.length) return;

		previousEntries.forEach(([cachedKey, cachedData]) => {
			queryClient.setQueryData(cachedKey, cachedData);
		});
	};

	return { onMutate, onError };
};

type MoveSelection = {
	selectedItemsByParent: SelectedItemsByParentMap;
	targetColumnIdentifier: string;
};

type CreateInfiniteMoveHandlersOptions<
	TVariables,
	TItem,
	TPage extends InfinitePageWithData<TItem>
> = {
	queryClient: QueryClient;
	getSelection: (variables: TVariables) => MoveSelection;
	cloneItemForTarget: (item: TItem, variables: TVariables) => TItem;
	selectItems?: (page: TPage) => TItem[];
	updatePage?: (page: TPage, items: TItem[]) => TPage;
	getItemId?: (item: TItem) => number | string | undefined;
	updateTotals?: (pages: TPage[], delta: number) => TPage[];
};

const normaliseColumns = (
	selectedItemsByParent: SelectedItemsByParentMap,
	targetColumnIdentifier: string
) => {
	const columns = new Set<string>([targetColumnIdentifier]);
	Object.keys(selectedItemsByParent ?? {}).forEach((columnId) => {
		if (columnId) columns.add(columnId);
	});
	return [...columns];
};

export const createInfiniteMoveHandlers = <
	TVariables,
	TItem,
	TPage extends InfinitePageWithData<TItem> = InfinitePageWithData<TItem>
>(
	options: CreateInfiniteMoveHandlersOptions<TVariables, TItem, TPage>
) => {
	const {
		queryClient,
		getSelection,
		cloneItemForTarget,
		selectItems = defaultSelectItems as unknown as (page: TPage) => TItem[],
		updatePage = defaultUpdatePage as unknown as (
			page: TPage,
			items: TItem[]
		) => TPage,
		getItemId = defaultGetItemId as (
			item: TItem
		) => number | string | undefined,
		updateTotals = defaultUpdateTotals as unknown as (
			pages: TPage[],
			delta: number
		) => TPage[],
	} = options;

	const onMutate = async (
		variables: TVariables
	): Promise<InfiniteOptimisticContext<TPage>> => {
		const { selectedItemsByParent, targetColumnIdentifier } =
			getSelection(variables);
		const columns = normaliseColumns(
			selectedItemsByParent ?? {},
			targetColumnIdentifier
		);

		await Promise.all(
			columns.map((columnId) =>
				queryClient.cancelQueries({ queryKey: [columnId], exact: false })
			)
		);

		const previousEntriesMap = new Map<
			string,
			[QueryKey, InfiniteDataWithPages<TPage> | undefined]
		>();

		for (const columnId of columns) {
			const entries =
				queryClient.getQueriesData<InfiniteDataWithPages<TPage>>({
					queryKey: [columnId],
					exact: false,
				}) ?? [];
			for (const entry of entries) {
				const key = JSON.stringify(entry[0]);
				if (!previousEntriesMap.has(key)) {
					previousEntriesMap.set(key, entry);
				}
			}
		}

		const movedItems: TItem[] = [];

		for (const [columnId, ids] of Object.entries(
			selectedItemsByParent ?? {}
		) as Array<[string, Array<number | string>]>) {
			if (!ids?.length) continue;
			const idSet = new Set<number | string>(ids);
			queryClient.setQueriesData(
				{ queryKey: [columnId], exact: false },
				(
					oldData: InfiniteDataWithPages<TPage> | undefined
				): InfiniteDataWithPages<TPage> | undefined => {
					if (!oldData?.pages?.length) return oldData;

					const updatedPages: TPage[] = [];
					const removedForColumn: TItem[] = [];

					for (const rawPage of oldData.pages) {
						const page = rawPage as TPage;
						const items = selectItems(page) ?? [];
						if (!items.length) {
							updatedPages.push(page);
							continue;
						}

						const remainingItems: TItem[] = [];
						for (const item of items) {
							const itemId = getItemId(item);
							if (itemId !== undefined && idSet.has(itemId)) {
								removedForColumn.push(item);
							} else {
								remainingItems.push(item);
							}
						}

						if (!removedForColumn.length) {
							updatedPages.push(page);
							continue;
						}

						updatedPages.push(updatePage(page, remainingItems));
					}

					if (!removedForColumn.length) return oldData;

					removedForColumn.forEach((item) => {
						movedItems.push(item);
					});

					const pagesWithTotals = updateTotals(
						updatedPages,
						-removedForColumn.length
					);
					return { ...oldData, pages: pagesWithTotals };
				}
			);
		}

		if (movedItems.length) {
			const preparedItems = movedItems.map((item) =>
				cloneItemForTarget(item, variables)
			);

			queryClient.setQueriesData(
				{ queryKey: [targetColumnIdentifier], exact: false },
				(
					oldData: InfiniteDataWithPages<TPage> | undefined
				): InfiniteDataWithPages<TPage> | undefined => {
					if (!oldData?.pages?.length) return oldData;

					const [firstPage, ...restPages] = oldData.pages;
					if (!firstPage) return oldData;

					const existingItems = selectItems(firstPage as TPage) ?? [];
					const seenIds = new Set<number | string>();
					for (const item of existingItems) {
						const itemId = getItemId(item);
						if (itemId !== undefined) {
							seenIds.add(itemId);
						}
					}

					const newItems: TItem[] = [];
					for (const item of preparedItems) {
						const itemId = getItemId(item);
						if (itemId !== undefined && seenIds.has(itemId)) continue;
						if (itemId !== undefined) seenIds.add(itemId);
						newItems.push({
							...item,
							syncStatus: {
								...(item! as any)?.syncStatus,
								id: 3,
							},
						});
					}

					if (!newItems.length) return oldData;

					const updatedFirstPage = updatePage(firstPage as TPage, [
						...existingItems,
						...newItems,
					]);

					const pagesWithTotals = updateTotals(
						[updatedFirstPage, ...(restPages as TPage[])],
						newItems.length
					);

					return { ...oldData, pages: pagesWithTotals };
				}
			);
		}

		return {
			previousEntries: [...previousEntriesMap.values()],
			affectedColumns: columns,
		};
	};

	const onError = (
		_error: unknown,
		_variables: TVariables,
		context?: InfiniteOptimisticContext<TPage>
	) => {
		const previousEntries = context?.previousEntries;
		if (!previousEntries?.length) return;
		previousEntries.forEach(([cachedKey, cachedData]) => {
			queryClient.setQueryData(cachedKey, cachedData);
		});
	};

	return { onMutate, onError };
};

type CreateInfiniteTransferHandlersOptions<
	TVariables,
	TSourceItem,
	TSourcePage extends InfinitePageWithData<TSourceItem>,
	TTargetItem,
	TTargetPage extends InfinitePageWithData<TTargetItem>
> = {
	queryClient: QueryClient;
	getSelection: (variables: TVariables) => MoveSelection;
	cloneItemForTarget: (
		sourceItem: TSourceItem,
		variables: TVariables
	) => TTargetItem;
	selectSourceItems?: (page: TSourcePage) => TSourceItem[];
	updateSourcePage?: (page: TSourcePage, items: TSourceItem[]) => TSourcePage;
	getSourceItemId?: (item: TSourceItem) => number | string | undefined;
	sourceUpdateTotals?: (pages: TSourcePage[], delta: number) => TSourcePage[];
	selectTargetItems?: (page: TTargetPage) => TTargetItem[];
	updateTargetPage?: (page: TTargetPage, items: TTargetItem[]) => TTargetPage;
	getTargetItemId?: (item: TTargetItem) => number | string | undefined;
	targetUpdateTotals?: (pages: TTargetPage[], delta: number) => TTargetPage[];
};

export const createInfiniteTransferHandlers = <
	TVariables,
	TSourceItem,
	TSourcePage extends InfinitePageWithData<TSourceItem> = InfinitePageWithData<TSourceItem>,
	TTargetItem = TSourceItem,
	TTargetPage extends InfinitePageWithData<TTargetItem> = InfinitePageWithData<TTargetItem>
>(
	options: CreateInfiniteTransferHandlersOptions<
		TVariables,
		TSourceItem,
		TSourcePage,
		TTargetItem,
		TTargetPage
	>
) => {
	const {
		queryClient,
		getSelection,
		cloneItemForTarget,
		selectSourceItems = defaultSelectItems as unknown as (
			page: TSourcePage
		) => TSourceItem[],
		updateSourcePage = defaultUpdatePage as unknown as (
			page: TSourcePage,
			items: TSourceItem[]
		) => TSourcePage,
		getSourceItemId = defaultGetItemId as unknown as (
			item: TSourceItem
		) => number | string | undefined,
		sourceUpdateTotals = defaultUpdateTotals as unknown as (
			pages: TSourcePage[],
			delta: number
		) => TSourcePage[],
		selectTargetItems = defaultSelectItems as unknown as (
			page: TTargetPage
		) => TTargetItem[],
		updateTargetPage = defaultUpdatePage as unknown as (
			page: TTargetPage,
			items: TTargetItem[]
		) => TTargetPage,
		getTargetItemId = defaultGetItemId as unknown as (
			item: TTargetItem
		) => number | string | undefined,
		targetUpdateTotals = defaultUpdateTotals as unknown as (
			pages: TTargetPage[],
			delta: number
		) => TTargetPage[],
	} = options;

	const onMutate = async (
		variables: TVariables
	): Promise<InfiniteOptimisticContext<TSourcePage | TTargetPage>> => {
		const { selectedItemsByParent, targetColumnIdentifier } =
			getSelection(variables);

		const columns = normaliseColumns(
			selectedItemsByParent ?? {},
			targetColumnIdentifier
		);

		await Promise.all(
			columns.map((columnId) =>
				queryClient.cancelQueries({ queryKey: [columnId], exact: false })
			)
		);

		const previousEntriesMap = new Map<
			string,
			[QueryKey, InfiniteDataWithPages<TSourcePage | TTargetPage> | undefined]
		>();

		const rememberEntries = (columnId: string) => {
			const entries =
				queryClient.getQueriesData<
					InfiniteDataWithPages<TSourcePage | TTargetPage>
				>({
					queryKey: [columnId],
					exact: false,
				}) ?? [];
			for (const entry of entries) {
				const key = JSON.stringify(entry[0]);
				if (!previousEntriesMap.has(key)) {
					previousEntriesMap.set(key, entry);
				}
			}
		};

		columns.forEach(rememberEntries);

		const removedItems: TSourceItem[] = [];

		for (const [columnId, ids] of Object.entries(selectedItemsByParent ?? {})) {
			if (!columnId || !ids?.length) continue;
			const idSet = new Set<number | string>(ids);
			queryClient.setQueriesData(
				{ queryKey: [columnId], exact: false },
				(
					oldData: InfiniteDataWithPages<TSourcePage> | undefined
				): InfiniteDataWithPages<TSourcePage> | undefined => {
					if (!oldData?.pages?.length) return oldData;

					const updatedPages: TSourcePage[] = [];
					let removedCount = 0;

					for (const rawPage of oldData.pages) {
						const page = rawPage as TSourcePage;
						const items = selectSourceItems(page) ?? [];
						if (!items.length) {
							updatedPages.push(page);
							continue;
						}

						const remaining: TSourceItem[] = [];
						for (const item of items) {
							const itemId = getSourceItemId(item);
							if (itemId !== undefined && idSet.has(itemId)) {
								removedItems.push(item);
								removedCount += 1;
								continue;
							}
							remaining.push(item);
						}

						if (remaining.length === items.length) {
							updatedPages.push(page);
							continue;
						}

						updatedPages.push(updateSourcePage(page, remaining));
					}

					if (!removedCount) return oldData;

					const pagesWithTotals = sourceUpdateTotals(
						updatedPages,
						-removedCount
					);
					return { ...oldData, pages: pagesWithTotals };
				}
			);
		}

		if (removedItems.length) {
			const preparedItems = removedItems.map((item) =>
				cloneItemForTarget(item, variables)
			);

			queryClient.setQueriesData(
				{ queryKey: [targetColumnIdentifier], exact: false },
				(
					oldData: InfiniteDataWithPages<TTargetPage> | undefined
				): InfiniteDataWithPages<TTargetPage> | undefined => {
					if (!oldData?.pages?.length) return oldData;

					const [firstPage, ...restPages] = oldData.pages as TTargetPage[];
					if (!firstPage) return oldData;

					const existingItems = selectTargetItems(firstPage) ?? [];
					const seenIds = new Set<number | string>();
					for (const item of existingItems) {
						const itemId = getTargetItemId(item);
						if (itemId !== undefined) {
							seenIds.add(itemId);
						}
					}

					const newItems: TTargetItem[] = [];
					for (const item of preparedItems) {
						const itemId = getTargetItemId(item);
						if (itemId !== undefined && seenIds.has(itemId)) continue;
						if (itemId !== undefined) {
							seenIds.add(itemId);
						}
						newItems.push(item);
					}

					if (!newItems.length) return oldData;

					const updatedFirstPage = updateTargetPage(firstPage, [
						...existingItems,
						...newItems,
					]);

					const pagesWithTotals = targetUpdateTotals(
						[updatedFirstPage, ...(restPages as TTargetPage[])],
						newItems.length
					);

					return { ...oldData, pages: pagesWithTotals };
				}
			);
		}

		return {
			previousEntries: [...previousEntriesMap.values()],
			affectedColumns: columns,
		};
	};

	const onError = (
		_error: unknown,
		_variables: TVariables,
		context?: InfiniteOptimisticContext<TSourcePage | TTargetPage>
	) => {
		const previousEntries = context?.previousEntries;
		if (!previousEntries?.length) return;
		previousEntries.forEach(([cachedKey, cachedData]) => {
			queryClient.setQueryData(cachedKey, cachedData);
		});
	};

	return { onMutate, onError };
};
