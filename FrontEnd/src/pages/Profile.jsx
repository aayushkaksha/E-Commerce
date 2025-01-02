import { useEffect, useState } from "react";
import { LogOut, Store } from "lucide-react"; // Importing the LogOut icon
import Wishlist from "../components/Wishlist";
import { NavLink, useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });

  // Fetch user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Fetch user info using fetch API
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching user data");
        }

        const data = await response.json();
        if (data.success) {
          setUser(data.user); // Set the user data to state
        } else {
          throw new Error(data.message || "Failed to load user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login"); // Redirect to login if there's an issue
      }
    };

    fetchUserData();
  }, [navigate]);

  // Logout function
  const handleLogout = () => {
    // Clear the token from localStorage
    localStorage.removeItem("token");
    // Redirect to the login page
    navigate("/login");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="mx-8">
          {/* Profile Info and Buttons */}
          <div className="p-6 max-w-screen-lg flex flex-col md:flex-row items-center md:justify-between bg-white shadow rounded-lg">
            {/* Profile Section */}
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-full overflow-hidden shadow-lg">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg/330px-Eug%C3%A8ne_Delacroix_-_La_libert%C3%A9_guidant_le_peuple.jpg"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-800">
                  {user.name}
                </h2>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            {/* Buttons Section */}
            <div className="flex flex-col items-stretch space-y-3 mt-6 custom-880:mt-0">
              <NavLink
                to="/Seller"
                className="flex items-center space-x-2 bg-blue-600 text-white px-5 py-2 rounded-lg shadow hover:bg-blue-500 transition focus:ring-2 focus:ring-blue-300"
                aria-label="Become a Seller"
              >
                <Store className="w-5 h-5" />
                <span>Be a Seller</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-red-600 text-white px-5 py-2 rounded-lg shadow hover:bg-red-500 transition focus:ring-2 focus:ring-red-300"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Wishlist Section */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">My Wishlist</h2>
          <Wishlist />
        </div>
      </div>
    </div>
  );
};

export default Profile;
