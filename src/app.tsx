import React from 'react';
import css from './app.module.css';
import {
  createBrowserRouter,
  RouterProvider,
  Link,
} from "react-router-dom";
import ErrorPage from "./error-page"

const HelloWorld = () => {
  return <header className={css.title}>Hello world!</header>
}
const router = createBrowserRouter([
  {
    path: "/",
    element: <HelloWorld />,
    errorElement: <ErrorPage />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
