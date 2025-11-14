/* eslint-disable @typescript-eslint/no-unused-vars */
/** biome-ignore-all lint/correctness/noUnusedVariables: <explanation> */
import React from "react";
import DataTable, { createTheme } from "react-data-table-component";
import data from "./sample.ts";

createTheme(
	"solarized",
	{
		text: {
			primary: "#add226ff",
			secondary: "#2aa198",
		},
		background: {
			default: "#002b36",
		},
		context: {
			background: "#16cb95ff",
			text: "#FFFFFF",
		},
		divider: {
			default: "#073642",
		},
		action: {
			button: "rgba(0,0,0,.54)",
			hover: "rgba(0,0,0,.08)",
			disabled: "rgba(0,0,0,.12)",
		},
	},
	"dark",
);

export default function DataTableWrap() {
	function convertArrayOfObjectsToCSV(array: object[][]) {
		let result = "";

		const columnDelimiter = ",";
		const lineDelimiter = "\n";
		const keys = Object.keys(data[0]);

		result = "";
		result += keys.join(columnDelimiter);
		result += lineDelimiter;

		array.forEach((item) => {
			let ctr = 0;
			keys.forEach((key) => {
				if (ctr > 0) result += columnDelimiter;

				result += item[key];
				// eslint-disable-next-line no-plusplus
				ctr++;
			});
			result += lineDelimiter;
		});

		return result;
	}

	// Blatant "inspiration" from https://codepen.io/Jacqueline34/pen/pyVoWr
	function downloadCSV(array: object[][]) {
		const link = document.createElement("a");
		let csv = convertArrayOfObjectsToCSV(array);
		if (csv == null) return;

		const filename = "export.csv";

		if (!csv.match(/^data:text\/csv/i)) {
			csv = `data:text/csv;charset=utf-8,${csv}`;
		}

		link.setAttribute("href", encodeURI(csv));
		link.setAttribute("download", filename);
		link.click();
	}

	// const selectableRowsComponentProps = React.useMemo(
	// 	() => ({
	// 		type: selectableRowsRadio ? "radio" : "checkbox",
	// 	}),
	// 	[selectableRowsRadio],
	// );

	const columns = [
		{
			name: "Title",
			selector: (row: object) => row.title,
			sortable: true,
			reorder: true,
		},
		{
			name: "Director",
			selector: (row: object) => row.director,
			sortable: true,
			reorder: true,
		},
		{
			name: "Year",
			selector: (row: object) => row.year,
			sortable: true,
			reorder: true,
		},
	];

	return (
		<div className="m-10 p-10">
			<DataTable
				title="Movie List"
				columns={columns}
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
				// theme="dark"
			/>
		</div>
	);
}
