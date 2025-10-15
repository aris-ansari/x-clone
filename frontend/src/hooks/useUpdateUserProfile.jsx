import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const useUpdateUserProfile = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { mutateAsync: updateProfile, isPending: isUpdatingProfile } =
    useMutation({
      mutationFn: async (FormData) => {
        try {
          const res = await fetch("/api/users/update/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(FormData),
          });
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to update profile");
          }

          return data;
        } catch (error) {
          throw new Error(error);
        }
      },
      onSuccess: (data) => {
        toast.success("Profile updated successfully");
        Promise.all([
          queryClient.invalidateQueries({ queryKey: ["authUser"] }),
          queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
        ]);
        navigate(`/profile/${data.data.userName}`);
      },
      onError: (error) => {
        throw new Error(error.message);
      },
    });

  return { updateProfile, isUpdatingProfile };
};

export default useUpdateUserProfile;
