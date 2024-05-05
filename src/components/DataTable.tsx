import {
	Table,
	Thead,
	Tr,
	Th,
	Tbody,
	Td,
	Spinner,
	IconButton,
	Image,
	SkeletonCircle,
	Input,
	InputGroup,
	InputLeftElement,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchData } from "../store/slices/data.slice";
import { Select } from "chakra-react-select";
import { MdOutlineNavigateNext } from "react-icons/md";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";
import { changeSortQuery } from "../store/slices/query.slice";
import { IoIosSearch } from "react-icons/io";

const selectColumns = [
	{ value: "reponame", label: "Repository Name", key: 0, isFixed: true },
	{ value: "owner", label: "Owner", key: 1 },
	{ value: "description", label: "Description", key: 2 },
	{ value: "stars", label: "Stars", key: 3 },
	{ value: "forks", label: "Forks", key: 4 },
	{ value: "visit", label: "Visit", key: 5, isFixed: true },
	{ value: "avatar_url", label: "Avatar", key: 6 },
	{ value: "created_at", label: "Created At", key: 7 },
	{ value: "updated_at", label: "Updated At", key: 8 },
];
function DataTable() {
	const query = useSelector((state: RootState) => state.query);
	const data = useSelector((state: RootState) => state.data);
	const [columns, setColumns] = useState(selectColumns);
	const [filter, setFilter] = useState("");
	const dispatch = useDispatch<AppDispatch>();

	const setSortQuery = useCallback(
		(sortBy: string) => {
			if (data.state === "loading" || data.state === "error") return;
			if (!data.data?.items || data.data.items.length === 0) return;
			if (query.sort === sortBy) {
				if (query.order === "desc") dispatch(changeSortQuery({ order: "", sort: "" }));
				else dispatch(changeSortQuery({ order: "desc", sort: sortBy }));
				return;
			}
			dispatch(changeSortQuery({ order: "asc", sort: sortBy }));
		},
		[data, dispatch, query]
	);

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
				<div className="md:flex-[1]">
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
				</div>
				<div className="md:flex-[2]">
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
			</div>
			<div className="overflow-x-auto">
				<Table variant="simple" className="w-full">
					<Thead>
						<Tr>
							{columns.includes(selectColumns[6]) && <Th>Avatar</Th>}
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
							{columns.includes(selectColumns[7]) && <Th>Created At</Th>}
							{columns.includes(selectColumns[8]) && <Th>Updated At</Th>}

							<Th>Visit</Th>
						</Tr>
					</Thead>
					<Tbody>
						{data.state === "success" && filteredRecords.length > 0 && (
							<>
								{filteredRecords.map((repo, index) => (
									<Tr key={index}>
										{columns.includes(selectColumns[6]) && (
											<Th>
												<Image
													boxSize="30px"
													borderRadius="full"
													src={repo.owner.avatar_url}
													alt="avatar"
													fallback={<SkeletonCircle boxSize="30px" />}
												/>
											</Th>
										)}
										<Td>{repo.name}</Td>
										{columns.includes(selectColumns[1]) && <Td>{repo.owner.login}</Td>}
										{columns.includes(selectColumns[2]) && <Td>{repo.description ?? "-"}</Td>}
										{columns.includes(selectColumns[3]) && <Td>{repo.stargazers_count}</Td>}
										{columns.includes(selectColumns[4]) && <Td>{repo.forks}</Td>}
										{columns.includes(selectColumns[7]) && (
											<Td>{new Date(repo.created_at).toLocaleDateString()}</Td>
										)}
										{columns.includes(selectColumns[8]) && (
											<Td>{new Date(repo.updated_at).toLocaleDateString()}</Td>
										)}
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
						{data.state === "success" && filteredRecords.length === 0 && (
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
