"use client";

import { AUTH_TOKEN_KEY, PAGE_LIMIT } from "@/config";
import { GET_CURRENT_USER, LIST_USERS } from "@/lib/graphql-api";
import { useQuery } from "@apollo/client";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Skeleton from "@mui/material/Skeleton";
import Cookies from "js-cookie";
import React, { FC, useState } from "react";
import { FormError } from "./auth/form-error";
import UserCard from "./user-card";

interface DashboardProps {}

const Dashboard: FC<DashboardProps> = ({}) => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  const { loading, error, data, refetch } = useQuery(LIST_USERS, {
    context: {
      headers: {
        Authorization: token,
      },
    },
  });

  const {
    loading: loadingCurrentUser,
    error: currentUserError,
    data: curentUser,
    refetch: refetchCurrentUser,
  } = useQuery(GET_CURRENT_USER, {
    context: {
      headers: {
        Authorization: token,
      },
    },
  });

  const [users, setUsers] = useState<any>([]);
  const [pages, setPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  React.useEffect(() => {
    if (data?.users?.length > 0) {
      const total_pages = Math.ceil(data?.users?.length / PAGE_LIMIT);
      setPages(total_pages);
    }
  }, [data]);

  function handlePage(pageNumber: number) {
    setCurrentPage(pageNumber);
  }

  React.useEffect(() => {
    const startIndex = (currentPage - 1) * PAGE_LIMIT;
    const endIndex = Math.min(startIndex + PAGE_LIMIT, data?.users?.length); // Clamp to data length
    const temp = data?.users?.slice(startIndex, endIndex);
    setUsers(temp);
  }, [currentPage, data]);

  if (loading)
    return (
      <div
        className=""
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[1, 2, 3].map((_, idx: number) => (
          <Skeleton key={idx} variant="rectangular" width={400} height={165} />
        ))}
      </div>
    );
  else if (!loading && error)
    return <FormError message={"Failed to fetch users"} />;
  return (
    <div className="">
      <div
        className=""
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <UserCard {...curentUser?.me} isFollowable={false} />
        {users?.map((item: any, idx: number) => (
          <div key={idx} style={{ flexShrink: 0, width: "400px" }}>
            <UserCard
              {...item}
              refetch={refetch}
              refetchCurrentUser={refetchCurrentUser}
            />
          </div>
        ))}
      </div>
      <div
        className=""
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "end",
          marginTop: "2rem",
        }}
      >
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={currentPage}
          // label="Age"
          onChange={(e) => {
            handlePage(e.target.value as number);
          }}
          style={{ color: "white", border: "1px solid hsl(215 20.2% 65.1%)" }}
        >
          {Array(pages)
            .fill(0)
            .map((_, idx) => (
              <MenuItem key={idx} value={idx + 1}>
                {idx + 1}
              </MenuItem>
            ))}
        </Select>
      </div>
    </div>
  );
};

export default Dashboard;
