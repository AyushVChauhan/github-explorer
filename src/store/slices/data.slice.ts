import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import GithubResponse from "../../types/github-response.type";
import { QuerySliceType } from "./query.slice";

type DataSliceType = {
	state: "loading" | "error" | "success";
	error?: string;
	data: GithubResponse | undefined;
};

export const fetchData = createAsyncThunk("github/respository", async (query: QuerySliceType) => {
	let q = "";
	const sortQuery = `&sort=${query.sort}&order=${query.order}`;
	if (query.type === "trending") {
		if (query.search) q += query.search + " ";
		const sevenDaysBefore = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
		q += `created:>${sevenDaysBefore.getFullYear()}-${sevenDaysBefore
			.getMonth()
			.toString()
			.padStart(2, "0")}-${sevenDaysBefore.getDate().toString().padStart(2, "0")}`;
	} else {
		q += `${query.search} in:${query.type}`;
	}
	const searchQuery = encodeURI(
		`q=${q}&page=${query.page}&per_page=${query.rowsPerPage}${query.sort ? sortQuery : ""}`
	);
	const headers: { [key: string]: string } = {
		Accept: "application/vnd.github+json",
		"X-GitHub-Api-Version": "2022-11-28",
	};
	if (import.meta.env.VITE_GITHUB_TOKEN) {
		headers["Authorization"] = `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`;
	}
	const response = await fetch(`https://api.github.com/search/repositories?${searchQuery}`, {
		headers,
	});
	const json = await response.json();

	if (response.status != 200) {
		throw new Error(json.message ?? "There was an error please try again later");
	}
	return json as GithubResponse;
});

const initialState: DataSliceType = {
	state: "loading",
	error: "",
	data: undefined,
};

const dataSlice = createSlice({
	initialState,
	name: "dataSlice",
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(fetchData.pending, (state) => {
			state.state = "loading";
		});
		builder.addCase(fetchData.rejected, (state, action) => {
			state.state = "error";
			state.data = undefined;
			state.error = action.error.message;
		});
		builder.addCase(fetchData.fulfilled, (state, action) => {
			state.state = "success";
			state.error = "";
			state.data = action.payload;
		});
	},
});
export type { DataSliceType };
export default dataSlice.reducer;
