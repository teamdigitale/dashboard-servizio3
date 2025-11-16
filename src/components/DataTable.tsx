// import { F } from "@mobily/ts-belt";
import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import { uuidv7 } from "uuidv7";
import {
	capitalize,
	downloadCSV,
	getColumns,
	removeArraysFromObjects,
	selectCols,
} from "../lib/utils.ts";
import { useSettingsStore } from "../store/settings_store.ts";
import sample from "./sample.ts";

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

	const data = removeArraysFromObjects(sample);
	const [selectedColumns, setSelectedColumns] = React.useState<string[]>(
		Object.keys(data[0]),
	);

	const handleColumnToggle = (column: string) => {
		if (selectedColumns.includes(column)) {
			setSelectedColumns(selectedColumns.filter((col) => col !== column));
		} else {
			setSelectedColumns([...selectedColumns, column]);
		}
	};

	function changeColumnsOrder(newOrder: string[]) {
		console.log("New order:", newOrder);
		// setSelectedColumns(newOrder);
	}

	// Throttle function to limit the rate of function calls
	const throttle = (func, limit) => {
		let inThrottle;
		return (...args) => {
			if (!inThrottle) {
				func(...args);
				inThrottle = true;
				setTimeout(() => (inThrottle = false), limit);
			}
		};
	};

	const columns = getColumns(data);
	const filteredColumns = columns.filter((col) =>
		selectedColumns.includes(col.name.toLowerCase()),
	);

	const changeColsSort = throttle((cols: object[]) => {
		const newOrder = cols.map((col) => col.name.toLowerCase());
		changeColumnsOrder(newOrder);
	}, 500);

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
				onColumnOrderChange={(cols) =>
					changeColumnsOrder(cols.map((c) => c.name.toLowerCase()))
				}
				theme={currentTheme}
			/>
			<hr className="hr" />
			<button
				type="button"
				className="btn btn-primary my-10"
				onClick={() =>
					downloadCSV(
						selectCols(data, selectedColumns),
						`${uuidv7()}-data-table-export.csv`,
					)
				}
			>
				Download CSV
			</button>
		</div>
	);
}
