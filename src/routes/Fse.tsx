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

const groups = [
	{
		name: "Indicatore 1",
		description: "Descrizione dell'indicatore 1",
		content: "contents",
		pie: idPies[0],
		map: idMaps[0],
	},
	{
		name: "Indicatore 2",
		description: "Descrizione dell'indicatore 2",
		content: "contents",
		pie: idPies[1],
		map: idMaps[1],
	},
	{
		name: "Indicatore 3",
		description: "Descrizione dell'indicatore 3",
		content: "contents",
		pie: idPies[2],
		map: idMaps[2],
	},
	{
		name: "Indicatore 4",
		description: "Descrizione dell'indicatore 4",
		content: "contents",
		pie: idPies[3],
		map: idMaps[3],
	},
];

function App() {
	return (
		<div>
			<div className="grid grid-cols-2 gap-4 m-6 ml-2 ">
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
			</div>
		</div>
	);
}

export default App;
