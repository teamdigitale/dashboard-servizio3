import { RenderChart } from "dataviz-components";
import useSWR from "swr";

import * as api from "../lib/api";
import Loading from "./layout/Loading";

export default function DashChart({ id }: { id: string }) {
	const { data, error, isLoading } = useSWR(`${id}`, api.showChart);
	console.log({ data, error, isLoading });
	return (
		<div className="w-full h-full p-4">
			{isLoading && <Loading />}
			{error && (
				<div role="alert" className="alert alert-error">
					<span>{error.message}</span>
				</div>
			)}
			{data?.name && <h2 className="text-lg capitalize mb-4">{data.name}</h2>}
			{data && <RenderChart {...data} />}
		</div>
	);
}
