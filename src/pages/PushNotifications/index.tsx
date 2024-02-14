import React, { useEffect, useRef, useState } from "react";
import Lucide from "../../base-components/Lucide";
import { FormInline, FormInput, FormLabel } from "../../base-components/Form";
import Button from "../../base-components/Button";
import { app, database } from "../../../firebase";
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    query,
    orderBy,
    Timestamp,
    FieldValue,
    onSnapshot,
} from "firebase/firestore";
import { ref, set, get } from "firebase/database";
import Notification, { NotificationElement } from "../../base-components/Notification";

import axios from "axios";

type Props = {};

export default function index({}: Props) {
    const [followers, setFollowers] = useState([]);
    const fetchStoreFollowers = async () => {
        await axios
            .get(
                `http://localhost:8000/getFollowers/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setFollowers(response.data);
            });
    };
    useEffect(() => {
        localStorage.setItem("page", "Push Notifications")
        fetchStoreFollowers();
    }, []);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const addDataToFirestore = async () => {
        try {
            // Reference to a Firestore collection
            const dataCollection = collection(database, `notifications/`);

            // Add a new document with the data
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                users: followers,
                title: title,
                content: content,
                type: 1,
                flag: 1,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });

            console.log("Data added to Firestore successfully!");
            successNotificationToggle()
            setTitle("")
            setContent("")
        } catch (error) {
            console.error("Error adding data to Firestore: ", error);
        }
    };
    const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };
    return (
        <div>
             {/* BEGIN: Notification Content */}
     <Notification getRef={(el)=> {
        successNotification.current = el;
        }}
        className="flex"
        >
        <Lucide icon="CheckCircle" className="text-success" />
        <div className="ml-4 mr-4">
            <div className="font-medium">Success</div>
            <div className="mt-1 text-slate-500">
                Notification pushed successfully.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
            <div className="flex items-center mt-8 intro-y">
                <h2 className="mr-auto text-lg font-medium">
                    Push Notification
                </h2>
            </div>
            <div className="grid grid-cols-11 pb-20 mt-5 gap-x-6">
                <div className="p-5 intro-y box col-span-9">
                    <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                        <div className="flex items-center pb-5 text-base font-medium  ">
                            <Lucide
                                icon="ChevronDown"
                                className="w-4 h-4 mr-2"
                            />{" "}
                            Add Notification
                        </div>
                    </div>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            addDataToFirestore();
                        }}
                    >
                        <div className="mt-5 ">
                            <FormInline>
                                <FormLabel htmlFor="title" className="w-40">
                                    Title
                                </FormLabel>
                                <FormInput type="text" id="title" required 
                                value={title}
                                onChange={(e)=>setTitle(e.target.value)}
                                />
                            </FormInline>
                        </div>
                        <div className="mt-5">
                            <FormInline>
                                <FormLabel htmlFor="content" className="w-40">
                                    Content
                                </FormLabel>
                                <FormInput type="text" id="content" required
                                value={content}
                                onChange={(e)=>setContent(e.target.value)}
                                />
                            </FormInline>
                            <Button
                                variant="primary"
                                className="mt-5"
                                type="submit"
                            >
                                Push
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="hidden col-span-2 intro-y 2xl:block">
                    <div className="sticky top-0 pt-1">
                        <div className="relative p-5 mt-10 border rounded-md bg-warning/20 dark:bg-darkmode-600 border-warning dark:border-0">
                            <Lucide
                                icon="Lightbulb"
                                className="absolute top-0 right-0 w-12 h-12 mt-5 mr-3 text-warning/80"
                            />
                            <h2 className="text-lg font-medium">Tips</h2>
                            <div className="mt-5 font-medium">Notification</div>
                            <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                                <div>
                                    This notification will be send to your store
                                    followers.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
