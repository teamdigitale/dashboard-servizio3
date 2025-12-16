import type { Filter } from "../lib/utils";

export default function FilterValues(
	cols: string[],
	filters: Filter[],
	handleChange: (filters: Filter[]) => void,
) {
	function handleAddFilter(e: FormDataEvent) {
		console.log("formdata", e.formData);
		const data = e.formData;
		if (!data) return;

		const obj = {
			key: data.get("key"),
			conditionType: data.get("conditionType"),
			value: data.get("value"),
		};
		console.log("obj", obj);
		// filters.push(obj);
		// return handleChange(filters);
	}
	function removeFilter(index: number) {
		filters.splice(index, 1);
		return handleChange(filters);
	}
	const kinds = ["equals", "greaterThan", "lessThan"];
	return (
		<div className="m-10 p-10">
			{filters?.map((f, index) => (
				<div key={f.value}>
					<span>value of {f.key}</span>
					<span>{f.conditionType}</span>
					<span>{f.value}</span>
					<button
						type="button"
						className="btn btn-md"
						onClick={() => removeFilter(index)}
					>
						x
					</button>
				</div>
			))}

			<form onSubmit={(e) => handleAddFilter(e)}>
				<div className="flex">
					<select name="key" required>
						<option value="">-</option>
						{cols.map((n: string) => (
							<option value={n} key={n}>
								{n}
							</option>
						))}
					</select>
					<select name="kind" required>
						<option value="">-</option>
						{kinds.map((n: string) => (
							<option value={n} key={n}>
								{n}
							</option>
						))}
					</select>
					<input name="value" value="" required />
					<button type="submit" className="btn btn-md">
						add filter
					</button>
				</div>
			</form>
		</div>
	);
}
