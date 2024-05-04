import { Table, Thead, Tr, Th, Tbody, Td, Spinner, IconButton } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useEffect, useState } from "react";
import { fetchData } from "../store/slices/data.slice";
import { Select } from "chakra-react-select";
import { MdOutlineNavigateNext } from "react-icons/md";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";
import { changeSortQuery } from "../store/slices/query.slice";

const selectColumns = [
	{ value: "reponame", label: "Repository Name", key: 1, isFixed: true },
	{ value: "owner", label: "Owner", key: 2 },
	{ value: "description", label: "Description", key: 3 },
	{ value: "stars", label: "Stars", key: 4 },
	{ value: "forks", label: "Forks", key: 5 },
	{ value: "visit", label: "Visit", key: 6, isFixed: true },
];
function DataTable() {
	const query = useSelector((state: RootState) => state.query);
	const data = useSelector((state: RootState) => state.data);
	const [columns, setColumns] = useState(selectColumns);
	const dispatch = useDispatch<AppDispatch>();

	const setSortQuery = (sortBy: string) => {
		if (data.state === "loading" || data.state === "error") return;
		if (!data.data?.items || data.data.items.length === 0) return;
		if (query.sort === sortBy) {
			if (query.order === "desc") dispatch(changeSortQuery({ order: "", sort: "" }));
			else dispatch(changeSortQuery({ order: "desc", sort: sortBy }));
			return;
		}
		dispatch(changeSortQuery({ order: "asc", sort: sortBy }));
	};

	useEffect(() => {
		dispatch(fetchData(query));
	}, [dispatch, query]);

	return (
		<div className="md:px-10 px-5 md:mt-10 mt-5">
			<div className="md:w-1/2 mb-5">
				<Select
					chakraStyles={{
						control: (p) => {
							return { ...p };
						},
						dropdownIndicator: (p) => {
							return { ...p, backgroundColor: "none", paddingX: 3, fontSize: 20, background: "none" };
						},
						multiValueLabel: () => {
							return { paddingY: 2 };
						},
					}}
					options={selectColumns}
					value={columns}
					placeholder="Select some colors..."
					closeMenuOnSelect={false}
					size="sm"
					isMulti
					colorScheme="teal"
					onChange={(e) => setColumns(e.map((ele) => ele))}
					isClearable={false}
				/>
			</div>
			<div className="overflow-x-auto">
				<Table variant="simple" className="w-full">
					<Thead>
						<Tr>
							<Th>Repository Name</Th>
							{columns.includes(selectColumns[1]) && <Th>Owner</Th>}
							{columns.includes(selectColumns[2]) && <Th>Description</Th>}
							{columns.includes(selectColumns[3]) && (
								<Th className="cursor-pointer" onClick={() => setSortQuery("stars")}>
									<div className="flex justify-between">
										Stars
										{query.sort === "stars" && query.order === "asc" && (
											<TbSortAscendingNumbers size={20} className="ms-3" />
										)}
										{query.sort === "stars" && query.order === "desc" && (
											<TbSortDescendingNumbers size={20} className="ms-3" />
										)}
									</div>
								</Th>
							)}
							{columns.includes(selectColumns[4]) && (
								<Th className="cursor-pointer" onClick={() => setSortQuery("forks")}>
									<div className="flex justify-between">
										Forks
										{query.sort === "forks" && query.order === "asc" && (
											<TbSortAscendingNumbers size={20} className="ms-3" />
										)}
										{query.sort === "forks" && query.order === "desc" && (
											<TbSortDescendingNumbers size={20} className="ms-3" />
										)}
									</div>
								</Th>
							)}
							<Th>Visit</Th>
						</Tr>
					</Thead>
					<Tbody>
						{data.state === "success" && (data.data?.items?.length ?? 0) > 0 && (
							<>
								{data.data!.items.map((repo, index) => (
									<Tr key={index}>
										<Td>{repo.name}</Td>

										{columns.includes(selectColumns[1]) && <Td>{repo.owner.login}</Td>}
										{columns.includes(selectColumns[2]) && <Td>{repo.description ?? "-"}</Td>}
										{columns.includes(selectColumns[3]) && <Td>{repo.stargazers_count}</Td>}
										{columns.includes(selectColumns[4]) && <Td>{repo.forks}</Td>}
										<Td>
											<IconButton
												onClick={() => window.open(repo.html_url, "_blank")}
												aria-label="visit"
												icon={<MdOutlineNavigateNext size={30} />}
											/>
										</Td>
									</Tr>
								))}
							</>
						)}
						{data.state === "loading" && (
							<Tr>
								<Td colSpan={columns.length}>
									<div className="h-32 flex justify-center items-center w-full">
										<div>
											<Spinner size={"xl"} />
										</div>
									</div>
								</Td>
							</Tr>
						)}
						{data.state === "success" && (data.data?.items?.length ?? 0) == 0 && (
							<Tr>
								<Td colSpan={columns.length}>
									<div className="w-full">No Data Found</div>
								</Td>
							</Tr>
						)}
						{data.state === "error" && (
							<Tr>
								<Td colSpan={columns.length}>
									<div className="w-full">{data.error}</div>
								</Td>
							</Tr>
						)}
					</Tbody>
				</Table>
			</div>
		</div>
	);
}

export default DataTable;
