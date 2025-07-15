import { examples } from "./_examples";
import { Example } from "./_examples/example";
import "./App.css";

function App() {
  return (
    <div>
      {examples.map((example) => (
        <Example item={example} key={example.title} />
      ))}
    </div>
  );
}

export default App;
