// import { F } from "@mobily/ts-belt";
import React from "react";
import DataTable from "react-data-table-component";
import { uuidv7 } from "uuidv7";
// import { createTheme } from "react-data-table-component";
import {
	capitalize,
	downloadCSV,
	getColumns,
	removeArraysFromObjects,
	selectCols,
} from "../lib/utils.ts";
import sample from "./sample.ts";

// createTheme(
// 	"solarized",
// 	{
// 		text: {
// 			primary: "#add226ff",
// 			secondary: "#2aa198",
// 		},
// 		background: {
// 			default: "#002b36",
// 		},
// 		context: {
// 			background: "#16cb95ff",
// 			text: "#FFFFFF",
// 		},
// 		divider: {
// 			default: "#073642",
// 		},
// 		action: {
// 			button: "rgba(0,0,0,.54)",
// 			hover: "rgba(0,0,0,.08)",
// 			disabled: "rgba(0,0,0,.12)",
// 		},
// 	},
// 	"dark",
// );

export default function DataTableWrap() {
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
		setSelectedColumns(newOrder);
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
				defaultSortFieldId={1}
				// selectableRows={selectableRows}
				pagination={true}
				highlightOnHover={true}
				striped={true}
				pointerOnHover={true}
				dense={true}
				fixedHeader={true}
				fixedHeaderScrollHeight={"500px"}
				responsive={true}
				onColumnOrderChange={(cols) => changeColsSort}
				// theme="dark"
			/>
			<hr className="hr" />
			<button
				type="button"
				className="btn btn-primary"
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
