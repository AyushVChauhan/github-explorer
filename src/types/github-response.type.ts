import GithubRepository from "./github-repository.type";

type GithubResponse = {
	total_count: number;
	incomplete_result: boolean;
	items: GithubRepository[];
};

export default GithubResponse;
