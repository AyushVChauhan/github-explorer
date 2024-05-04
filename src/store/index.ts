import { configureStore } from "@reduxjs/toolkit";
import querySlice from "./slices/query.slice";
import dataSlice from "./slices/data.slice";

const store = configureStore({
	reducer: {
		query: querySlice,
		data: dataSlice,
	},
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
