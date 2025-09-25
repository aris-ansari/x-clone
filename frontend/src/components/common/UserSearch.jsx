import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { CiSearch } from "react-icons/ci";

async function fetchUsers(query) {
  console.log("fetchUsers called with:", query);
  const res = await fetch(`/api/search/users?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

const UserSearch = ({ placeholder = "Search" }) => {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(handler);
  }, [query]);

  const {
    data: results = [],
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["searchUsers", debouncedQuery],
    queryFn: () => fetchUsers(debouncedQuery),
    enabled: debouncedQuery.length > 0, // only run when input is not empty
    staleTime: 30 * 1000,
  });

  function goToProfile(userName) {
    setQuery("");
    navigate(`/profile/${userName}`);
  }

  return (
    <div className="w-full mb-4 sticky top-4 z-[2]">
      <div className="relative">
        <CiSearch className="absolute top-1/2 translate-y-[-50%] left-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full border border-gray-700 rounded-full outline-none bg-transparent px-3 py-2 pl-8 text-sm"
        />
      </div>
      {query && (
        <div className="bg-[#000] p-2 rounded-md absolute top-12 w-full border-2 border-[#16181C]">
          {isFetching && <RightPanelSkeleton />}
          {isError && <div className="text-red-500">Error fetching users</div>}
          {!isFetching && results.length === 0 && (
            <div className="text-white">No users found</div>
          )}
          {results.map((u) => (
            <div
              onClick={() => goToProfile(u.userName)}
              className="flex items-center justify-between gap-4 cursor-pointer my-4"
              key={u._id}
            >
              <div className="flex gap-2 items-center">
                <div className="avatar w-8 h-8">
                  <div className="w-8 rounded-full">
                    <img src={u.profileImg || "/avatar-placeholder.png"} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold tracking-tight truncate w-28">
                    {u.fullName}
                  </span>
                  <span className="text-sm text-slate-500">@{u.userName}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserSearch;
