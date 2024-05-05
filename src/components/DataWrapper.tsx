import { IconButton, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useMemo, useState } from "react";
import { fetchData } from "../store/slices/data.slice";
import { Select } from "chakra-react-select";
import { IoIosSearch } from "react-icons/io";
import DataTable from "./DataTable";
import { LuLayoutGrid } from "react-icons/lu";
import { IoList } from "react-icons/io5";
import DataGrid from "./DataGrid";

const selectColumns = [
	// { value: "reponame", label: "Repository Name", key: 0, isFixed: true },
	{ value: "owner", label: "Owner", key: 1 },
	{ value: "description", label: "Description", key: 2 },
	{ value: "stars", label: "Stars", key: 3 },
	{ value: "forks", label: "Forks", key: 4 },
	// { value: "visit", label: "Visit", key: 5, isFixed: true },
	{ value: "avatar_url", label: "Avatar", key: 6 },
	{ value: "created_at", label: "Created At", key: 7 },
	{ value: "updated_at", label: "Updated At", key: 8 },
	{ value: "language", label: "Language", key: 9 },
	{ value: "size", label: "Size", key: 10 },
];
function DataTableFilters() {
	const query = useSelector((state: RootState) => state.query);
	const data = useSelector((state: RootState) => state.data);
	const dispatch = useDispatch<AppDispatch>();
	const [columns, setColumns] = useState(selectColumns);
	const [filter, setFilter] = useState("");
	const [gridType, setGridType] = useState<"list" | "grid">("list");

	useEffect(() => {
		dispatch(fetchData(query));
	}, [dispatch, query]);

	const filteredRecords = useMemo(() => {
		if (data.state === "loading" || !data.data?.items || data.data.items.length === 0) return [];
		return data.data.items.filter((repo) => repo.name.toUpperCase().includes(filter.toUpperCase()));
	}, [data, filter]);

	return (
		<div className="md:px-10 px-5 md:mt-10 mt-5">
			<div className="flex md:flex-row flex-col-reverse gap-5 mb-5">
				<div className="md:flex-[1] flex gap-x-3">
					<InputGroup>
						<InputLeftElement pointerEvents="none">
							<IoIosSearch />
						</InputLeftElement>
						<Input
							placeholder="Filter this page"
							type="text"
							value={filter}
							onChange={(e) => setFilter(e.target.value)}
						/>
					</InputGroup>
					<div className="md:hidden gap-x-2 flex">
						<IconButton
							colorScheme={gridType === "list" ? "teal" : "gray"}
							aria-label="list"
							icon={<IoList size={25} />}
							onClick={() => setGridType("list")}
						/>
						<IconButton
							colorScheme={gridType === "grid" ? "teal" : "gray"}
							aria-label="grid"
							icon={<LuLayoutGrid size={25} />}
							onClick={() => setGridType("grid")}
						/>
					</div>
				</div>
				<div className="md:flex-[2] flex gap-x-3 justify-between">
					{gridType === "list" && (
						<Select
							chakraStyles={{
								control: (p) => {
									return { ...p, height: "100%", rounded: 5, minH: "40px" };
								},
								dropdownIndicator: (p) => {
									return {
										...p,
										backgroundColor: "none",
										paddingX: 3,
										fontSize: 20,
										background: "none",
									};
								},
								multiValueLabel: () => {
									return { paddingY: 2 };
								},
							}}
							options={selectColumns}
							value={columns}
							placeholder="Select columns"
							closeMenuOnSelect={false}
							size="sm"
							isMulti
							colorScheme="teal"
							onChange={(e) => setColumns(e.map((ele) => ele))}
							className="w-full"
						/>
					)}
					<div className="md:flex gap-x-2 hidden ms-auto">
						<IconButton
							colorScheme={gridType === "list" ? "teal" : "gray"}
							aria-label="list"
							icon={<IoList size={25} />}
							onClick={() => setGridType("list")}
						/>
						<IconButton
							colorScheme={gridType === "grid" ? "teal" : "gray"}
							aria-label="grid"
							icon={<LuLayoutGrid size={25} />}
							onClick={() => setGridType("grid")}
						/>
					</div>
				</div>
			</div>
			{gridType === "list" && (
				<DataTable
					columns={columns.map((ele) => ele.value)}
					data={filteredRecords}
					state={data.state}
					error={data.error}
				/>
			)}
			{gridType === "grid" && <DataGrid data={filteredRecords} state={data.state} error={data.error} />}
		</div>
	);
}

export default DataTableFilters;
