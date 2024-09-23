import Header from "./components/Header";
import Resume from "./components/Resume";

const income = 10;
const expense = 50;
const total = 70;

function App() {
  return (
    <>
      <Header />
      <Resume income={income} expense={expense} total={total} />
    </>
  );
}

export default App;
