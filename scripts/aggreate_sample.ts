// Types for your raw data
type DataValue = string | number | Date; // Dates should ideally be Date objects or ISO strings
interface RawDataRow {
	[key: string]: DataValue;
}
type RawDataset = RawDataRow[];

// Structure for an AI Suggestion
interface AISuggestion {
	id: string; // Unique ID for the suggestion
	description: string; // Human-readable text, e.g., "Show Total Sales by Region as a Bar Chart"

	transformations: TransformationStep[]; // Array of transformation steps

	chartType: "bar" | "line" | "graph" | "geo" | "pie" | "donut"; // Suggested chart type

	xAxis: {
		sourceColumn: string; // Original column name or derived column name after transformation
		displayName?: string; // Optional: how to display it on the chart
	};

	yAxes: {
		sourceColumn: string; // Original column name or derived column name
		aggregationFunction?: AggregationType; // If applicable, e.g., SUM, AVG
		displayName: string; // How to display this series on the chart
	}[];
}

// Types for Transformation Steps
type AggregationType =
	| "SUM"
	| "AVERAGE"
	| "COUNT"
	| "MIN"
	| "MAX"
	| "COUNT_DISTINCT";

interface TransformationStep {
	type:
		| "GROUP_BY"
		| "AGGREGATE"
		| "FILTER"
		| "EXTRACT_DATE_PART"
		| "PIVOT" /* etc. */;
	// Common properties
	inputColumns?: string[];
	outputColumnName?: string;

	// Specific to GROUP_BY
	groupByColumns?: string[];

	// Specific to AGGREGATE
	aggregationFunction?: AggregationType;
	columnToAggregate?: string; // The column on which the aggregation is performed

	// Specific to EXTRACT_DATE_PART
	dateColumn?: string;
	datePart?: "YEAR" | "MONTH" | "QUARTER" | "DAY_OF_WEEK";

	// ... other properties for other transformation types
}

// --- Helper Functions for Transformations ---

function extractDatePart(
	dataset: RawDataset,
	dateColumn: string,
	part: "YEAR" | "MONTH" | "QUARTER" | "DAY_OF_WEEK",
	outputColumnName: string,
): RawDataset {
	return dataset.map((row) => {
		const dateVal = row[dateColumn];
		let extractedPart: string | number = "";
		if (dateVal instanceof Date) {
			const d = dateVal;
			if (part === "YEAR") extractedPart = d.getFullYear();
			else if (part === "MONTH") extractedPart = d.getMonth() + 1; // 1-12
			// Add more parts as needed
		} else if (typeof dateVal === "string") {
			// Basic string parsing, robust date library like date-fns or moment.js recommended
			try {
				const d = new Date(dateVal);
				if (part === "YEAR") extractedPart = d.getFullYear();
				else if (part === "MONTH") extractedPart = d.getMonth() + 1;
			} catch (e) {
				console.warn(`Could not parse date string: ${dateVal}`);
			}
		}
		return { ...row, [outputColumnName]: extractedPart };
	});
}

function groupByAndAggregate(
	dataset: RawDataset,
	groupByColumns: string[],
	aggregations: { column: string; func: AggregationType; outputName: string }[],
): RawDataset {
	if (!groupByColumns.length || !aggregations.length) return dataset;

	const grouped = new Map<string, RawDataRow[]>();

	// Group rows
	dataset.forEach((row) => {
		const key = groupByColumns.map((col) => String(row[col])).join("||"); // Composite key
		if (!grouped.has(key)) {
			grouped.set(key, []);
		}
		grouped.get(key)!.push(row);
	});

	console.log("GROUPED", grouped);

	const result: RawDataset = [];
	grouped.forEach((rowsInGroup) => {
		const aggregatedRow: RawDataRow = {};

		// Add group by columns to the result row
		groupByColumns.forEach((col) => {
			aggregatedRow[col] = rowsInGroup[0][col]; // All rows in group have same value for these
		});

		// Perform aggregations
		aggregations.forEach((agg) => {
			const values = rowsInGroup
				.map((r) => Number(r[agg.column]))
				.filter((n) => !isNaN(n));
			if (
				!values.length &&
				agg.func !== "COUNT" &&
				agg.func !== "COUNT_DISTINCT"
			) {
				aggregatedRow[agg.outputName] = 0; // Or null/undefined
				return;
			}

			switch (agg.func) {
				case "SUM":
					aggregatedRow[agg.outputName] = values.reduce(
						(sum, val) => sum + val,
						0,
					);
					break;
				case "AVERAGE":
					aggregatedRow[agg.outputName] =
						values.reduce((sum, val) => sum + val, 0) / values.length;
					break;
				case "COUNT":
					aggregatedRow[agg.outputName] = rowsInGroup.length; // Count all rows in group
					break;
				case "MIN":
					aggregatedRow[agg.outputName] = Math.min(...values);
					break;
				case "MAX":
					aggregatedRow[agg.outputName] = Math.max(...values);
					break;
				case "COUNT_DISTINCT":
					aggregatedRow[agg.outputName] = new Set(
						rowsInGroup.map((r) => r[agg.column]),
					).size;
					break;
			}
		});
		result.push(aggregatedRow);
	});
	return result;
}

