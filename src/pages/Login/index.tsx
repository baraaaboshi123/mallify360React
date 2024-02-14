import DarkModeSwitcher from "../../components/DarkModeSwitcher";
import MainColorSwitcher from "../../components/MainColorSwitcher";
import logoUrl from "../../assets/images/logo.svg";
import illustrationUrl from "../../assets/images/illustration.svg";
import { FormInput, FormCheck } from "../../base-components/Form";
import Button from "../../base-components/Button";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import Notification, { NotificationElement } from "../../base-components/Notification";

import axios from "axios";
import Lucide from "../../base-components/Lucide";

function Main() {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loginFailed, setLoginFailed] = useState(false);


  const handleSubmit = (e : any ) =>{ 
    e.preventDefault();
    axios.post("http://localhost:8000/login",{
      email: email,
      password: password
    })
    .then((response) => {
      if(response.status == 201){
        faildNotificationToggle()
      }
      else if(response.data.message 
        !== 'wrong email or password.'){
          localStorage.setItem("id",response.data.id)
          localStorage.setItem("store_id",response.data.store_id)
          localStorage.setItem("role", response.data.role)
          localStorage.setItem("email",email)
          navigate("/")
        }
        else {
setLoginFailed(true)
        }
      
    })
  }
  const faildNotification = useRef<NotificationElement | null>(null);
  const faildNotificationToggle = () => {
      if (faildNotification.current) {
        faildNotification.current.showToast();
      }
    };
  return (
    <>
     {/* BEGIN: Notification Content */}
     <Notification getRef={(el)=> {
        faildNotification.current = el;
        }}
        className="flex"
        >
        <Lucide icon="X" className="text-danger" />
        <div className="ml-4 mr-4">
            <div className="font-medium">Faild</div>
            <div className="mt-1 text-slate-500">
            your account has been deactivated contact with the admin.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
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
            {/* BEGIN: Login Info */}
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
                  A few more clicks to <br />
                  sign in to your account.
                </div>
                <div className="mt-5 text-lg text-white -intro-x text-opacity-70 dark:text-slate-400">
                  Manage all your e-commerce accounts in one place
                </div>
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <form onSubmit={handleSubmit}>
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl xl:text-left">
                  Sign In
                </h2>
                <div className="mt-2 text-center intro-x text-slate-400 xl:hidden">
                  A few more clicks to sign in to your account. Manage all your
                  e-commerce accounts in one place
                </div>
                <div className="mt-8 intro-x">             
                <FormInput
    type="text"
    className={`block px-4 py-3 intro-x min-w-full xl:min-w-[350px] ${loginFailed ? 'border-red-500' : ''}`}
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
/>
<FormInput
    type="password"
    className={`block px-4 py-3 mt-4 intro-x min-w-full xl:min-w-[350px] ${loginFailed ? 'border-red-500' : ''}`}
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
/>
                </div>
                <div className="flex mt-4 text-xs intro-x text-slate-600 dark:text-slate-500 sm:text-sm">
                  <div className="flex items-center mr-auto">
                    <FormCheck.Input
                      id="remember-me"
                      type="checkbox"
                      className="mr-2 border"
                    />
                    <label
                      className="cursor-pointer select-none"
                      htmlFor="remember-me"
                    >
                      Remember me
                    </label>
                  </div>
                  <a href="/forgetPass">Forgot Password?</a>
                </div>
                <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
                  <Button
                  type="submit"
                    variant="primary"
                    className="w-full px-4 py-3 align-top xl:w-32 xl:mr-3"
                   
                  >
                    Login
                  </Button>
                  <Button
                    variant="outline-secondary"
                    className="w-full px-4 py-3 mt-3 align-top xl:w-32 xl:mt-0"
                    onClick={()=> navigate("/register")}
                  >
                    Register
                  </Button>
                </div>
                <div className="mt-10 text-center intro-x xl:mt-24 text-slate-600 dark:text-slate-500 xl:text-left">
                  By signin up, you agree to our{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Terms and Conditions
                  </a>{" "}
                  &{" "}
                  <a className="text-primary dark:text-slate-200" href="">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
            </form>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Main;
