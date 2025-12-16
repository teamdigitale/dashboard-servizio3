import DashChart from "../components/DashChart";

const ids: string[] = ["cmj2ylzt1000601jksonkqt04"];

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
