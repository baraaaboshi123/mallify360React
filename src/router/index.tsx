import { useRoutes } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import SimpleMenu from "../layouts/SimpleMenu";
import TopMenu from "../layouts/TopMenu";
import Page1 from "../pages/Page1";
import Page2 from "../pages/Page2";
import Catigories from "../pages/Categories";
import Products from "../pages/ProductGrid";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AddProduct from "../pages/AddProduct";
import Chat from "../pages/Chat";
import Pricing from "../pages/Pricing";
import Store from "../pages/Store";
import Dashboard from "../pages/Dashboard";
import Sales from "../pages/Sales";
import Ads from "../pages/Ads";
import NewAdd from "../pages/NewAdd";
import AddAdminCategories from "../pages/AddAdminCategories";
import AdminCategories from "../pages/AdminCategories";
import AddInterests from "../pages/AddInterests";
import Interests from "../pages/Interests";
import AddSales from "../pages/AddSales";
import Setup from "../pages/Setup";
import ErrorPage from "../pages/ErrorPage";
import Stores from "../pages/Stores";
import PushNotifications from "../pages/PushNotifications";
import AdminPushNotifications from "../pages/AdminPushNotifications";
import Transactions from "../pages/Transactions";
import ForgetPassword from "../pages/ForgetPassword";
import ResetPassword from "../pages/ResetPassword";
import TransactionsDetails from "../pages/TransactionsDetails";
function Router() {
  const routes = [
    {
      path: "/",
      element: <SideMenu />,
      children: [
        {
          path: "/",
          element: <Dashboard />,
        },
        {
          path: "store",
          element: <Store/>
        },
        {
          path: "page-2",
          element: <Page2 />,
        },
        {
          path: "Catigories",
          element: <Catigories/>
        },
        {
          path: "products",
          element: <Products/>
        },
        {
          path: "pushNotifications",
          element: <PushNotifications/>
        },
        {
          path: "adminPushNotifications",
          element: <AdminPushNotifications/>
        },
        {
          path: "sales",
          element: <Sales/>
        },
        {
          path: "adminCategories",
          element: <AdminCategories/>

        },
        {
          path: "stores",
          element: <Stores/>
        },
        {
          path: "users",
          element: <Page1/>

        },
        {
          path: "addAdminCategories",
          element: <AddAdminCategories/>
        },
        {
          path: "transactions",
          element: <Transactions/>
        },
        {
          path: "interests",
          element: <Interests/>

        },
        {
          path: "addInterests",
          element: <AddInterests/>
        },
        {
          path: "ads",
          element: <Ads/>
        },
        {
          path: "newAdd",
          element: <NewAdd/>
        },
        {
          path: "addSales",
          element: <AddSales/>
        },
        {
          path: "addProduct",
          element: <AddProduct/>
        },
        {
          path: "transactionsDetails",
          element: <TransactionsDetails/>
        },
        {
          path: "chat",
          element: <Chat/>
        },
        
      ],
      
    },
    {
      path: "login",
      element: <Login/>
    },
    {
      path: "forgetPass",
      element: <ForgetPassword/>
    },
    {
      path: "resetPass",
      element: <ResetPassword/>
    },
    {
      path: "pricing",
      element: <Pricing/>
    },
    {
      path: "setup",
      element: <Setup/>
    },
    {
      path: "error",
      element: <ErrorPage/>

    },
    
    {
      path: "register",
      element: <Register/>
    },
    {
      path: "/simple-menu",
      element: <SimpleMenu />,
      children: [
        {
          path: "page-1",
          element: <Page1 />,
        },
        {
          path: "page-2",
          element: <Page2 />,
        },
      ],
    },
    {
      path: "/top-menu",
      element: <TopMenu />,
      children: [
        {
          path: "page-1",
          element: <Page1 />,
        },
        {
          path: "page-2",
          element: <Page2 />,
        },
      ],
    },
  ];

  return useRoutes(routes);
}

export default Router;
