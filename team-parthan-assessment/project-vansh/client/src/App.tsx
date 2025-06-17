import './App.css'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from './components/HomePage';
import MainPage from './components/MainPage';
import ProtectedRoute from './services/protectedRoute';

const appRouter = createBrowserRouter([
  {
    path: "/",
    element:<HomePage/>
  },
  {
    path: "/home",
    element: (
      <ProtectedRoute>
        <MainPage />
      </ProtectedRoute>
    )
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
