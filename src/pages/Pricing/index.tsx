import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";

import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import { useState, ChangeEvent } from "react";
import clsx from "clsx";
import axios from "axios";
import Lucide from "../../base-components/Lucide";
import Paypal from "../Paypal";

function Main() {
  const navigate = useNavigate()
  const [check, setCheck] = useState(0)
  

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
                 Please select your plan, <br />
                  Choose most plan suitable for your business.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div>
              </div>
            </div>
            {/* END: Register Info */}
            {/* BEGIN: Pricing Layout */}
      <div className="flex flex-col mt-5 intro-y box lg:flex-row">
        <div className="flex-1 px-5 py-16 intro-y">
          <Lucide
            icon="CreditCard"
            className="block w-12 h-12 mx-auto text-primary"
          />
          <div className="mt-10 text-xl font-medium text-center">
            Basic Plan
          </div>
          <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
            1 Month <span className="mx-1">•</span> 20 Products{" "}
            <span className="mx-1">•</span> 2 External Ads
          </div>
          <div className="px-10 mx-auto mt-2 text-center text-slate-500">
            this plan is suitable for small stores.
          </div>
          <div className="flex justify-center">
            <div className="relative mx-auto mt-8 text-5xl font-semibold">
              <span className="absolute top-0 left-0 -ml-4 text-2xl">₪</span> 100
            </div>
          </div>
          <Button
            variant="primary"
            rounded
            type="button"
            className="block px-4 py-3 mx-auto mt-8"
            onClick={()=>{
              //setCheckout(true)
              localStorage.setItem("payment_amount","100");
              localStorage.setItem("plan","basic")

              setCheck(1)
            }}
          >
            PURCHASE NOW
          </Button>
          {check === 1 ? 
        (
          <div className="mt-2">
            <Paypal/>
          </div>
        )  :""
        }
          
          
        </div>


        <div className="flex-1 p-5 py-16 border-t border-b intro-y lg:border-b-0 lg:border-t-0 lg:border-l lg:border-r border-slate-200/60 dark:border-darkmode-400">
          <Lucide
            icon="Briefcase"
            className="block w-12 h-12 mx-auto text-primary"
          />
          <div className="mt-10 text-xl font-medium text-center">Business</div>
          <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
            1 Month <span className="mx-1">•</span> 40 Products{" "}
            <span className="mx-1">•</span> 5 External Ads
          </div>
          <div className="px-10 mx-auto mt-2 text-center text-slate-500">
            this plan is suitable for medium stores.
          </div>
          <div className="flex justify-center">
            <div className="relative mx-auto mt-8 text-5xl font-semibold">
              <span className="absolute top-0 left-0 -ml-4 text-2xl">₪</span> 150
            </div>
          </div>
          <Button
            variant="primary"
            rounded
            type="button"
            className="block px-4 py-3 mx-auto mt-8"
            onClick={()=>{
                //setCheckout(true)
                localStorage.setItem("payment_amount","150");
                localStorage.setItem("plan","business")

                setCheck(1)
              }}
          >
           PURCHASE NOW
          </Button>
          {check === 1 ? 
        (
          <div className="mt-2">
            <Paypal/>
          </div>
        )  :""
        }
        </div>
        <div className="flex-1 px-5 py-16 intro-y">
          <Lucide
            icon="ShoppingBag"
            className="block w-12 h-12 mx-auto text-primary"
          />
          <div className="mt-10 text-xl font-medium text-center">
            Enterprise
          </div>
          <div className="mt-5 text-center text-slate-600 dark:text-slate-500">
            1 Month <span className="mx-1">•</span> 100 Products{" "}
            <span className="mx-1">•</span> 10 External Ads
          </div>
          <div className="px-10 mx-auto mt-2 text-center text-slate-500">
            this plan is suitable for big stores.
          </div>
          <div className="flex justify-center">
            <div className="relative mx-auto mt-8 text-5xl font-semibold">
              <span className="absolute top-0 left-0 -ml-4 text-2xl">₪</span>{" "}
              300
            </div>
          </div>
          <Button
            variant="primary"
            rounded
            type="button"
            className="block px-4 py-3 mx-auto mt-8"
            onClick={()=>{
                //setCheckout(true)
                localStorage.setItem("payment_amount","300");
                localStorage.setItem("plan","enterprise")
                setCheck(1)
              }}
          >
            PURCHASE NOW
          </Button>
          {check === 1 ? 
        (
          <div className="mt-2">
            <Paypal/>
          </div>
        )  :""
        }
        </div>
      </div>
      {/* END: Pricing Layout */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
