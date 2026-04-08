import { RenderChart } from "dataviz-components";
import { useMemo } from "react";

type SnapshotRow = {
	regione: string;
	"indicatori-target-raggiunti": number | "";
	"indicatori-rischio": string;
};

function countTargetsMet(value: number | ""): number {
	if (value === "" || value == null) return 0;
	return String(value).length;
}

function buildMapMatrix(rows: SnapshotRow[]): (string | number)[][] {
	const header: (string | number)[] = ["Regione", "Target raggiunti"];
	const body: (string | number)[][] = rows
		.filter((r) => r.regione !== "ITALIA")
		.map((r) => [r.regione, countTargetsMet(r["indicatori-target-raggiunti"])]);
	return [header, ...body];
}

export default function FseRegionMap({
	rows,
	id,
}: {
	rows: SnapshotRow[];
	id: string;
}) {
	const matrix = useMemo(() => buildMapMatrix(rows), [rows]);

	const config = {
		colors: ["#dc3545", "#f59e0b", "#fbbf24", "#84cc16", "#16a34a"],
		direction: "",
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
		responsive: true,
		geoJsonUrl: "/geo/italia-territori.geojson",
		nameProperty: "reg_name",
		serieName: "Indicatori al target",
		visualMap: true,
		visualMapLeft: "left",
		visualMapOrient: "vertical",
		showMapLabels: false,
		areaColor: "#e5e7eb",
	};

	return (
		<RenderChart
			id={id}
			chart="map"
			config={config}
			data={matrix}
			dataSource={null}
		/>
	);
}
