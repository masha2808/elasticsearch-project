import './App.css';
import { ProgrammingListLoader } from './components/context/programming-list-loader';
import ProgrammingIndex from "./components/programming-index";

function App() {
  return (
    <ProgrammingListLoader>
      <ProgrammingIndex />
    </ProgrammingListLoader>
  );
}

export default App;
