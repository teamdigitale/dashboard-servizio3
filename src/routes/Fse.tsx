import { useState } from "react";
import DashChart from "../components/DashChart";

const idMaps: string[] = [
	"cmjd4bd490001bytcw7kplu1v",
	"cmjd4glgv0003bytcftfo56n6",
	"cmjd4j7vl0005bytc7e6eyjlj",
	"cmjd56jn00001jzmpr7bgn3sk",
];
const idPies: string[] = [
	"cmj8p2ni0000201fab8walcjs",
	"cmj8p3w5w000301fauxoo8q77",
	"cmj8p84c4000401fareuyqzs2",
	"cmj8p96vj000501fam0rgzn7e",
];

type chartType = {
	id: string;
	name: string;
	description: string;
	content: string;
	pie: string;
	map: string;
};

const groups: chartType[] = [
	{
		id: "primo",
		name: "Indicatore 1",
		description: "N° Documenti indicizzati / N° prestazioni erogate",
		content: `
		<p>
		<h3>Media Nazionale</h3>
		<p>Ultima rilevazione: settembre 2025</p>
		<br/>
		<b>Numeratore</b>
		Somma del numero di documenti di:
		<ul>
		<li>Referto di Medicina di Laboratorio</li>
		<li>Referto di Radiologia</li>
		<li>Verbale di Pronto Soccorso</li>
		<li>Lettera di Dimissione</li>
		<li>Referto di Specialistica Ambulatoriale</li>
		<li>Referto di Anatomia Patologica</li>
		</ul>
		<b>Denominatore</b>
		Somma di:
		<ul>
		</p>
		<p>
		<li>Prestazioni di Laboratorio</li>
		<li>Prestazioni di Radiologia</li>
		<li>Accessi al Pronto Soccorso</li>
		<li>Numero di ricoveri</li>
		<li>Prestazioni di Ambulatoriale</li>
		<li>Prestazioni di Anatomia Patologica</li>
		</ul>
		</p>
		`,
		pie: idPies[0],
		map: idMaps[0],
	},
	{
		id: "secondo",
		name: "Indicatore 2",
		description: "N° MMG/PLS che alimentano il FSE /N° MMG/PLS totali",
		content: `
		<p>
		<h3>Media Nazionale</h3>
		<p>Ultima rilevazione: settembre 2025</p>
		<br/>
		<b>Numeratore</b>
		<ul>
		<li>Numero di operatori con ruolo MMG-PLS che hanno invitato o sono firmatari di documenti in formato pdf con CDA2 iniettato e firmato, oppure che hanno correttamente conferito ricette dematerializzate al SAC</li>
		</ul>
		<b>Denominatore</b>
		<ul>
		</p>
		<p>
		<li>Numeri di  MMG-PLS totali</li>
		</ul>
		</p>
		`,
		pie: idPies[1],
		map: idMaps[1],
	},
	{
		id: "terzo",
		name: "Indicatore 3",
		description: "N. Documenti CDA2 / N. Documenti indicizzati",
		content: `
		<p>
		<h3>Media Nazionale</h3>
		<p>Ultima rilevazione: settembre 2025</p>
		<br/>
		<b>Numeratore</b>
		Somma del numero di documenti in formato pdf con CDA2 iniettato di tipo:
		<ul>
		<li>Referto di Medicina di Laboratorio</li>
		<li>Referto di Radiologia</li>
		<li>Verbale di Pronto Soccorso</li>
		<li>Lettera di Dimissione</li>
		<li>Referto di Specialistica Ambulatoriale</li>
		<li>Referto di Anatomia Patologica</li>
		</ul>
		<b>Denominatore</b>
		Somma di tutti i documenti firmati e non di tipo	:
		<ul>
		</p>
		<p>
		<li>Prestazioni di Laboratorio</li>
		<li>Prestazioni di Radiologia</li>
		<li>Accessi al Pronto Soccorso</li>
		<li>Numero di ricoveri</li>
		<li>Prestazioni di Ambulatoriale</li>
		<li>Prestazioni di Anatomia Patologica</li>
		</ul>
		</p>
		`,
		pie: idPies[2],
		map: idMaps[2],
	},
	{
		id: "quarto",
		name: "Indicatore 4",
		description: "N. Documenti firmati in PAdES / N. Documenti indicizzati",
		content: `
		<p>
		<h3>Media Nazionale</h3>
		<p>Ultima rilevazione: settembre 2025</p>
		<br/>
		<b>Numeratore</b>
		Somma del numero di documenti in formato pdf con CDA2 iniettato e firmato di tipo:
		<ul>
		<li>Referto di Medicina di Laboratorio</li>
		<li>Referto di Radiologia</li>
		<li>Verbale di Pronto Soccorso</li>
		<li>Lettera di Dimissione</li>
		<li>Referto di Specialistica Ambulatoriale</li>
		<li>Referto di Anatomia Patologica</li>
		</ul>
		<b>Denominatore</b>
		Somma di tutti i documenti firmati e non di tipo	:
		<ul>
		</p>
		<p>
		<li>Prestazioni di Laboratorio</li>
		<li>Prestazioni di Radiologia</li>
		<li>Accessi al Pronto Soccorso</li>
		<li>Numero di ricoveri</li>
		<li>Prestazioni di Ambulatoriale</li>
		<li>Prestazioni di Anatomia Patologica</li>
		</ul>
		</p>
		`,
		pie: idPies[3],
		map: idMaps[3],
	},
];

