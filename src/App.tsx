import Filter from "./components/Filter";
import Header from "./components/layout/Header";
import DataTable from "./components/DataTable";
import Pagination from "./components/Pagination";

function App() {
	return (
		<>
			<Header />
			<Filter />
			<DataTable />
			<Pagination />
		</>
	);
}

export default App;
