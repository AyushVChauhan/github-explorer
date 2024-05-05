import { Badge, IconButton, Image, SkeletonCircle, Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import GithubRepository from "../types/github-repository.type";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { useCallback } from "react";
import { changeSortQuery } from "../store/slices/query.slice";
import { TbSortAscendingNumbers, TbSortDescendingNumbers } from "react-icons/tb";
import { MdOutlineNavigateNext } from "react-icons/md";

type DataTableProps = {
	columns: string[];
	data: GithubRepository[];
	state: "loading" | "success" | "error";
	error?: string;
};
function DataTable({ columns, data, state, error }: DataTableProps) {
	const query = useSelector((state: RootState) => state.query);
	const dispatch = useDispatch<AppDispatch>();

	const setSortQuery = useCallback(
		(sortBy: string) => {
			if (state === "loading" || state === "error") return;
			if (data.length === 0) return;
			if (query.sort === sortBy) {
				if (query.order === "desc") dispatch(changeSortQuery({ order: "", sort: "" }));
				else dispatch(changeSortQuery({ order: "desc", sort: sortBy }));
				return;
			}
			dispatch(changeSortQuery({ order: "asc", sort: sortBy }));
		},
		[data, dispatch, query, state]
	);
	return (
		<div className="overflow-x-auto">
			<Table variant="simple" className="w-full">
				<Thead>
					<Tr>
						{columns.includes("avatar_url") && <Th>Avatar</Th>}
						<Th>Repository Name</Th>
						{columns.includes("owner") && <Th>Owner</Th>}
						{columns.includes("language") && <Th>Language</Th>}
						{columns.includes("description") && <Th>Description</Th>}
						{columns.includes("stars") && (
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
						{columns.includes("forks") && (
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
						{columns.includes("size") && <Th>Size</Th>}
						{columns.includes("created_at") && <Th>Created At</Th>}
						{columns.includes("updated_at") && (
							<Th className="cursor-pointer" onClick={() => setSortQuery("updated")}>
								<div className="flex justify-between">
									Updated At
									{query.sort === "updated" && query.order === "asc" && (
										<TbSortAscendingNumbers size={20} className="ms-3" />
									)}
									{query.sort === "updated" && query.order === "desc" && (
										<TbSortDescendingNumbers size={20} className="ms-3" />
									)}
								</div>
							</Th>
						)}
						<Th>Visit</Th>
					</Tr>
				</Thead>
				<Tbody>
					{state === "success" && data.length > 0 && (
						<>
							{data.map((repo, index) => (
								<Tr key={index}>
									{columns.includes("avatar_url") && (
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
									{columns.includes("owner") && <Td>{repo.owner.login}</Td>}
									{columns.includes("language") && (
										<Td>
											<Badge variant="subtle" colorScheme="blue">
												{repo.language ?? "-"}
											</Badge>
										</Td>
									)}
									{columns.includes("description") && <Td>{repo.description ?? "-"}</Td>}
									{columns.includes("stars") && (
										<Td>
											{repo.stargazers_count > 1000
												? (repo.stargazers_count / 1000).toFixed(1) + "k"
												: repo.stargazers_count}
										</Td>
									)}
									{columns.includes("forks") && (
										<Td>{repo.forks > 1000 ? (repo.forks / 1000).toFixed(1) + "k" : repo.forks}</Td>
									)}
									{columns.includes("size") && <Td>{(repo.size / 1000).toFixed(2)}MB</Td>}
									{columns.includes("created_at") && (
										<Td>{new Date(repo.created_at).toLocaleDateString()}</Td>
									)}
									{columns.includes("updated_at") && (
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

					{state === "loading" && (
						<Tr>
							<Td colSpan={columns.length + 2}>
								<div className="h-32 flex justify-center items-center w-full">
									<div>
										<Spinner size={"xl"} />
									</div>
								</div>
							</Td>
						</Tr>
					)}

					{state === "success" && data.length === 0 && (
						<Tr>
							<Td colSpan={columns.length + 2}>
								<div className="w-full">No Data Found</div>
							</Td>
						</Tr>
					)}

					{state === "error" && (
						<Tr>
							<Td colSpan={columns.length + 2}>
								<div className="w-full">{error}</div>
							</Td>
						</Tr>
					)}
				</Tbody>
			</Table>
		</div>
	);
}

export default DataTable;
