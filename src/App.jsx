import "./styles/global.css";

// Job
import Jobs from "./pages/Jobs/Jobs";
import EditJob from "./pages/Jobs/EditJob";
import Navbar from "./components/Navbar";
import CreateJob from "./pages/Jobs/CreateJob";

// Auth
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import { useEffect, useState } from "react";
import { auth } from "./services/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Profile
import Profile from "./pages/Profile/Profile";

// Router
import { Routes, Route } from "react-router-dom";

// Spinner (reuse)
import Spinner from "./components/Spinner";

//toast
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false); // 🔥 important
    });

    return () => unsubscribe();
  }, []);

  // 🔥 Prevent UI flicker
  if (authLoading) {
    return (
      <div className="page" style={{ textAlign: "center" }}>
        <Spinner />
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      {user && <Navbar user={user} />}

      <Routes>
        <Route path="/" element={user ? <Jobs /> : <Login />} />
        <Route path="/edit/:id" element={user ? <EditJob /> : <Login />} />
        <Route path="/create" element={user ? <CreateJob /> : <Login />} />
        <Route path="/profile" element={user ? <Profile /> : <Login />} />

        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
}

export default App;
