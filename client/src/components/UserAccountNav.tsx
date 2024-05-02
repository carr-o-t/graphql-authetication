"use client";

import React, { FC } from "react";

import {
  CssTransition,
  Dropdown,
  Menu,
  MenuListboxSlotProps,
  PopupContext,
} from "@mui/base";
import { MenuButton as BaseMenuButton } from "@mui/base/MenuButton";
import { MenuItem as BaseMenuItem, menuItemClasses } from "@mui/base/MenuItem";
import Badge from "@mui/material/Badge";
import { removeCookie } from "@/actions/remove-cookie";
import { AUTH_TOKEN_KEY } from "@/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";


interface UserAccountNavProps {
  user: {
    username: string;
    firstName: string;
    lastName?: string;
    email: string;
  };
}

const UserAccountNav: FC<UserAccountNavProps> = ({ user }) => {
  const router = useRouter();
  function handleLogout() {
    toast.promise(async () => await removeCookie(AUTH_TOKEN_KEY), {
      loading: "signing out...",
      success: (data) => {
        router.push("/auth/login");
        return `Logged out`;
      },
      error: "Error",
    });
  }
  return (
    <Dropdown>
      <MenuButton>
        <div
          // badgeContent={4}
          // color="secondary"
          style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
        >
          {user?.username}
          <PersonIcon className="h-4 w-4" />
        </div>
      </MenuButton>
      <Menu
        slots={{ listbox: AnimatedListbox }}
        style={{ left: "-1rem", zIndex: "999" }}
      >
        <MenuItem onClick={handleLogout}>Log out</MenuItem>
      </Menu>
    </Dropdown>
  );
};

const blue = {
  50: "#F0F7FF",
  100: "#C2E0FF",
  200: "#99CCF3",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E6",
  700: "#0059B3",
  800: "#004C99",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Listbox = styled("ul")(
  ({ theme }) => `
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 6px;
  margin: 12px 0;
  min-width: 200px;
  border-radius: 12px;
  overflow: auto;
  outline: 0px;
  background: ${theme.palette.mode === "dark" ? grey[900] : grey[900]};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[700]};
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[300]};
  z-index: 999;

  .closed & {
    opacity: 0;
    transform: scale(0.95, 0.8);
    transition: opacity 200ms ease-in, transform 200ms ease-in;
  }
  
  .open & {
    opacity: 1;
    transform: scale(1, 1);
    transition: opacity 100ms ease-out, transform 100ms cubic-bezier(0.43, 0.29, 0.37, 1.48);
  }

  .placement-top & {
    transform-origin: bottom;
  }

  .placement-bottom & {
    transform-origin: top;
  }
  `
);

const AnimatedListbox = React.forwardRef(function AnimatedListbox(
  props: MenuListboxSlotProps,
  ref: React.ForwardedRef<HTMLUListElement>
) {
  const { ownerState, ...other } = props;
  const popupContext = React.useContext(PopupContext);

  if (popupContext == null) {
    throw new Error(
      "The `AnimatedListbox` component cannot be rendered outside a `Popup` component"
    );
  }

  const verticalPlacement = popupContext.placement.split("-")[0];

  return (
    <CssTransition
      className={`placement-${verticalPlacement}`}
      enterClassName="open"
      exitClassName="closed"
    >
      <Listbox {...other} ref={ref} />
    </CssTransition>
  );
});

const MenuItem = styled(BaseMenuItem)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 8px;
  cursor: default;
  user-select: none;

  &:last-of-type {
    border-bottom: none;
  }

  &:focus {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[600]};
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[800]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[300]};
  }

  &.${menuItemClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[700]};
  }
  `
);

const MenuButton = styled(BaseMenuButton)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  font-weight: 600;
  font-size: 0.875rem;
  line-height: 1.5;
  padding: 0 1rem;
  border-radius: 0;
  color: white;
  transition: all 150ms ease;
  cursor: pointer;
  background: transparent;
  border: 0;
  color: ${theme.palette.mode === "dark" ? grey[200] : grey[200]};

  &:hover {
  }

  &:active {
  }

  &:focus-visible {
    box-shadow: 0 0 0 4px ${
      theme.palette.mode === "dark" ? blue[300] : blue[300]
    };
    outline: none;
  }
  `
);

export default UserAccountNav;
