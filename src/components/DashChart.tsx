import { RenderChart } from "dataviz-components";
import * as api from "../lib/api";
import useSWR from "swr";
import Loading from "./layout/Loading";

export default function DashChart({ id }: { id: string }) {
  const { data, error, isLoading } = useSWR(`${id}`, api.showChart);
  console.log({ data, error, isLoading });
  return (
    <div className='w-full h-full'>
      {isLoading && <Loading />}
      {error && (
        <div role='alert' className='alert alert-error'>
          <span>{error.message}</span>
        </div>
      )}
      {data && <RenderChart {...data} />}
    </div>
  );
}
