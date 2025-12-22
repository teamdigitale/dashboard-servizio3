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
		description: "Descrizione dell'indicatore 1",
		content: "contents",
		pie: idPies[0],
		map: idMaps[0],
	},
	{
		id: "secondo",
		name: "Indicatore 2",
		description: "Descrizione dell'indicatore 2",
		content: "contents",
		pie: idPies[1],
		map: idMaps[1],
	},
	{
		id: "terzo",
		name: "Indicatore 3",
		description: "Descrizione dell'indicatore 3",
		content: "contents",
		pie: idPies[2],
		map: idMaps[2],
	},
	{
		id: "quarto",
		name: "Indicatore 4",
		description: "Descrizione dell'indicatore 4",
		content: "contents",
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
					<div className="grid grid-cols-4 gap-4">
						<div className="flex items-center justify-center w-full min-h-94 bg-base-300 text-content rounded-md  shadow-md col-span-3">
							<div className="shrink-0 w-1/2">
								<DashChart id={(choosen as chartType).pie} />
							</div>
							<div className="shrink-0 w-1/2">
								<div
									className="text-md p-4"
									dangerouslySetInnerHTML={{
										__html: (choosen as chartType).content,
									}}
								/>
							</div>
						</div>
						<div className="flex ids-center justify-center w-full min-h-94 bg-base-300 text-content rounded-md  shadow-md">
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
