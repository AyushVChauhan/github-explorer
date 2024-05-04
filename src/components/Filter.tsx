import { IconButton, Input, InputGroup, InputLeftElement, Select, useToast } from "@chakra-ui/react";
import { useState } from "react";
import { IoIosSearch } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { changeSearchQuery } from "../store/slices/query.slice";
import { RootState } from "../store";

function Filter() {
	const [search, setSearch] = useState("");
	const [searchType, setSearchType] = useState("trending");
	const data = useSelector((state: RootState) => state.data);
	const toast = useToast({ position: "top-right" });
	const dispatch = useDispatch();
	const onSearch = () => {
		if (!search && searchType !== "trending") {
			toast({ title: "Please enter something into search field", duration: 2000 });
			return;
		}
		dispatch(changeSearchQuery({ search: search, type: searchType }));
	};
	return (
		<div className="md:mt-10 mt-5 flex justify-center">
			<div className="lg:w-1/2 md:w-3/4 w-full px-5 flex">
				<InputGroup>
					<InputLeftElement pointerEvents="none">
						<IoIosSearch />
					</InputLeftElement>
					<Input
						disabled={searchType === "trending"}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search Repositories"
					/>
				</InputGroup>
				<Select
					minWidth={150}
					maxWidth={150}
					value={searchType}
					onChange={(e) => setSearchType(e.target.value)}
				>
					<option value="topics">Topic</option>
					<option value="readme">Readme</option>
					<option value="name">Name</option>
					<option value="description">Description</option>
					<option value="trending">Trending</option>
				</Select>
				<IconButton
					isLoading={data.state === "loading"}
					onClick={onSearch}
					type="button"
					colorScheme="teal"
					aria-label="Search"
					icon={<IoIosSearch size={25} />}
				/>
			</div>
		</div>
	);
}

export default Filter;