function formatToMatrix(suggestion: AISuggestion, workingDataset: RawDataset) {
	// Format for your charting application
	// Your app expects: [["-","T 1","T 2"], ["SERIE 1",74,75], ["SERIE 2",91,7 ]]
	// or transposed. Let's assume the first format (series as rows).
	const chartMatrix: (string | number)[][] = [];

	const xCategories = Array.from(
		new Set(
			workingDataset.map((row) => String(row[suggestion.xAxis.sourceColumn])),
		),
	);
	// xCategories.sort(); // Optional: sort categories

	const headerRow: (string | number)[] = ["-", ...xCategories];
	chartMatrix.push(headerRow);

	for (const yAxisDef of suggestion.yAxes) {
		const seriesRow: (string | number)[] = [yAxisDef.displayName];
		for (const category of xCategories) {
			const dataPoint = workingDataset.find(
				(row) => String(row[suggestion.xAxis.sourceColumn]) === category,
			);
			// The yAxisDef.sourceColumn is the name of the column in the *transformed* dataset
			seriesRow.push(dataPoint ? Number(dataPoint[yAxisDef.sourceColumn]) : 0); // Or handle missing data
		}
		chartMatrix.push(seriesRow);
	}

	return {
		chartMatrix,
		chartType: suggestion.chartType,
		xAxisLabel: suggestion.xAxis.displayName || suggestion.xAxis.sourceColumn,
		yAxisLabels: suggestion.yAxes.map((y) => y.displayName),
	};
}

// --- Main Processor ---
interface ProcessedChartData {
	chartMatrix: (string | number)[][]; // Your app's expected matrix format
	chartType: AISuggestion["chartType"];
	xAxisLabel: string;
	yAxisLabels: string[];
}

class DataProcessor {
	private originalDataset: RawDataset;

	constructor(dataset: RawDataset) {
		this.originalDataset = [...dataset]; // Make a copy
	}

	public applySuggestion(suggestion: AISuggestion): ProcessedChartData | null {
		let workingDataset = [...this.originalDataset];
		let currentGroupByColumns: string[] = []; // Keep track of columns used for grouping

		// Apply transformations
		for (const step of suggestion.transformations) {
			console.log("STEP TYPE", step.type);
			switch (step.type) {
				case "EXTRACT_DATE_PART":
					if (step.dateColumn && step.datePart && step.outputColumnName) {
						workingDataset = extractDatePart(
							workingDataset,
							step.dateColumn,
							step.datePart,
							step.outputColumnName,
						);
					} else {
						console.log("IGNORED");
					}
					break;
				case "GROUP_BY":
					if (step.groupByColumns) {
						currentGroupByColumns = step.groupByColumns; // Store for aggregation step
						// Note: Actual grouping happens with aggregation in this simplified model
						// More complex scenarios might pre-group or sort here.
					} else {
						console.log("IGNORED");
					}
					break;
				case "AGGREGATE":
					if (
						currentGroupByColumns.length > 0 &&
						step.columnToAggregate &&
						step.aggregationFunction &&
						step.outputColumnName
					) {
						workingDataset = groupByAndAggregate(
							workingDataset,
							currentGroupByColumns,
							[
								{
									column: step.columnToAggregate,
									func: step.aggregationFunction,
									outputName: step.outputColumnName,
								},
							],
						);
						// After aggregation, the dataset structure changes.
						// The new currentGroupByColumns for further steps would be the original ones plus the new aggregated column.
						// For simplicity, we assume one main aggregation after grouping.
						// If multiple AGGREGATE steps for the same group, they should be defined together for groupByAndAggregate.
					} else if (
						currentGroupByColumns.length === 0 &&
						step.columnToAggregate &&
						step.aggregationFunction &&
						step.outputColumnName
					) {
						// Aggregate without explicit group by (e.g., total sum of a column for the whole dataset)
						// This would typically result in a single row or value.
						// For charting, usually we need a category, so this might be less common directly from suggestions.
						console.warn(
							"AGGREGATE without GROUP_BY might not be directly chartable as multi-point series.",
						);
					} else {
						console.log("IGNORED");
					}
					break;
				// Add cases for 'FILTER', 'PIVOT', etc.
				default:
					console.warn(`Unsupported transformation type: ${step.type}`);
			}
			console.log("DATASET", workingDataset);
		}

		if (!workingDataset.length) {
			console.warn("No data after transformations.");
			return null;
		}
		// console.log("FINAL DATASET", workingDataset);
		return formatToMatrix(suggestion, workingDataset);
	}
}

