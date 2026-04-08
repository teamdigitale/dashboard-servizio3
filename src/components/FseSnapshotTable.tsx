import { DataTable } from "dataviz-components";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import FseRegionMap from "./FseRegionMap";

const numberFormatter = new Intl.NumberFormat("it-IT");

type SnapshotRow = {
	regione: string;
	"indicatore-1": number | "";
	"indicatore-2": number | "";
	"indicatore-3": number | "";
	"indicatore-4": number | "";
	"indicatori-target-raggiunti": number | "";
	"indicatori-rischio": string;
};

type Snapshot = {
	date: string;
	rows: SnapshotRow[];
};

const HEADERS = [
	"Regione",
	"Indicatore 1",
	"Indicatore 2",
	"Indicatore 3",
	"Indicatore 4",
	"Target raggiunti",
	"Rischio",
] as const;

const TARGET_COLUMN_ID = HEADERS[5];

const snapshotModules = import.meta.glob<{ default: SnapshotRow[] }>(
	"../data/fse_snapshots/FSE_*_Tabella_riassuntiva_*.json",
	{ eager: true },
);

const snapshots: Snapshot[] = Object.entries(snapshotModules)
	.map(([path, mod]) => {
		const match = path.match(/FSE_(\d{4}-\d{2}-\d{2})_/);
		return {
			date: match ? match[1] : path,
			rows: mod.default,
		};
	})
	.sort((a, b) => b.date.localeCompare(a.date));

function rowToMatrixRow(row: SnapshotRow): (string | number)[] {
	return [
		row.regione,
		row["indicatore-1"],
		row["indicatore-2"],
		row["indicatore-3"],
		row["indicatore-4"],
		row["indicatori-target-raggiunti"],
		row["indicatori-rischio"],
	];
}

function buildMatrix(snapshot: Snapshot): (string | number)[][] {
	return [HEADERS.slice(), ...snapshot.rows.map(rowToMatrixRow)];
}

function formatTargetRaggiunti(value: unknown): string {
	if (value === "" || value == null) return "—";
	return String(value).split("").join(", ");
}

export default function FseSnapshotTable() {
	const [selectedDate, setSelectedDate] = useState<string>(
		snapshots[0]?.date ?? "",
	);

	const selected = useMemo(
		() => snapshots.find((s) => s.date === selectedDate) ?? snapshots[0],
		[selectedDate],
	);

	const matrix = useMemo(
		() => (selected ? buildMatrix(selected) : []),
		[selected],
	);

	if (!selected) {
		return (
			<div role="alert" className="alert alert-warning">
				<span>Nessuno snapshot FSE disponibile.</span>
			</div>
		);
	}

	return (
		<div className="w-full p-6 flex flex-col gap-4">
			<div className="flex items-center gap-4">
				<h2 className="text-xl font-bold">Tabella riassuntiva FSE</h2>
				<select
					className="select select-bordered"
					value={selectedDate}
					onChange={(e) => setSelectedDate(e.target.value)}
				>
					{snapshots.map((s) => (
						<option key={s.date} value={s.date}>
							{s.date}
						</option>
					))}
				</select>
			</div>

			<div className="bg-base-300 rounded-md shadow-md p-4 min-h-[600px]">
				<h3 className="text-lg font-semibold mb-2">
					Indicatori per regione — target raggiunti
				</h3>
				<FseRegionMap
					id={`fse-map-${selected.date}`}
					rows={selected.rows}
				/>
			</div>

			<DataTable
				id={`fse-snapshot-${selected.date}`}
				data={matrix}
				showFilters
				enableExportCsv
				formatValue={(value, ctx) => {
					if (ctx.columnId === TARGET_COLUMN_ID) {
						return formatTargetRaggiunti(value);
					}
					if (typeof value === "number") {
						return numberFormatter.format(value);
					}
					return (value ?? "") as ReactNode;
				}}
			/>
		</div>
	);
}
