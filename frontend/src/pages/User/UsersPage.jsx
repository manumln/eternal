import axios from "axios";
import { useState, useEffect } from "react";
import { Card, Button, Spinner } from "@nextui-org/react";
import UserCard from "@/components/UserCard";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const UsersPage = () => {
  const [userList, setUserList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadFlag, setReloadFlag] = useState(0);
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUserList(data.users);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [reloadFlag]);

  const handleEditProfile = (userId) => {
    navigate(`/users/${userId}/edit`);
  };

  const handleNavigateToProfile = (userId) => {
    navigate(`/users/${userId}`);
  };

  const renderUsers = () => {
    return userList?.map((user) => (
      <UserCard key={user._id} user={user} handleReload={() => setReloadFlag(prev => prev + 1)}>
        <div className="flex justify-between items-center">
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => handleNavigateToProfile(user._id)}  
          >
            {user.name}
          </span>
                    <Button
            onClick={(e) => {
              e.stopPropagation(); 
              handleEditProfile(user._id);
            }}
            color="primary"
            className="underline text-blue-500"
            size="sm"
          >
            Edit Profile
          </Button>
        </div>
      </UserCard>
    ));
  };

  const renderLoadingState = () => (
    <div className="flex justify-center w-full">
      <Spinner className="animate-spin h-10 w-10" />
    </div>
  );

  const renderNotAuthorized = () => (
    <Card className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <Card className="mx-auto max-w-screen-sm text-center">
        <h1 className="text-7xl font-extrabold text-primary-600 tracking-tight mb-4 lg:text-9xl">401</h1>
        <p className="text-3xl font-bold tracking-tight mb-4">
          Not Authorized
        </p>
      </Card>
    </Card>
  );

  return (
    <main className="grid flex-1 p-2 sm:p-4 items-start">
      {isLoading ? renderLoadingState() : userList.length ? renderUsers() : renderNotAuthorized()}
    </main>
  );
};

export default UsersPage;
