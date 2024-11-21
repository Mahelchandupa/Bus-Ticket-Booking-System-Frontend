import { RouterProvider } from "react-router-dom";
import router from "./routes/routes";
import history from "./helpers/history";

function App() {
  return (
    <div>
      <RouterProvider router={router} history={history} />
    </div>
  );
}

export default App;