function App() {
	function handleSelect(value: string) {
		console.log("Selected indicator:", value);
		// Implement further logic based on the selected indicator
		setSelected(value);
	}
	const [selected, setSelected] = useState<string>();
	const choosen = groups.find((g) => g.id === selected);
	return (
		<div>
			<select
				className="select select-bordered w-full max-w-xs m-6 ml-2"
				onChange={(e) => handleSelect(e.target.value)}
			>
				<option value="">Seleziona un Indicatore</option>
				{groups.map((group) => (
					<option key={group.name} value={group.id}>
						{group.name}
					</option>
				))}
			</select>

			{choosen && (
				<div className="w-full p-6 flex flex-col">
					<h2 className="text-xl font-bold mb-2">
						{(choosen as chartType).name}
					</h2>
					<p className="text-gray-600 mb-4">
						{(choosen as chartType).description}
					</p>
					<div className="grid grid-cols-6 gap-4">
						<div className="flex items-center justify-center w-full min-h-94 bg-base-300 text-content rounded-md  shadow-md col-span-4">
							<div className="shrink-0 w-1/2">
								<DashChart id={(choosen as chartType).pie} />
							</div>
							<div className="shrink-0 w-1/2">
								<div className="text-content p-4 ">
									<div
										className="prose text-xs"
										dangerouslySetInnerHTML={{
											__html: (choosen as chartType).content,
										}}
									/>
								</div>
							</div>
						</div>
						<div className="flex ids-center justify-center w-full min-h-94 bg-base-300 text-content rounded-md  shadow-md col-span-2">
							<DashChart id={(choosen as chartType).map} />
						</div>
					</div>
				</div>
			)}

			{/* <div className="grid grid-cols-2 gap-4 m-6 ml-2 ">
				{idPies.map((item) => (
					<div
						className="flex items-center justify-center w-full  h-94 bg-base-300 text-content rounded-md  shadow-md"
						key={`fullChart-${item}`}
					>
						<DashChart id={item} />{" "}
						<div
							className="flex items-center justify-center w-full  h-24 bg-base-300 text-contents"
							key={`stat-${item}`}
						>
							<div className="text-2xl ">
								<ul>
									<li>Metric A: 123</li>
									<li>Metric B: 456</li>
									<li>Metric C: 789</li>
								</ul>
							</div>
						</div>
					</div>
				))}
			</div>
			<div className="grid grid-cols-2 gap-4 m-6 ml-2 ">
				{idMaps.map((id) => (
					<div
						className="flex ids-center justify-center w-full min-h-44 bg-base-300 text-content rounded-md  shadow-md"
						key={`Chart-${id}`}
					>
						<DashChart id={id} />
					</div>
				))}
			</div> */}
		</div>
	);
}

export default App;
