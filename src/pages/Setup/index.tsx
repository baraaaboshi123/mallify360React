import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";

import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent, useEffect } from "react";
import clsx from "clsx";
import axios from "axios";
import Lucide from "../../base-components/Lucide";
import Paypal from "../Paypal";
import { FormInline, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
interface store {
    name: string;
    catigory: string;
    description: string;
    email: string;
    location: string;
    phone: string;
    facebook: string;
    instagram: string;
    plan : string;
    exp_date: string;
}
function Main() {
  const navigate = useNavigate()
  let currentDate = new Date();
currentDate.setMonth(currentDate.getMonth() + 1);
let expDate = currentDate.toISOString().slice(0, 10);
  const [store, setStore] = useState<store>({
    name: "",
    catigory: "",
    description: "",
    email: "",
    location: "",
    phone: "",
    facebook: "",
    instagram: "",
    plan: "",
    exp_date: ""
});
  const [catigory, setCatigory] = useState(0)
  const [categories, setCategories] = useState<
      Array<{
          name: string;
          id: number;
      }>
  >([]);
  const handleSubmit = (e: any) => {
      e.preventDefault();
      axios
          .post("http://localhost:8000/store", {
              name: store.name,
              email: store.email,
              phone: store.phone,
              location: store.location,
              description: store.description,
              catigory: catigory,
              facebook: store.facebook,
              instagram: store.instagram,
              owner_id: localStorage.getItem("id"),
              plan: localStorage.getItem("plan"),
              exp_date: expDate,

          })
          .then((response) => {
              console.log(response.data);
              localStorage.setItem("store_id", response.data.store_id);
              localStorage.setItem("role","owner");
              navigate("/")
          });
  };
  const fetchCategories = async () => {
    await axios
        .get("http://localhost:8000/getAdminCategories")
        .then((response) => {
            setCategories(response.data);
        });
};

useEffect(()=>{
    fetchCategories()

},[])

  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-primary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-primary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-primary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <DarkModeSwitcher />
        <MainColorSwitcher />
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Register Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <a href="" className="flex items-center pt-5 -intro-x">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-6"
                  src={logoUrl}
                />
                <span className="ml-3 text-lg text-white"> Mallify360 </span>
              </a>
              <div className="my-auto">
                <img
                  alt="Midone Tailwind HTML Admin Template"
                  className="w-1/2 -mt-16 -intro-x"
                  src={illustrationUrl}
                />
                <div className="mt-10 text-4xl font-medium leading-tight text-white -intro-x">
                 Please complete your store<br />
                 basic information, you can edit it later.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div>
              </div>
            </div>
            {/* END: Register Info */}
             {/* BEGIN: Page Layout */}
             <div className="p-5 mt-5 intro-y box ">
                            <form onSubmit={handleSubmit} className="">
                                <div className="flex mt-5">
                                    <FormLabel className="w-40" htmlFor="name">
                                        Store Name
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                name: e.target.value,
                                            });
                                        }}
                                        autoComplete="none"
                                        id="name"
                                        placeholder="store name"
                                        type="text"
                                        value={store.name}
                                    />
                                </div>

                                <div className="flex mt-5">
                                    <FormLabel
                                        className="w-40 "
                                        htmlFor="description"
                                    >
                                        Store Description
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                description: e.target.value,
                                            });
                                        }}
                                        id="description"
                                        placeholder="store description"
                                        type="text"
                                        value={store.description}
                                    />
                                </div>
                                <div className="flex mt-5">
                                    <FormLabel
                                        className="w-40"
                                        htmlFor="location"
                                    >
                                        Store Location
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                location: e.target.value,
                                            });
                                        }}
                                        id="location"
                                        placeholder="store location"
                                        type="text"
                                        value={store.location}
                                    />
                                </div>
                                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Category
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormSelect
                                                id="category"
                                                value={catigory}
                                                onChange={(e) => {
                                                    setCatigory(
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                            >
                                                {categories.map(
                                                    (catigory, index) => (
                                                        <option
                                                            key={index}
                                                            value={catigory.id}
                                                        >
                                                            {catigory.name}
                                                        </option>
                                                    )
                                                )}
                                            </FormSelect>
                                        </div>
                                    </FormInline>
                                <div className="flex mt-5">
                                    <FormLabel className="w-40" htmlFor="email">
                                        Store Email
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                email: e.target.value,
                                            });
                                        }}
                                        id="email"
                                        placeholder="store email"
                                        type="email"
                                        value={store.email}
                                    />
                                </div>
                                <div className="flex mt-5">
                                    <FormLabel className="w-40" htmlFor="phone">
                                        Store Phone
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                phone: e.target.value,
                                            });
                                        }}
                                        id="phone"
                                        placeholder="store phone"
                                        type="text"
                                        autoComplete="none"
                                        value={store.phone}
                                    />
                                </div>

                                <div className="flex mt-5">
                                    <FormLabel
                                        className="w-40"
                                        htmlFor="facebook"
                                    >
                                        Store Facebook URL
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                facebook: e.target.value,
                                            });
                                        }}
                                        id="facebook"
                                        placeholder="store facebook url"
                                        type="text"
                                        value={store.facebook}
                                    />
                                </div>

                                <div className="flex mt-5">
                                    <FormLabel
                                        className="w-40"
                                        htmlFor="instagram"
                                    >
                                        Store Instagram URL
                                    </FormLabel>
                                    <FormInput
                                        onChange={(e) => {
                                            setStore({
                                                ...store,
                                                instagram: e.target.value,
                                            });
                                        }}
                                        id="instagram"
                                        placeholder="store instagram url"
                                        type="text"
                                        value={store.instagram}
                                    />
                                </div>

                                <div className="mt-5">
                                    <Button type="submit" variant="primary">
                                        Save
                                    </Button>
                                </div>
                            </form>
                        </div>
                        {/* END: Page Layout */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
