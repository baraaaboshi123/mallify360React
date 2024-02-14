import { useState, Fragment, useEffect } from "react";
import Lucide from "../../base-components/Lucide";
import Breadcrumb from "../../base-components/Breadcrumb";
import { FormInput } from "../../base-components/Form";
import { Menu, Popover } from "../../base-components/Headless";
import fakerData from "../../utils/faker";
import _, { forEach } from "lodash";
import clsx from "clsx";
import { app, database } from "../../../firebase";
import { Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { collection, getDocs } from "firebase/firestore";
import UserImage from "../../pages/Page1/user.png";
import Icon from "./preview.svg";
interface User {
    email: string;
    // Add other properties if needed
}
function Main() {
    const navigate = useNavigate();
    const [logo, setLogo] = useState("");
    const [name, setName] = useState("");
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const fetchLogo = async () => {
        await axios
            .get(
                `http://localhost:8000/getLogo/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setLogo(response.data);
            });
    };
    const fetchstore = async () => {
        await axios
            .get(
                `http://localhost:8000/store/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setName(response.data.name);
            });
    };
    useEffect(() => {
        fetchLogo();
        fetchstore();
    }, []);

    const [searchDropdown, setSearchDropdown] = useState(false);
    const showSearchDropdown = () => {
        setSearchDropdown(true);
    };
    const hideSearchDropdown = () => {
        setSearchDropdown(false);
    };

    const getAllNotificationsForStore = async (): Promise<any[]> => {
        try {
            const storeId = localStorage.getItem("store_id") || "0";
            const notificationsCollection = collection(
                database,
                `notifications`
            );
            const notificationsQuerySnapshot = await getDocs(
                notificationsCollection
            );
            let filteredNotifications: any[] = [];
            notificationsQuerySnapshot.forEach((doc) => {
                const notification = doc.data();
                //console.log(notification.store_id, Array.isArray(notification.store_id)); // C
                // Check if the store_id array contains the storeId
                if (
                    notification.store_id &&
                    Array.isArray(notification.store_id) &&
                    notification.store_id.includes(parseInt(storeId))
                ) {
                    // Add the notification data to the filteredNotifications array
                    filteredNotifications.push({
                        ...notification,
                        id: doc.id, // Include the document ID if necessary
                    });
                }

                if(notification.flag ===5){
                    notification.users.forEach((user:User)=>{
                        if(user.email=== localStorage.getItem("email")){
                           
                            filteredNotifications.push({
                                ...notification,
                                id: doc.id, // Include the document ID if necessary
                            });
                        }
                    })
                    
                }
            });
            setNotifications(filteredNotifications);
            console.log(
                "Filtered notifications for the store retrieved successfully!"
            );
            return filteredNotifications;
        } catch (error) {
            console.error(
                "Error retrieving filtered notifications from Firestore: ",
                error
            );
            throw error;
        }
    };

    useEffect(() => {
        getAllNotificationsForStore().then((filteredNotifications) => {
            setNotifications(filteredNotifications);
        });
    }, []);

    return (
        <>
            {/* BEGIN: Top Bar */}
            <div className="h-[67px] z-[51] flex items-center relative border-b border-slate-200">
                {/* BEGIN: Breadcrumb */}
                <Breadcrumb className="hidden mr-auto -intro-x sm:flex">
                    <Breadcrumb.Link to="/">Application</Breadcrumb.Link>
                    <Breadcrumb.Link to="/" active={true}>
                        {localStorage.getItem("page")}
                    </Breadcrumb.Link>
                </Breadcrumb>
                {/* END: Breadcrumb */}

                {localStorage.getItem("role") === "owner" ? (
                    <Popover className="mr-auto intro-x sm:mr-6">
                        <Popover.Button
                            className="
              relative text-slate-600 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
                        >
                            <Lucide
                                icon="Bell"
                                className="w-5 h-5 dark:text-slate-500"
                            />
                        </Popover.Button>
                        <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
                            <div className="mb-5 font-medium">
                                Notifications
                            </div>
                            {notifications
                                .slice(0, 7)
                                .map((faker, fakerKey) => (
                                    <div
                                        key={fakerKey}
                                        className={clsx([
                                            "cursor-pointer relative flex items-center",
                                            { "mt-5": fakerKey },
                                        ])}
                                    >
                                        <div className="relative flex-none w-12 h-12 mr-1 image-fit">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                className="rounded-full"
                                                src={Icon}
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                                        </div>
                                        <div className="ml-2 overflow-hidden">
                                            <div className="flex items-center">
                                                <a
                                                    href=""
                                                    className="mr-5 font-medium "
                                                >
                                                    {faker.title}
                                                </a>
                                                <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                                                    {faker.formated_time}
                                                </div>
                                            </div>
                                            <div className="w-full  text-slate-500 mt-0.5">
                                                {faker.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </Popover.Panel>
                    </Popover>
                ) : (
                    ""
                )}

                {/* BEGIN: Account Menu */}
                <Menu>
                    <Menu.Button className="block w-8 h-8 overflow-hidden rounded-full shadow-lg image-fit zoom-in intro-x">
                        <img
                            alt="Midone Tailwind HTML Admin Template"
                            src={logo || UserImage}
                        />
                    </Menu.Button>
                    <Menu.Items className="w-56 mt-px text-white bg-primary">
                        <Menu.Header className="font-normal">
                            <div className="font-medium">{name}</div>
                        </Menu.Header>
                        <Menu.Divider className="bg-white/[0.08]" />

                        <Menu.Item
                            onClick={() => navigate("forgetpass")}
                            className="hover:bg-white/5"
                        >
                            <Lucide icon="Lock" className="w-4 h-4 mr-2" />{" "}
                            Reset Password
                        </Menu.Item>

                        <Menu.Divider className="bg-white/[0.08]" />
                        <Menu.Item
                            onClick={() => navigate("/login")}
                            className="hover:bg-white/5"
                        >
                            <Lucide
                                icon="ToggleRight"
                                className="w-4 h-4 mr-2"
                            />{" "}
                            Logout
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
            {/* END: Top Bar */}
        </>
    );
}

export default Main;
