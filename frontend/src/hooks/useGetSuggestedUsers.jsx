import { setSuggestedUsers } from "@/redux/authSlice";
import { setSuggestedUsersLoading } from "@/redux/loadingSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSuggestedUsers = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      const token = localStorage.getItem("aliet"); // Fetch the latest token
      dispatch(setSuggestedUsersLoading(true));
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_APP_API_KEY}/api/v1/user/suggested`,
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        if (res.data.statusInfo === "success") {
          dispatch(setSuggestedUsers(res.data.data));
        } else {
          console.error("Failed to fetch suggested users:", res.data.message);
        }
      } catch (error) {
        console.error("Error fetching suggested users:", error.message);
      } finally {
        dispatch(setSuggestedUsersLoading(false));
      }
    };

    fetchSuggestedUsers();
  }, [dispatch]); // Added dispatch to the dependency array
};

export default useGetSuggestedUsers;
