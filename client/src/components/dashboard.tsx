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

const gridStyle = {
  display: "grid",
  gap: "1rem",
  gridTemplateColumns: "repeat(auto-fill, minmax(min(280px, 100%), 1fr))",
};

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
      <div style={gridStyle}>
        {[1, 2, 3].map((n) => (
          <Skeleton
            key={n}
            variant="rounded"
            height={210}
            sx={{ bgcolor: "#18181b", borderRadius: "12px" }}
          />
        ))}
      </div>
    );
  else if (!loading && error)
    return <FormError message={"Failed to fetch users"} />;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
      {curentUser?.me && (
        <section style={{ maxWidth: "400px" }}>
          <UserCard {...curentUser.me} isFollowable={false} />
        </section>
      )}

      {/* others */}
      <section>
        <div style={{ marginBottom: "1.25rem" }}>
          <h2
            style={{
              margin: 0,
              fontSize: "1.25rem",
              fontWeight: 600,
              letterSpacing: "-0.025em",
              color: "#fafafa",
            }}
          >
            People
          </h2>
          <p style={{ fontSize: "0.875rem", color: "#a1a1aa" }}>
            Find people to follow
          </p>
        </div>

        {users?.length ? (
          <div style={gridStyle}>
            {users.map((item: any) => (
              <UserCard
                key={item.ID}
                {...item}
                currentUser={curentUser?.me}
                refetch={refetch}
                refetchCurrentUser={refetchCurrentUser}
              />
            ))}
          </div>
        ) : (
          <p
            style={{
              padding: "2rem",
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#a1a1aa",
              border: "1px dashed #27272a",
              borderRadius: "12px",
            }}
          >
            No other users yet.
          </p>
        )}

        {/* only show the page picker when there is more than one page */}
        {pages > 1 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: "0.75rem",
              marginTop: "2rem",
            }}
          >
            <span style={{ fontSize: "0.875rem", color: "#a1a1aa" }}>Page</span>
            <Select
              size="small"
              value={currentPage}
              onChange={(e) => {
                handlePage(e.target.value as number);
              }}
              sx={{
                borderRadius: "6px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "#27272a" },
              }}
              style={{ color: "#fafafa" }}
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
        )}
      </section>
    </div>
  );
};

export default Dashboard;
