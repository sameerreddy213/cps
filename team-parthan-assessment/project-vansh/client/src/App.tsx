import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import MainPage from './components/MainPage';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element:<HomePage/>
  },
  {
    path: "/home",
    element:<MainPage/>,
  },
  
]);
function App() {

  return (
    <main>
      <RouterProvider router={appRouter}></RouterProvider>
    </main>
  )
}

export default App
