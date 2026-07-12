"use client";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Home from "@mui/icons-material/Home";
import FormatListBulleted from "@mui/icons-material/FormatListBulleted";
import Logout from "@mui/icons-material/Logout";
import Login from "@mui/icons-material/Login";
import { useContext } from "react";
import { AuthContext } from "@/app/context/AuthContext";

interface HamburgerListProps {
  handleCloseMenu: () => void;
}

const HamburgerList = ({ handleCloseMenu }: HamburgerListProps) => {
  const { user } = useContext(AuthContext);
  const Buttons = [
    {
      name: "Home",
      link: "/",
      icon: Home,
    },
    { name: "Guest demo", link: "/demo/", icon: FormatListBulleted },
  ];
  if (user?.uid) {
    Buttons.push({
      name: "My Trips",
      link: "/trips",
      icon: FormatListBulleted,
    });
  }
  Buttons.push({
    name: user ? "Logout" : "Sign In",
    link: user ? "/logout" : "/sign-in",
    icon: user ? Logout : Login,
  });

  return (
    <List>
      {Buttons.map((button) => {
        return (
          <ListItem key={button.name} disablePadding>
            <ListItemButton onClick={handleCloseMenu} href={button.link}>
              <ListItemIcon>
                <button.icon />
              </ListItemIcon>
              <ListItemText primary={button.name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
};

export default HamburgerList;
