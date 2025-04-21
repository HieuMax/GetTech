import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

// import './App.css';
import Login from "./components/Login";
import { RootLayout } from "./pages/0.RootLayout";
import HomePage from "./pages/1.Home";
import { Shop } from "./pages/3.Shop";
import Signup from "./components/SignUp";
import Admin from "./pages/2.Admin";
import AddProduct from "./components/AddProduct";
import ProductListAdmin from "./components/ProductListAdmin";
import Profile from "./components/Profile";
import { AuthProvider } from "./store/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [users, setUsers] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthAndFetchData = async () => {
      const accessToken = localStorage.getItem("accessToken");
      const refreshToken = localStorage.getItem("refreshToken");
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (!accessToken && !refreshToken) {
        setIsLoading(false);
        return;
      }

      try {
        if (accessToken) {
          const response = await fetch("http://localhost:5000/api/objects", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(data);
            setIsAuthenticated(true);
            setError(null);
          } else if (response.status === 401 && refreshToken) {
            const refreshed = await refreshAccessToken();
            if (refreshed) {
              await fetchUsers();
            }
          } else {
            handleLogout();
          }
        } else if (refreshToken) {
          const refreshed = await refreshAccessToken();
          if (refreshed) {
            await fetchUsers();
          }
        }
      } catch (error) {
        console.error("Error during authentication check:", error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthAndFetchData();
  }, []);

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await fetch(
        "http://localhost:5000/api/auth/refresh-token",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to refresh token");
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleLogout();
      return false;
    }
  };

  const handleApiError = async (error, retryFunction) => {
    if (error.status === 401) {
      // Token might be expired, try to refresh
      const refreshed = await refreshAccessToken();
      if (refreshed) {
        // Retry the original request
        return retryFunction();
      }
    }
    throw error;
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/objects", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!response.ok) {
        throw { status: response.status };
      }

      const data = await response.json();
      setUsers(data);
      setError(null);
    } catch (error) {
      try {
        await handleApiError(error, fetchUsers);
      } catch (finalError) {
        setError("Failed to fetch users. Please try logging in again.");
        console.error("Error fetching users:", finalError);
      }
    }
  };

  // const handleSubmit = async (formData) => {
  //     try {
  //         const url = editingId
  //             ? `http://localhost:5000/api/objects/${editingId}`
  //             : 'http://localhost:5000/api/objects';

  //         const method = editingId ? 'PUT' : 'POST';

  //         const response = await fetch(url, {
  //             method,
  //             headers: {
  //                 'Content-Type': 'application/json',
  //                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //             },
  //             body: JSON.stringify(formData)
  //         });

  //         if (!response.ok) {
  //             throw { status: response.status };
  //         }

  //         await fetchUsers();
  //         setEditingId(null);
  //         setError(null);
  //     } catch (error) {
  //         try {
  //             await handleApiError(error, () => handleSubmit(formData));
  //         } catch (finalError) {
  //             setError('Failed to save user. Please try again.');
  //             console.error('Error saving user:', finalError);
  //         }
  //     }
  // };

  // const handleEdit = (user) => {
  //     console.log('Editing user:', user);
  //     setEditingId(user._id);
  // };

  // const handleDelete = async (id) => {
  //     try {
  //         const response = await fetch(`http://localhost:5000/api/objects/${id}`, {
  //             method: 'DELETE',
  //             headers: {
  //                 'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
  //             }
  //         });

  //         if (!response.ok) {
  //             throw { status: response.status };
  //         }

  //         await fetchUsers();
  //         setError(null);
  //     } catch (error) {
  //         try {
  //             await handleApiError(error, () => handleDelete(id));
  //         } catch (finalError) {
  //             setError('Failed to delete user. Please try again.');
  //             console.error('Error deleting user:', finalError);
  //         }
  //     }
  // };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    fetchUsers();
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
    setUsers([]);
    setError(null);
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    // <Router>
    //     <div className="App">
    //         {isAuthenticated && (
    //             <header className="App-header">
    //                 <h1>Phone Management System</h1>
    //                 <div className="user-info">
    //                     <span>Welcome, {user?.username}</span>
    //                     <button onClick={handleLogout}>Logout</button>
    //                 </div>
    //             </header>
    //         )}
    //         {error && (
    //             <div className="error-message">
    //                 {error}
    //             </div>
    //         )}
    //         <Routes>
    //             <Route path="/" element={
    //                 !isAuthenticated ? (
    //                     <Login onLogin={handleLogin} />
    //                 ) : (
    //                     <Navigate to={user?.role === 'admin' ? '/admin' : '/'} />
    //                 )
    //             } />
    //             <Route path="/admin" element={
    //                 isAuthenticated && user?.role === 'admin' ? (
    //                     <Admin />
    //                 ) : (
    //                     <Navigate to="/" />
    //                 )
    //             } />
    //         </Routes>
    //     </div>
    // </Router>
    <AuthProvider>
      <Routes>
        <Route element={<RootLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<Shop />} />
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login onLogin={handleLogin} />
              ) : (
                <Navigate to={user?.role === "admin" ? "/admin" : "/profile"} />
              )
            }
          />
          <Route path="/register" element={<Signup />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route
          path="/admin"
          element={
            isAuthenticated && user?.role === "admin" ? (
              <Admin />
            ) : (
              <Navigate to="/" />
            )
          }
        >
          <Route path="/admin/add" element={<AddProduct />} />
          <Route path="/admin/list" element={<ProductListAdmin />} />
          <Route path="/admin/edit/:id" element={<AddProduct />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
