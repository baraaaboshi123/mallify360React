import React, { useEffect, useState } from "react";
import Lucide from "../../base-components/Lucide";
import { FormCheck, FormInline, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
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
import axios from "axios";

type Props = {};

export default function index({}: Props) {
    const [followers, setFollowers] = useState([]);
    const [owners, setOwners] = useState([]);
    const [to, setTo] = useState("")
    const fetchMobileUsers = async () => {
        await axios
            .get(
                `http://localhost:8000/getMobileUsers`
            )
            .then((response) => {
                setFollowers(response.data);
            });
    };

    const fetchOwners = async () => {
        await axios
            .get(
                `http://localhost:8000/getOwners`
            )
            .then((response) => {
                setOwners(response.data);
            });
    };
    useEffect(() => {
        fetchMobileUsers();
        fetchOwners()
    }, []);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const addDataToFirestore = async () => {
        try {
            // Reference to a Firestore collection
            const dataCollection = collection(database, `notifications/`);
            if(to === "users")
          {
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                users: followers,
                title: title,
                content: content,
                type: 4,
                flag: 4,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });
          }
          else if(to === "stores"){
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                users: owners,
                title: title,
                content: content,
                type: 5,
                flag: 5,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });
          }
            

            console.log("Data added to Firestore successfully!");
            setTitle("")
            setContent("")
        } catch (error) {
            console.error("Error adding data to Firestore: ", error);
        }
    };
    return (
        <div>
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
                        <div className="mt-5">
                        <FormInline>
                            <FormLabel>
                                To
                            </FormLabel>
                            <div className="flex-1 w-full mt-3 xl:mt-0">
                                        <div className="flex flex-col sm:flex-row">
                                            <FormCheck className="mr-4">
                                                <FormCheck.Input
                                                    id="condition-new"
                                                    type="radio"
                                                    name="horizontal_radio_button"
                                                    value="users"
                                                    checked={to === "users"}
                                                    onChange={(e) => {
                                                       setTo("users")
                                                    }}
                                                />
                                                <FormCheck.Label htmlFor="condition-new">
                                                    Mobile Users
                                                </FormCheck.Label>
                                            </FormCheck>
                                            <FormCheck className="mt-2 mr-4 sm:mt-0">
                                                <FormCheck.Input
                                                    id="condition-second"
                                                    type="radio"
                                                    name="horizontal_radio_button"
                                                    value="stores"
                                                    checked={to === "stores"}
                                                    onChange={(e) => {
                                                        setTo(
                                                           "stores"
                                                        );
                                                        
                                                    }}
                                                />
                                                <FormCheck.Label htmlFor="condition-second">
                                                    Stores owners
                                                </FormCheck.Label>
                                            </FormCheck>
                                        </div>
                                    </div>
                        </FormInline>
                        </div>
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
                                    This notification will be send to mobile users
                                    or stores owners.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
