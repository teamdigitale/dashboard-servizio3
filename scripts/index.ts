/* eslint-disable @typescript-eslint/no-unused-vars */
import Papa from "papaparse";
import Bun from "bun";
import { D } from "@mobily/ts-belt";

// async function createChart1(rawData) {
// 	const chart1: object[] = rawData.map((i: object) => {
// 		const obj = {};
// 		obj["totale"] = i["totale"];
// 		obj["cd_intervento"] = i["cd_intervento"];
// 		return obj;
// 	});

// 	const chart1Grouped = chart1.reduce((prev, obj) => {
// 		const acc = prev as object[];
// 		const str = obj["cd_intervento"] + "";
// 		const index = acc.findIndex((i) => i["cd_intervento"] === str);
// 		if (index > -1) {
// 			const value = prev[index]["totale"];
// 			obj["totale"] += value;
// 			acc.splice(index);
// 		}
// 		acc.push(obj);
// 		return acc;
// 	}, [] as object[]);

// 	const chart1Formatted = (chart1Grouped as [object]).map((item) => {
// 		const value = Math.round(item["totale"]);
// 		return {
// 			...item,
// 			["totale"]: value,
// 		};
// 	});

// 	const chart1Data = toMatrixFormat(chart1Formatted);
// 	await writeToFile("chart1.json", JSON.stringify(chart1Data, null, 2));
// }

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
	const keys = (data[0] as string[]).map((k) =>
		k.toLowerCase().split(" ").join("-"),
	);
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

function groupByAndSum(data: object[], groupByField: string, sumField: string) {
	const grouped = data.reduce(
		(acc, item) => {
			const key = item[groupByField];
			if (!acc[key]) {
				acc[key] = 0;
			}
			acc[key] += item[sumField];
			return acc;
		},
		{} as Record<string, number>,
	);

	const result = Object.keys(grouped).map((key) => ({
		[groupByField]: key,
		[sumField]: grouped[key],
	}));

	return result;
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

	console.log("grouped  :", grouped);

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

async function chart1() {
	const sampleFile = "251024_Pagamenti_PCM_DTD_refined.csv";
	const rawData = await preprocess(sampleFile);
	console.log("rawData length:", rawData.length);
	const filtered = filterByCondition(
		rawData,
		"progetto-validato",
		(v) => v === "Si",
	);
	console.log("filtered length:", filtered.length);
	const cleaned = cleanupColumn(
		rawData,
		"pagamenti-ammessi-pnrr-per-anno",
		(v) => {
			const num = (`${v}` satisfies string)
				.replace("€", "")
				.replace(".", "")
				.replace(",", ".")
				.replace(" ", "")
				.trim();

			return Number(num);
		},
	)
		.filter((item) => !isNaN(item["pagamenti-ammessi-pnrr-per-anno"]))
		.filter((item) => item["pagamenti-ammessi-pnrr-per-anno"] > 0);
	console.log("cleaned length:", cleaned.length);
	const data = removeCols(cleaned, [
		"cup",
		"data-di-estrazione",
		"anno-pagamento",
		"progetto-validato",
		"pagamenti-totali-per-anno",
	]);
	await writeToFile("rawData.json", JSON.stringify(data.slice(-150), null, 2));
	console.log(JSON.stringify(data.slice(-5), null, 2));

	const uniq = getUniqValues(data, "codice-univoco-submisura");
	console.log(uniq);

	const aggregated = aggregate(data, "codice-univoco-submisura");
	console.log("aggregated length:", aggregated.length);
	await writeToFile(
		"costi-per-misura_pnrr.json",
		JSON.stringify(toMatrixFormat(aggregated), null, 2),
	);
}

function cleanAllFields(fields: string[], data: object[]) {
	let cleaned = data;
	fields.forEach((field) => {
		cleaned = cleanupColumn(cleaned, field, cleanupCurrency)
			.filter((item) => !isNaN(item[field]))
			.filter((item) => item[field] > 0);
		console.log(`cleaned length for field ${field}:`, cleaned.length);
	});
	return cleaned;
}

async function chart2() {
	const sampleFile = "251024_Progetti_PCM_DTD_refined.csv";
	const rawData = await preprocess(sampleFile);
	console.log("rawData length:", rawData.length);
	await writeToFile(
		"rawData.json",
		JSON.stringify(rawData.slice(-150), null, 2),
	);
	console.log(JSON.stringify(rawData.slice(-15), null, 2));
	const uniq = getUniqValues(rawData, "stato-avanzamento-progetto");
	console.log(uniq);

	// const filtered = filterByCondition(
	// 	rawData,
	// 	"progetto validato",
	// 	(v) => v === "Si",
	// );
	// console.log("filtered length:", filtered.length);

	const cleaned = cleanAllFields(
		[
			"finanziamento-pnrr",
			"finanziamento-pnc",
			"altri-fondi",
			"finanziamento-totale",
		],
		rawData,
	);

	console.log("cleaned length:", cleaned.length);
	const data = removeCols(cleaned, [
		"id-misura",
		"stato-cup",
		"stato-avanzamento-progetto",
		"cup-descrizione-natura",
		"finanziamento-totale-pubblico",
		"finanziamento-totale-pubblico-netto",
	]);

	await writeToFile("rawData.json", JSON.stringify(data.slice(-150), null, 2));

	// const aggregated = aggregate(data, "codice-univoco-misura");
	// console.log("aggregated length:", aggregated.length);
	// await writeToFile(
	// 	"costi-progetti-per-misura_pnrr.json",
	// 	JSON.stringify(toMatrixFormat(aggregated), null, 2),
	// );
}

(async () => {
	const start = Date.now();
	// await chart1(); // sottomisure e pagamenti totali del doeriodo temoprale
	await chart2(); // riportare le misure e interare i costi publici netti cpn i pagamenti  per ogni misura Finanziamento Totale Pubblico Netto

	//chart3 per ente attuatore  costi
	const elapsed = Math.ceil((Date.now() - start) / 60000);
	console.log("finished in", elapsed, "secs");
})();
