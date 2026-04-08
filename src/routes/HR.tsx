import { RenderChart } from "dataviz-components";
import { useMemo } from "react";
import hrData from "../data/hr.json";

type HrRow = {
	insieme: string;
	tipologia: string;
	contingente: string;
	numero: number;
};

const TIPOLOGIE_ORDER = [
	"ESPERTI",
	"PERSONALE DI RUOLO E DIRIGENTI",
	"PERSONALE IN COMANDO",
	"ALTRO",
] as const;

const MAX_LABEL_LENGTH = 36;

function shortenContingente(label: string): string {
	const cleaned = label
		.replace(/\s*\(.*?\)\s*/g, " ")
		.replace(/\*+$/, "")
		.replace(/\s+/g, " ")
		.trim();
	if (cleaned.length <= MAX_LABEL_LENGTH) return cleaned;
	return `${cleaned.slice(0, MAX_LABEL_LENGTH - 1).trimEnd()}…`;
}

function buildContingenteMatrix(rows: HrRow[]): (string | number)[][] {
	const sorted = [...rows].sort((a, b) => b.numero - a.numero);
	const header: (string | number)[] = [
		"Contingente",
		...sorted.map((r) => shortenContingente(r.contingente)),
	];
	const series: (string | number)[] = [
		"Personale",
		...sorted.map((r) => r.numero),
	];
	return [header, series];
}

function buildTipologiaMatrix(rows: HrRow[]): (string | number)[][] {
	const totals = new Map<string, number>();
	for (const row of rows) {
		totals.set(row.tipologia, (totals.get(row.tipologia) ?? 0) + row.numero);
	}
	const header: (string | number)[] = ["Tipologia", "Numero"];
	const body: (string | number)[][] = TIPOLOGIE_ORDER.filter((t) =>
		totals.has(t),
	).map((t) => [t, totals.get(t) ?? 0]);
	return [header, ...body];
}

export default function HR() {
	const rows = hrData as HrRow[];

	const totale = useMemo(
		() => rows.reduce((acc, r) => acc + r.numero, 0),
		[rows],
	);

	const contingenteData = useMemo(() => buildContingenteMatrix(rows), [rows]);
	const tipologiaData = useMemo(() => buildTipologiaMatrix(rows), [rows]);

	const barConfig = {
		colors: [],
		direction: "horizontal",
		h: 560,
		labeLine: false,
		legend: false,
		legendPosition: "bottom",
		palette: "",
		tooltip: true,
		tooltipFormatter: "",
		valueFormatter: "",
		totalLabel: "",
		tooltipTrigger: "item",
		xLabel: "",
		yLabel: "",
		responsive: true,
		gridLeft: 240,
		gridRight: 40,
		gridBottom: 30,
		gridTop: 30,
	};

	const pieConfig = {
		colors: [],
		direction: "",
		h: 480,
		labeLine: true,
		legend: true,
		legendPosition: "bottom",
		palette: "",
		tooltip: true,
		tooltipFormatter: "",
		valueFormatter: "",
		totalLabel: "Totale",
		tooltipTrigger: "item",
		responsive: true,
		showPieLabels: true,
	};

	return (
		<div className="p-6 flex flex-col gap-6">
			<header className="flex items-baseline gap-4">
				<h1 className="text-2xl font-bold">HR</h1>
				<span className="text-base-content/70">
					Totale personale: <b>{totale}</b>
				</span>
			</header>

			<section className="flex flex-col gap-4">
				<div className="bg-base-300 rounded-md shadow-md p-4 min-h-[600px]">
					<h2 className="text-lg font-semibold mb-2">
						Personale per contingente
					</h2>
					<RenderChart
						chart="bar"
						config={barConfig}
						data={contingenteData}
						dataSource={null}
					/>
				</div>

				<div className="bg-base-300 rounded-md shadow-md p-4 min-h-[520px]">
					<h2 className="text-lg font-semibold mb-2">
						Distribuzione per tipologia
					</h2>
					<RenderChart
						chart="pie"
						config={pieConfig}
						data={tipologiaData}
						dataSource={null}
					/>
				</div>
			</section>
		</div>
	);
}
