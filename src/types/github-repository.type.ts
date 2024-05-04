import GithubRepositoryOwner from "./github-repository-owner.type";

type GithubRepository = {
	id: number;
	node_id: string;
	name: string;
	full_name: string;
	owner: GithubRepositoryOwner;
	url: string;
	html_url: string;
	description?: string;
	private: boolean;
	created_at: string;
	updated_at: string;
	size: number;
	language?: string;
	stargazers_count: number;
	forks: number;
};
export default GithubRepository;
