import Filter from "./components/Filter";
import Header from "./components/layout/Header";
import DataWrapper from "./components/DataWrapper";
import Pagination from "./components/Pagination";

function App() {
	return (
		<>
			<Header />
			<Filter />
			<DataWrapper />
			<Pagination />
		</>
	);
}

export default App;
