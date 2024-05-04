import { IconButton, Select, useToast } from "@chakra-ui/react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";
import { BiFirstPage, BiLastPage } from "react-icons/bi";
import { changePaginationQuery } from "../store/slices/query.slice";
import { useState } from "react";
// import { useState } from "react";

function Pagination() {
	const data = useSelector((state: RootState) => state.data);
	const query = useSelector((state: RootState) => state.query);

	const dispatch = useDispatch<AppDispatch>();
	const toast = useToast({ position: "top-right" });
	const [rowsPerPage, setRowsPerPage] = useState(query.rowsPerPage);
	const isFirstPage = query.page === 1;
	const isLastPage = query.page * query.rowsPerPage >= (data.data?.total_count ?? 0);

	const handleFirstPageClick = () => {
		if (!isFirstPage && !(data.state === "loading")) {
			dispatch(changePaginationQuery({ page: 1, rowsPerPage: rowsPerPage }));
		}
	};

	const handlePreviousPageClick = () => {
		if (!isFirstPage && !(data.state === "loading")) {
			dispatch(changePaginationQuery({ page: query.page - 1, rowsPerPage: rowsPerPage }));
		}
	};

	const handleNextPageClick = () => {
		if (!isLastPage && !(data.state === "loading")) {
			if ((query.page + 1) * query.rowsPerPage > 1000) {
				toast({ title: "You can only see first 1000 records" });
				return;
			}
			dispatch(changePaginationQuery({ page: query.page + 1, rowsPerPage: rowsPerPage }));
		}
	};

	const handleLastPageClick = () => {
		if (!isLastPage && !(data.state === "loading")) {
			let pageNum = Math.ceil(data.data!.total_count / query.rowsPerPage);
			if (pageNum * query.rowsPerPage > 1000) pageNum = 1000 / query.rowsPerPage;
			dispatch(changePaginationQuery({ page: pageNum, rowsPerPage: rowsPerPage }));
		}
	};

	const changeRowsPerPage = (rows: number) => {
		setRowsPerPage(rows);
		dispatch(changePaginationQuery({ page: 1, rowsPerPage: rows }));
	};
	return (
		<div className="md:px-10 px-5 md:my-10 my-5 md:flex justify-center">
			<div className="md:mx-5 my-4">
				<Select
					disabled={data.state === "loading"}
					value={rowsPerPage}
					onChange={(e) => changeRowsPerPage(Number(e.target.value))}
				>
					<option disabled>Rows Per Page</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
					<option value={50}>50</option>
					<option value={100}>100</option>
				</Select>
			</div>
			<div className="flex justify-center items-center rounded-sm shadow-sm gap-x-2">
				<IconButton
					disabled={!data.data?.total_count || data.data.total_count === 0 || data.state === "loading"}
					aria-label="First"
					icon={<BiFirstPage size={25} />}
					variant="ghost"
					onClick={handleFirstPageClick}
				/>
				<IconButton
					disabled={!data.data?.total_count || data.data.total_count === 0 || data.state === "loading"}
					aria-label="Prev"
					icon={<GrFormPrevious size={25} />}
					variant="ghost"
					onClick={handlePreviousPageClick}
				/>
				{!data.data?.total_count || data.data.total_count === 0 ? (
					<div> 0 to 0 of 0 </div>
				) : (
					<div className="whitespace-nowrap">
						{(query.page - 1) * query.rowsPerPage + 1} to{" "}
						{query.page * query.rowsPerPage > data.data.total_count
							? data.data.total_count
							: query.page * query.rowsPerPage}{" "}
						of {data.data?.total_count ?? 0}
					</div>
				)}
				<IconButton
					disabled={!data.data?.total_count || data.data.total_count === 0 || data.state === "loading"}
					aria-label="Next"
					icon={<GrFormNext size={25} />}
					variant="ghost"
					onClick={handleNextPageClick}
				/>
				<IconButton
					disabled={!data.data?.total_count || data.data.total_count === 0 || data.state === "loading"}
					aria-label="Last"
					icon={<BiLastPage size={25} />}
					variant="ghost"
					onClick={handleLastPageClick}
				/>
			</div>
		</div>
	);
}

export default Pagination;
