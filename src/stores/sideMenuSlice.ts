import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";
import { icons } from "../base-components/Lucide";

export interface Menu {
  icon: keyof typeof icons;
  title: string;
  pathname?: string;
  subMenu?: Menu[];
  ignore?: boolean;
}

export interface SideMenuState {
  menu: Array<Menu | "divider">;
}


const initialState: SideMenuState = {
  menu: [
    {
      icon: "Home",
      pathname: "/",
      title: "Dashboard",
    },
    {
      icon: "ShoppingBag",
      pathname : "/store",
      title: "Store"
    },
    {
      icon: "ListOrdered",
      pathname: "/page-2",
      title: "Orders",
    },
    {
      icon: "Layers",
      pathname: "/catigories",
      title: "Catigories",
    },
    {
      icon: "ShoppingCart",
      pathname: "/products",
      title: "Products",
    },
    {
      icon: "Percent",
      pathname: "/sales",
      title: "Sales"
    },
    {
      icon: "MessageSquare",
      pathname : "/chat",
      title: "Chat"
    },
    {
      icon: "BellPlus",
      pathname: "pushNotifications",
      title: "Push Notifications"
    },
    {
      icon: "Bookmark",
      pathname: "ads",
      title: "Ads"
    },
    {
      icon: "ShoppingBag",
      pathname: "/stores",
      title: "Stores"

    },
    {
      icon: "User",
      pathname: "/users",
      title: "Users"

    },
    {
      icon: "Album",
      pathname: "/ads",
      title : "Ads"
    },
    {
      icon: "Layers",
      pathname: "/adminCategories",
      title: "Categories"
    },
    {
      icon: "Activity",
      pathname: "/interests",
      title: "Interests"
    },
    {
      icon: "BellPlus",
      pathname: "/adminPushNotifications",
      title: "Push Notifications"
    },
    {
      icon : "DollarSign",
      pathname: "/transactions",
      title: "Transactions"
    }

    
  ],
};

if(localStorage.getItem("role") === "owner")
{
  
}
export const sideMenuSlice = createSlice({
  name: "sideMenu",
  initialState,
  reducers: {},
});

export const selectSideMenu = (state: RootState) => state.sideMenu.menu;

export default sideMenuSlice.reducer;
