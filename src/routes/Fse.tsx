import DashChart from "../components/DashChart";

const ids: string[] = [
	"cmj8p2ni0000201fab8walcjs",
	"cmj8p3w5w000301fauxoo8q77",
	"cmj8p84c4000401fareuyqzs2",
	"cmj8p96vj000501fam0rgzn7e",
	"cmjd4bd490001bytcw7kplu1v",
	"cmjd4glgv0003bytcftfo56n6",
	"cmjd4j7vl0005bytc7e6eyjlj",
	"cmjd56jn00001jzmpr7bgn3sk",
];

function App() {
	return (
		<div>
			{/* <div className="grid grid-cols-1 gap-4 m-6 ml-2 sm:grid-cols-2 lg:grid-cols-3">
				{[1, 2, 3, 4, 5, 6].map((item) => (
					<div
						className="flex items-center justify-center w-full  h-24 bg-base-300 text-content rounded-md  shadow-md"
						key={`stat-${item}`}
					>
						<div className="text-2xl ">Stat {item}</div>
					</div>
				))}
			</div> */}
			{/* <div className="grid grid-cols-1 gap-4 m-6 ml-2 ">
				{[ids].map((item) => (
					<div
						className="flex items-center justify-center w-full  h-94 bg-base-300 text-content rounded-md  shadow-md"
						key={`fullChart-${item}`}
					>
						<DashChart id={item} />
					</div>
				))}
			</div> */}
			<div className="grid grid-cols-1 gap-4 m-6 ml-2 ">
				{ids.map((id) => (
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
