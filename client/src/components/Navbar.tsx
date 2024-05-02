"use client";

import { AUTH_TOKEN_KEY } from "@/config";
import { GET_CURRENT_USER } from "@/lib/graphql-api";
import { useQuery } from "@apollo/client";
import { AppBar, Container, Toolbar, Typography } from "@mui/material";
import Cookies from "js-cookie";
import Link from "next/link";
import UserAccountNav from "./UserAccountNav";

export const Navbar = () => {
  const token = Cookies.get(AUTH_TOKEN_KEY);
  const { loading, error, data } = useQuery(GET_CURRENT_USER, {
    context: {
      headers: {
        Authorization: token,
      },
    },
  });

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        left: 0,
        right: 0,
        zIndex: 10,
        backgroundColor: "#1c1c1cfb",
        borderBottom: "1px solid hsl(217.2 32.6% 17.5%)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            justifyContent: "space-between",
            alignItems: "center",
            height: "fit-content",
          }}
        >
          <Link href="/" style={{ textDecoration: "none" }}>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ display: "flex", color: "white" }}
            >
              Corroddit
            </Typography>
          </Link>
          {/* search bar */}
          {data?.me?.username ? <UserAccountNav user={data?.me} /> : null}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