function main() {
	// --- Example Usage ---
	const sampleRawData: RawDataset = [
		{
			ID: 1,
			Date: "2023-01-15",
			Region: "North",
			Product: "A",
			Sales: 100,
			Units: 5,
		},
		{
			ID: 2,
			Date: "2023-02-10",
			Region: "West",
			Product: "A",
			Sales: 120,
			Units: 6,
		},
		{
			ID: 3,
			Date: "2023-01-25",
			Region: "South",
			Product: "A",
			Sales: 90,
			Units: 4,
		},
		{
			ID: 4,
			Date: "2023-01-25",
			Region: "East",
			Product: "A",
			Sales: 90,
			Units: 4,
		},
		{
			ID: 5,
			Date: "2023-01-25",
			Region: "North",
			Product: "B",
			Sales: 90,
			Units: 4,
		},
		{
			ID: 6,
			Date: "2023-03-01",
			Region: "West",
			Product: "B",
			Sales: 180,
			Units: 7,
		},
		{
			ID: 7,
			Date: "2023-01-20",
			Region: "South",
			Product: "B",
			Sales: 150,
			Units: 3,
		},
		{
			ID: 8,
			Date: "2023-02-12",
			Region: "East",
			Product: "B",
			Sales: 200,
			Units: 10,
		},
	];

	console.log("Sample Raw Data:", JSON.stringify(sampleRawData, null, 2));
	const processor = new DataProcessor(sampleRawData);

	// AI Suggestion 1: Total Sales by Region
	const suggestionSample: AISuggestion = {
		id: "s1",
		description:
			"Show Total Sales and Units by Region and Product as a Bar Chart",
		transformations: [
			{ type: "GROUP_BY", groupByColumns: ["Product"] },
			{
				type: "AGGREGATE",
				columnToAggregate: "Sales",
				aggregationFunction: "SUM",
				outputColumnName: "TotalSales",
			},
		],
		chartType: "bar",
		xAxis: { sourceColumn: "Product" },
		yAxes: [{ sourceColumn: "TotalSales", displayName: "Total Sales" }],
	};

	// AI Suggestion 1: Total Sales by Region
	const suggestionSalesByRegion: AISuggestion = {
		id: "s1",
		description: "Show Total Sales by Region as a Bar Chart",
		transformations: [
			{ type: "GROUP_BY", groupByColumns: ["Region"] },
			{
				type: "AGGREGATE",
				columnToAggregate: "Sales",
				aggregationFunction: "SUM",
				outputColumnName: "TotalSalesByRegion",
			},
		],
		chartType: "bar",
		xAxis: { sourceColumn: "Region" },
		yAxes: [{ sourceColumn: "TotalSalesByRegion", displayName: "Total Sales" }],
	};
	// AI Suggestion 2: Sales Trend by Month
	const suggestionSalesByMonth: AISuggestion = {
		id: "s2",
		description: "Visualize Sales Trend by Month as a Line Chart",
		transformations: [
			{
				type: "EXTRACT_DATE_PART",
				dateColumn: "Date",
				datePart: "MONTH",
				outputColumnName: "OrderMonth",
			},
			{ type: "GROUP_BY", groupByColumns: ["OrderMonth"] },
			{
				type: "AGGREGATE",
				columnToAggregate: "Sales",
				aggregationFunction: "SUM",
				outputColumnName: "MonthlySales",
			},
		],
		chartType: "line",
		xAxis: { sourceColumn: "OrderMonth", displayName: "Month" },
		yAxes: [{ sourceColumn: "MonthlySales", displayName: "Sales" }],
	};

	// --- Process Suggestion 1 ---
	const chartData1 = processor.applySuggestion(suggestionSalesByMonth);
	if (chartData1) {
		console.log("Chart Data for Sales by Region:");
		console.log("Chart Type:", chartData1.chartType);
		console.log("X-Axis:", chartData1.xAxisLabel);
		console.log("Y-Axes:", chartData1.yAxisLabels);
		console.log("Matrix:", chartData1.chartMatrix);
		// Output:
		// Chart Data for Sales by Region:
		// Chart Type: bar
		// X-Axis: Region
		// Y-Axes: [ 'Total Sales' ]
		// Matrix: [
		//   [ '-', 'North', 'South', 'West' ],
		//   [ 'Total Sales', 400, 240, 200 ]
		// ]
	}
}
(() => {
	const start = Date.now();
	main();
	const end = Date.now();
	console.log(`Execution time: ${Math.ceil((end - start) / 1000)} s`);
})();
