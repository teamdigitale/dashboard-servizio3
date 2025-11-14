/* eslint-disable @typescript-eslint/no-unused-vars */

import { D } from "@mobily/ts-belt";
import Bun from "bun";
import Papa from "papaparse";

function slugify(text: string) {
	return text
		.toString()
		.toLowerCase()
		.replace(/\s+/g, "-") // Replace spaces with -
		.replace(/[^\w-]+/g, "") // Remove all non-word chars
		.replace(/--+/g, "-") // Replace multiple - with single -
		.replace(/^-+/, "") // Trim - from start of text
		.replace(/-+$/, ""); // Trim - from end of text
}

export function parse(data) {
	return new Promise((resolve, reject) => {
		try {
			return Papa.parse(data, {
				header: false,
				skipEmptyLines: true,
				complete: (results) => {
					resolve(results.data);
				},
			});
		} catch (error) {
			reject(error);
		}
	});
}

export async function preprocess(file: string) {
	const data = (await getOpendataFile(file)) as [[]];
	if (data.length < 2) return;
	const keys = (data[0] as string[]).map((k) => slugify(k));
	const json = data.slice(1).map((row) => {
		const pairs = keys.map((k, index) => {
			let value = row[index] || 0;
			if (!isNaN(value)) {
				value = Number(value);
			}
			return [k as string, value as number | string] as [
				string,
				number | string,
			];
		});
		const obj = D.fromPairs(pairs);
		return obj;
	});

	// console.log(json);
	return json as object[];
}

export async function getOpendataFile(fileName: string) {
	const pathname = `./data/${fileName}`;
	const data = await Bun.file(pathname).text();
	return parse(data);
}

export function filterByCondition(
	data: object[],
	prop: string,
	f: (value: string | number) => boolean,
) {
	const result = data.filter((item: object) => {
		const value = item[prop];
		return f(value);
	});
	return result;
}

export function removeCols(data: object[], toRemove: string[]) {
	return data.map((item: object) => {
		toRemove.forEach((col) => {
			delete item[col];
		});
		return item;
	});
}

export function selectCols(data: object[], keys: readonly string[]) {
	return data.map((item: object) => {
		return D.selectKeys(item, keys as readonly never[]);
	});
}

export async function writeToFile(fileName: string, data: string) {
	const pathname = `./data/${fileName}`;
	const result = await Bun.write(pathname, data);
	return result;
}

export function toMatrixFormat(data: object[]) {
	const keys = Object.keys(data[0]!);
	const rest = data.slice(1).map((i) => Object.values(i));
	return [keys, ...rest];
}

function getUniqValues(array, field) {
	const set = new Set(array.map((i) => i[field]));
	const values = [];
	for (const v of set) {
		values.push(v);
	}
	return values;
}

function cleanupColumn(
	data: object[],
	prop: string,
	f: (value: string | number) => number,
) {
	const result = data.map((item: object) => {
		item[prop] = f(item[prop]);
		return item;
	});
	return result;
}

function getUniqFieldValues(array, field) {
	return Object.keys(
		array.reduce((obj, item) => {
			const tf = item[field];
			if (!obj[tf]) {
				obj[tf] = 1;
			}
			return obj;
		}, {}),
	);
}

function aggregate(data: object[], groupByField: string) {
	const grouped = data.reduce((group, obj) => {
		const value = obj[groupByField];
		if (!group[value]) {
			group[value] = [];
		}
		group[value].push(obj);
		return group;
	}, []);

	const result = Object.values(grouped).reduce((acc, items) => {
		const aggregatedItem = { [groupByField]: items[0][groupByField] };
		const keys = Object.keys(items[0]).filter((k) => k !== groupByField);

		keys.forEach((field) => {
			if (typeof items[0][field] === "number") {
				aggregatedItem[field] = items.reduce(
					(sum, item) => sum + item[field],
					0,
				);
			} else {
				aggregatedItem[field] = items[0][field];
			}
		});
		acc.push(aggregatedItem);
		return acc;
	}, []);

	return result;
}

function cleanupCurrency(value: string | number) {
	const num = (`${value}` satisfies string)
		.replace("€", "")
		.replace(".", "")
		.replace(",", ".")
		.replace(" ", "")
		.trim();

	return Number(num);
}

function cleanCurrencyFields(fields: string[], data: object[]) {
	let cleaned = data;
	fields.forEach((field) => {
		cleaned = cleanupColumn(cleaned, field, cleanupCurrency)
			.filter((item) => !isNaN(item[field]))
			.filter((item) => item[field] >= 0);
		console.log(`cleaned length for field ${field}:`, cleaned.length);
	});
	return cleaned;
}

async function chart1() {
	const sampleFile = "251024_Pagamenti.csv";
	const rawData = await preprocess(sampleFile);

	const filtered = filterByCondition(
		rawData,
		"progetto-validato",
		(v) => v === "Si",
	);

	const cleaned = cleanCurrencyFields(
		["pagamenti-ammessi-pnrr-per-anno"],
		filtered,
	);

	const data = selectCols(cleaned, [
		"codice-univoco-submisura",
		"descrizione-submisura",
		"pagamenti-ammessi-pnrr-per-anno",
	]);

	// await writeToFile("rawData.json", JSON.stringify(data.slice(-15), null, 2));

	const uniq = getUniqValues(data, "codice-univoco-submisura");
	console.log(uniq);

	const aggregated = aggregate(data, "codice-univoco-submisura");
	// await writeToFile(
	// 	"pagamenti-per-sottomisura.json",
	// 	JSON.stringify(toMatrixFormat(aggregated), null, 2),
	// );
	return aggregated;
}
async function chart2() {
	const sampleFile = "251024_Progetti.csv";
	const rawData = await preprocess(sampleFile);
	console.log("rawData length:", rawData.length);

	const uniq = getUniqValues(rawData, "stato-avanzamento-progetto");
	console.log(uniq);

	const cleaned = cleanCurrencyFields(
		["finanziamento-totale-pubblico-netto"],
		rawData,
	);

	const data = selectCols(cleaned, [
		"codice-univoco-misura",
		"descrizione-misura",
		"codice-univoco-submisura",
		"descrizione-submisura",
		"finanziamento-totale-pubblico-netto",
	]);

	await writeToFile("rawData.json", JSON.stringify(data.slice(-15), null, 2));

	const aggregated = aggregate(data, "codice-univoco-submisura");

	// await writeToFile(
	// 	"progetti-per-sottomisura.json",
	// 	JSON.stringify(toMatrixFormat(aggregated), null, 2),
	// );
	return aggregated;
}

(async () => {
	const start = Date.now();
	const d1 = await chart1(); // sottomisure e pagamenti totali del doeriodo temoprale
	const d2 = await chart2(); // sottomisure e pagamenti totali del doeriodo temoprale
	// await chart2(); // riportare le misure e interare i costi publici netti cpn i pagamenti  per ogni misura Finanziamento Totale Pubblico Netto

	const d3 = d2.map((item) => {
		const matched = d1.find(
			(i) => i["codice-univoco-submisura"] === item["codice-univoco-submisura"],
		);
		return D.merge(matched || {}, item);
	});

	await writeToFile("rawData.json", JSON.stringify(d3, null, 2));

	//chart3 per ente attuatore  costi
	const elapsed = Math.ceil((Date.now() - start) / 60000);
	console.log("finished in", elapsed, "secs");
})();
