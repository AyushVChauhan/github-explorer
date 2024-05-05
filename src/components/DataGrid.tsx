import { Badge, Image, SkeletonCircle, Spinner } from "@chakra-ui/react";
import GithubRepository from "../types/github-repository.type";
import { IoMdStar } from "react-icons/io";
import { RiGitForkFill } from "react-icons/ri";

type DataGridProps = {
	data: GithubRepository[];
	state: "loading" | "success" | "error";
	error?: string;
};
function DataGrid({ data, state, error }: DataGridProps) {
	return (
		<div className="md:grid-cols-2 grid-cols-1 grid gap-5">
			{data.map((repo, index) => (
				<div key={index} className="rounded-lg border-slate-500 border p-5 overflow-hidden flex flex-col">
					<div className="flex items-center gap-x-3 w-full">
						<Image
							boxSize="30px"
							borderRadius="full"
							src={repo.owner.avatar_url}
							alt="avatar"
							fallback={<SkeletonCircle boxSize="30px" />}
						/>
						<div
							className="cursor-pointer hover:underline break-all line-clamp-1 overflow-ellipsis"
							onClick={() => window.open(repo.html_url, "_blank")}
						>
							{repo.full_name}
						</div>
						<div className="ms-auto flex gap-x-5">
							<div className="flex items-center gap-x-1">
								<IoMdStar size={15} />
								<div>
									{repo.stargazers_count > 1000
										? (repo.stargazers_count / 1000).toFixed(1) + "k"
										: repo.stargazers_count}
								</div>
							</div>
							<div className="flex items-center gap-x-1">
								<RiGitForkFill size={15} />
								<div>{repo.forks > 1000 ? (repo.forks / 1000).toFixed(1) + "k" : repo.forks}</div>
							</div>
						</div>
					</div>
					<div className="my-3">{repo.description ?? "-"}</div>
					<div className="mt-auto">
						<Badge variant="subtle" colorScheme="blue">
							{repo.language ?? "-"}
						</Badge>
					</div>
				</div>
			))}

			{state === "error" && <div className="col-span-2">{error}</div>}
			{state === "loading" && (
				<div className="col-span-2 text-center">
					<Spinner size={"xl"} />
				</div>
			)}
			{state === "success" && data.length === 0 && <div className="col-span-2">No Data Found</div>}
		</div>
	);
}

export default DataGrid;
