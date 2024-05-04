import { PayloadAction, createSlice } from "@reduxjs/toolkit";

type QuerySliceType = {
	search: string;
	type: string;
	sort: string;
	order: string;
	page: number;
	rowsPerPage: number;
};

const initialState: QuerySliceType = {
	search: "",
	type: "trending",
	sort: "stars",
	order: "desc",
	page: 1,
	rowsPerPage: 10,
};

const querySlice = createSlice({
	initialState,
	name: "querySlice",
	reducers: {
		changeSearchQuery: (state, action: PayloadAction<{ search: string; type: string }>) => {
			state.search = action.payload.search;
			state.type = action.payload.type;
			state.page = 1;
		},
		changeSortQuery: (state, action: PayloadAction<{ sort: string; order: string }>) => {
			state.sort = action.payload.sort;
			state.order = action.payload.order;
			state.page = 1;
		},
		changePaginationQuery: (state, action: PayloadAction<{ page: number; rowsPerPage: number }>) => {
			state.page = action.payload.page;
			state.rowsPerPage = action.payload.rowsPerPage;
		},
	},
});
export const { changeSearchQuery, changeSortQuery, changePaginationQuery } = querySlice.actions;
export type { QuerySliceType };
export default querySlice.reducer;
