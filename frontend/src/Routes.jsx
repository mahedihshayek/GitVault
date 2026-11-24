import { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard.jsx";
import Profile from "./components/user/Profile.jsx";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import CreateRepository from "./components/repo/CreateRepository.jsx";
import RepositoryDetails from "./components/repo/RepositoryDetails.jsx";
import StarredRepositories from "./components/repo/StarredRepository.jsx";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userIdFromStorage = localStorage.getItem("userId");
    const currentPath = window.location.pathname;
    const publicPaths = ["/auth", "/signup"];

    if (userIdFromStorage && !currentUser) {
      setCurrentUser(userIdFromStorage);
    }

    if (!userIdFromStorage && !publicPaths.includes(currentPath)) {
      navigate("/auth", { replace: true });
    }

    if (userIdFromStorage && publicPaths.includes(currentPath)) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate, setCurrentUser]);

  let element = useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/repo",
      element: <StarredRepositories />,
    },
    {
      path: "/create",
      element: <CreateRepository />,
    },
    {
      path: "/repo/:id",
      element: <RepositoryDetails />,
    },
  ]);

  return element;
};

export default ProjectRoutes;
