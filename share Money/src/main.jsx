import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import Layout from './Layout.jsx';
import Dashboard from './component/Dashboard/Dashboard.jsx';
import Signup from './component/Signup/Signup.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { UserContextProvider } from './context/Usercontextprovider.jsx'; // Correct import
import Login from './component/Login/Login.jsx';
import Portfolio from './component/Portfolio/Portfolio.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
  },
  {
    path: "/Dashboard",
    element: <Dashboard />,
  },
  {
    path: "/Signup",
    element: (
      <UserContextProvider>
        <Signup />
      </UserContextProvider>
    ),
  },
  {
    path: "/Login",
    element: (
      <UserContextProvider>
        <Login />
      </UserContextProvider>
    ),
  },
  {
    path:"/Portfolio",
    element:<Portfolio/>
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
