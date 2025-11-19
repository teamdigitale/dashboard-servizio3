// import { F } from "@mobily/ts-belt";
import React, { useMemo, useState } from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { uuidv7 } from "uuidv7";
import sample from "../data/misure.json";
import { filterByCondition } from "../lib/utils";
import {
	aggregate,
	capitalize,
	downloadCSV,
	getColumns,
	removeArraysFromObjects,
	selectCols,
} from "../lib/utils.ts";
import { useSettingsStore } from "../store/settings_store.ts";

//group su più colonne. merging- column names

createTheme(
	"black",
	{
		text: {
			primary: "rgba(255,255,255, 0.54)",
			secondary: "rgba(255,255,255, 0.54)",
			disabled: "rgba(255,255,255, 0.38)",
		},
		background: {
			default: "#trasnparent",
		},
		divider: {
			default: "rgba(255,255,255,.075)",
		},
		highlightOnHover: {
			default: "rgba(255,255,255,.03)",
			text: "#fff",
		},
	},
	"dark",
);

export default function DataTableWrap() {
	const { settings } = useSettingsStore();

	const currentTheme =
		settings?.preferredTheme === "dark" ? "black" : "default";

	const [data, setData] = useState<object[]>(() =>
		removeArraysFromObjects(sample),
	);
	const [cols, setCols] = useState<object[]>(() => getColumns(data));
	const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
		Object.keys(data[0]),
	);
	const [groupedBy, setGroupedBy] = useState<string>("");

	const handleColumnToggle = (column: string) => {
		if (selectedColumns.includes(column)) {
			setSelectedColumns(selectedColumns.filter((col) => col !== column));
		} else {
			setSelectedColumns([...selectedColumns, column]);
		}
	};

	function changeColumnsOrder(newOrder: object[]) {
		console.log("New order:", newOrder);
		setCols(newOrder);
	}

	function filterDataByCondition(
		data,
		condition: { conditionType: string; value: string | number },
	) {
		if (isNaN(condition.value as number)) {
			if (condition.conditionType === "equals") {
				return data.filter(
					(item) => item[condition.value as string] === condition.value,
				);
			} else {
				return data;
			}
		}
		switch (condition.conditionType) {
			case "greaterThan":
				return filterByCondition(
					data,
					condition.value as string,
					(value) =>
						typeof value === "number" && value > Number(condition.value),
				);
			case "lessThan":
				return filterByCondition(
					data,
					condition.value as string,
					(value) =>
						typeof value === "number" && value < Number(condition.value),
				);
			case "equals":
				return filterByCondition(
					data,
					condition.value as string,
					(value) => value === condition.value,
				);
			default:
				return data;
		}
	}

	const filteredColumns = useMemo(
		() =>
			cols.filter((col) => selectedColumns.includes(col.name.toLowerCase())),
		[selectedColumns],
	);

	const handleGroupBy = (groupedBy) => {
		const gData = aggregate(selectCols(data, selectedColumns), groupedBy);
		console.log("Grouped data:", gData);
		setData(gData);
		setGroupedBy(groupedBy);
	};

	const handleDownload = (data, colsNameSorted) => {
		const exportData = selectCols(data, colsNameSorted);
		const fileName = `${uuidv7()}-export.csv`;
		downloadCSV(exportData, fileName, colsNameSorted);
	};

	const colsNameSorted = cols
		.map((col) => col.name.toLowerCase())
		.filter((c) => selectedColumns.includes(c));

	return (
		<div className="m-10 p-10">
			<div>
				{Object.keys(data[0]).map((key) => (
					<div key={key} className="inline-block mr-4">
						<label className="mr-2">
							<input
								type="checkbox"
								checked={selectedColumns.includes(key)}
								onChange={() => handleColumnToggle(key)}
							/>
							{`${capitalize(key)}`}
						</label>
					</div>
				))}
			</div>
			<hr className="hr" />
			<DataTable
				title="Movie List"
				columns={filteredColumns}
				data={data}
				// defaultSortFieldId={1}
				// selectableRows={selectableRows}
				// striped={true}
				// pointerOnHover={true}
				pagination={true}
				highlightOnHover={true}
				dense={true}
				fixedHeader={true}
				fixedHeaderScrollHeight={"400px"}
				responsive={true}
				onColumnOrderChange={(cols) => changeColumnsOrder(cols)}
				theme={currentTheme}
			/>
			<hr className="hr" />

			<div className="my-10 flex">
				<div className="mx-10">
					<p>Showing {data.length} records.</p>
				</div>
				<div className="mx-10 block">
					<button
						type="button"
						className="btn btn-primary"
						onClick={() => handleDownload(data, colsNameSorted)}
					>
						Download CSV
					</button>
				</div>

				<div className="mx-10">
					{!groupedBy ? (
						<>
							<p>Group by column:</p>
							<select
								className="select select-bordered w-full max-w-xs"
								onChange={(e) => handleGroupBy(e.target.value)}
							>
								<option value="">-</option>
								{filteredColumns.map((col) => (
									<option key={col.name} value={col.name.toLowerCase()}>
										{capitalize(col.name)}
									</option>
								))}
							</select>
						</>
					) : (
						<p className="mt-2">
							Currently grouped by: {capitalize(groupedBy)}
						</p>
					)}
				</div>

				{/* <div className="my-10">
				<p>Filter records by </p>
				<select
					className="select select-bordered w-full max-w-xs"
					onChange={(e) => {
						const value = e.target.value;
						console.log("Selected filter:", value);
					}}
				>
					{filteredColumns.map((col) => (
						<option key={col.name} value={col.name.toLowerCase()}>
							{capitalize(col.name)}
						</option>
					))}
				</select>
			</div> */}
			</div>
		</div>
	);
}
