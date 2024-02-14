import _, { parseInt } from "lodash";
import clsx from "clsx";
import { useState, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import { FormInput, FormTextarea } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Menu, Tab } from "../../base-components/Headless";
import { app, database } from "../../../firebase";
import { format } from "date-fns";
import UserImage from "../Page1/user.png";
import axios from "axios";
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
type UserData = {
    id: number;
    name: string;
    // Include other user properties as needed
};
type Message = {
    message_type: number;
    text: string;
    formated_time: string;
    store_id: number;
    user_id: number;
    timestamp: FieldValue;
};
function Main() {
    const [id, setId] = useState(0);
    const [storeName, setStoreName] = useState("");
    const [store, setStore] = useState<
    {
        name:string;
        email:string;
        phone:string;
        location:string;
        created_at: string;
    }>({
        name: "",
        email: "",
        phone: "",
        location: "",
        created_at: ""

    })
    const fetchStoreInfo = async () => {
        await axios
            .get(
                `http://localhost:8000/store/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setStore(response.data)
                setStoreName(response.data.name);
            });
    };

    // const writeDataRef = ref(database, "chats/chat2/messages");
    // const newData = {
    //     store_id: 1,
    //     message_type: 0,
    //     text: "hello baraa",
    //     user_id: 2,
    // };
    // set(writeDataRef, newData)
    //     .then(() => {
    //         console.log("Data written to the database successfully!");
    //     })
    //     .catch((error) => {
    //         console.error("Error writing data to the database:", error);
    //     });

    const addDataToFirestore = async () => {
        try {
            // Reference to a Firestore collection
            const dataCollection = collection(
                database,
                `chats/${id}-${localStorage.getItem("store_id")}/messages`
            );

            // Add a new document with the data
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                user_id: id,
                text: messageValue,
                message_type: 1,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });

            console.log("Data added to Firestore successfully!");
            setMessageValue("");
        } catch (error) {
            console.error("Error adding data to Firestore: ", error);
        }
    };
    const [messageValue, setMessageValue] = useState("");
    const [chats, setChats] = useState<
        Array<{
            participants: number[];
        }>
    >([]);

    const [userDataMap, setUserDataMap] = useState<{
        [key: number]: { name: string };
    }>({});
    async function getUserDataFromAPI(user_id: number): Promise<any> {
        try {
            const response = await fetch(
                `http://localhost:8000/user/${user_id}`
            );
            if (!response.ok) {
                throw new Error(
                    `Failed to fetch user data for user_id ${user_id}`
                );
            }
            const userData = await response.json();
            return userData;
        } catch (error) {
            console.error(
                `Error fetching user data for user_id ${user_id}: `,
                error
            );
            throw error;
        }
    }

    
    const getAllChatsForStore = async (): Promise<any[]> => {
        try {
            // Reference to the Firestore collection
            const dataCollection = collection(database, `chats/`);

            // Query the collection
            const querySnapshot = await getDocs(dataCollection);

            // Array to store the filtered chat messages
            let filteredChatMessages: any[] = [];

            // Loop through each document in the collection
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Check if the second element of the 'participants' array matches the storeId
                if (
                    data.participants &&
                    data.participants[1] ===
                        parseInt(localStorage.getItem("store_id") || "0")
                ) {
                    // Add the document data to the filteredChatMessages array
                    filteredChatMessages.push(data);
                    console.log(data);
                    const userDataObject: { [key: number]: any } = {};
                    const userData = getUserDataFromAPI(data.participants[0]);
                    userDataObject[data.participants[0]] = userData;
                    setUserDataMap(userDataObject);
                }
                // console.log(filteredChatMessages);
                setChats(filteredChatMessages);
            });

            console.log(
                "Filtered chat messages for the store retrieved successfully!"
            );
            return filteredChatMessages;
        } catch (error) {
            console.error(
                "Error retrieving filtered chat messages from Firestore: ",
                error
            );
            throw error;
        }
    };
    const [userMessages, setUserMessages] = useState<Message[]>([]);

    const getAllChatsMessages = async (id: number): Promise<any[]> => {
        try {
            // Reference to the Firestore collection
            const dataCollection = collection(
                database,
                `chats/${id}-${localStorage.getItem("store_id")}/messages`
            );
            setId(id);

            // Query the collection
            const querySnapshot = await getDocs(
                query(dataCollection, orderBy("timestamp"))
            );

            // Array to store the filtered chat messages
            let filteredChatMessages: any[] = [];

            // Loop through each document in the collection
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                // Check if the second element of the 'participants' array matches the storeId

                // Add the document data to the filteredChatMessages array
                filteredChatMessages.push(data);
                //console.log(data);
            });
            setUserMessages(filteredChatMessages);
            console.log(
                "Filtered chat messages for the store retrieved successfully!"
            );
            return [];
        } catch (error) {
            console.error(
                "Error retrieving filtered chat messages from Firestore: ",
                error
            );
            throw error;
        }
    };

    useEffect(() => {
        //addDataToFirestore()
        localStorage.setItem("page", "Chat")
        getAllChatsForStore().then((chats) => {
            setChats(chats);
            fetchStoreInfo();
        });
    }, []);
    const [name, setName] = useState("a");

    const accessNameFromPromise = async (user_id: number) => {
        try {
            const userData = await userDataMap[user_id];
            if (userData && userData.name) {
                const name = userData.name;
                setName(userData.name);
            } else {
                console.error(
                    `User data for user_id ${user_id} does not contain a 'name' property.`
                );
            }
        } catch (error) {
            console.error(
                `Error accessing 'name' property for user_id ${user_id}: `,
                error
            );
        }
    };
    const [selectedId, setSelectedId] = useState(0);

    useEffect(() => {
        // console.log(userDataMap);
    }, [userDataMap]);
    const [chatBox, setChatBox] = useState(false);
    const showChatBox = (id: number) => {
        setSelectedId(id);
        getAllChatsMessages(id);
        setChatBox(!chatBox);
    };

    const [usersData, setUsersData] = useState<UserData[]>([]);

    useEffect(() => {
        const fetchUsersData = async () => {
            const usersPromises = chats.map((obj) => {
                const userId = obj.participants[0]; // Assuming first element is the user ID
                return axios.get(`http://localhost:8000/user/${userId}`); // Replace with your actual API call
            });

            const usersResults = await Promise.all(usersPromises);
            setUsersData(usersResults.map((res) => res.data));
        };

        fetchUsersData();
    }, [chats]);

    const addMessage = (newMessage: Message) => {
        // Create a copy of the existing messages and add the new message
        const updatedMessages = [...userMessages, newMessage];

        // Update the state with the updated messages array
        setUserMessages(updatedMessages);
    };

    useEffect(() => {
        // Reference to the Firestore collection
        const dataCollection = collection(
            database,
            `chats/${id}-${localStorage.getItem("store_id")}/messages`
        );

        // Create a query with ordering by timestamp
        const q = query(dataCollection, orderBy("timestamp"));

        // Set up a real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newMessages: any[] = [];

            querySnapshot.forEach((doc) => {
                const data = doc.data();
                newMessages.push(data);
            });

            setUserMessages(newMessages);
            console.log("Real-time chat messages updated!");
        });

        // Clean up the listener when the component unmounts
        return () => {
            unsubscribe();
        };
    }, [id]);
    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">Chat</h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                   
                </div>
            </div>
            <div className="grid grid-cols-12 gap-5 mt-5 intro-y">
                {/* BEGIN: Chat Side Menu */}
                <Tab.Group className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="pr-1 intro-y">
                        <div className="p-2 box">
                            <Tab.List variant="boxed-tabs">
                                <Tab>
                                    <Tab.Button
                                        className="w-full py-2"
                                        as="button"
                                    >
                                        Chats
                                    </Tab.Button>
                                </Tab>
                                <Tab>
                                    <Tab.Button
                                        className="w-full py-2"
                                        as="button"
                                    >
                                        Profile
                                    </Tab.Button>
                                </Tab>
                            </Tab.List>
                        </div>
                    </div>
                    <Tab.Panels>
                        <Tab.Panel>
                            <div className="pr-1">
                                <div className="px-5 pt-5 pb-5 mt-5 box lg:pb-0">
                                    <div className="relative pb-5 text-slate-500">
                                        <FormInput
                                            type="text"
                                            className="px-4 py-3 pr-10 border-transparent bg-slate-100"
                                            placeholder="Search for messages or users..."
                                        />
                                        <Lucide
                                            icon="Search"
                                            className="inset-y-0 right-0 hidden w-4 h-4 my-auto mr-3 sm:absolute"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="pt-1 pr-1 mt-4 overflow-y-auto h-[525px] scrollbar-hidden">
                                {usersData.map((faker, fakerKey) => (
                                    <div
                                        key={fakerKey}
                                        className={clsx({
                                            "intro-x cursor-pointer box relative flex items-center p-5":
                                                true,
                                            "mt-5": fakerKey,
                                        })}
                                        onClick={() => showChatBox(faker.id)}
                                    >
                                        <div className="flex-none w-12 h-12 mr-1 image-fit">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                className="rounded-full"
                                                src={UserImage}
                                            />
                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                                        </div>
                                        <div className="ml-2 overflow-hidden">
                                            <div className="flex items-center">
                                                <a
                                                    href="#"
                                                    className="font-medium"
                                                >
                                                    {faker.name}
                                                </a>
                                                <div className="ml-auto text-xs text-slate-400">
                                                    {/* {faker.times[0]} */}
                                                </div>
                                            </div>
                                            <div className="w-full truncate text-slate-500 mt-0.5">
                                                {/* {faker.news[0].shortContent} */}
                                            </div>
                                        </div>
                                        {/* {faker.trueFalse[0] && (
                                                <div className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-1 -mr-1 text-xs font-medium text-white rounded-full bg-primary">
                                                   // {faker.notificationCount}
                                                </div>
                                            )} */}
                                    </div>
                                ))}
                            </div>
                        </Tab.Panel>
                       
                        <Tab.Panel>
                            <div className="pr-1">
                                <div className="px-5 py-10 mt-5 box">
                                    <div className="flex-none w-20 h-20 mx-auto overflow-hidden rounded-full image-fit">
                                        <img
                                            alt="Midone Tailwind HTML Admin Template"
                                            src={localStorage.getItem("store_logo") || ""}
                                        />
                                    </div>
                                    <div className="mt-3 text-center">
                                        <div className="text-lg font-medium">
                                            {store.name}
                                        </div>
                                        
                                    </div>
                                </div>
                                <div className="p-5 mt-5 box">
                                    <div className="flex items-center pb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                        <div>
                                            <div className="text-slate-500">
                                                Country
                                            </div>
                                            <div className="mt-1">
                                                {store.location}
                                            </div>
                                        </div>
                                        <Lucide
                                            icon="Globe"
                                            className="w-4 h-4 ml-auto text-slate-500"
                                        />
                                    </div>
                                    <div className="flex items-center py-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                        <div>
                                            <div className="text-slate-500">
                                                Phone
                                            </div>
                                            <div className="mt-1">
                                                {"+"+970 +" "+ store.phone}
                                            </div>
                                        </div>
                                        <Lucide
                                            icon="Mic"
                                            className="w-4 h-4 ml-auto text-slate-500"
                                        />
                                    </div>
                                    <div className="flex items-center py-5 border-b border-slate-200/60 dark:border-darkmode-400">
                                        <div>
                                            <div className="text-slate-500">
                                                Email
                                            </div>
                                            <div className="mt-1">
                                                {
                                                   store.email
                                                }
                                            </div>
                                        </div>
                                        <Lucide
                                            icon="Mail"
                                            className="w-4 h-4 ml-auto text-slate-500"
                                        />
                                    </div>
                                    <div className="flex items-center pt-5">
                                        <div>
                                            <div className="text-slate-500">
                                                Joined Date
                                            </div>
                                            <div className="mt-1">
                                                {store.created_at}
                                            </div>
                                        </div>
                                        <Lucide
                                            icon="Clock"
                                            className="w-4 h-4 ml-auto text-slate-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Tab.Panel>
                    </Tab.Panels>
                </Tab.Group>
                {/* END: Chat Side Menu */}
                {/* BEGIN: Chat Content */}
                <div className="col-span-12 intro-y lg:col-span-8 2xl:col-span-9">
                    <div className="h-[782px] box">
                        {/* BEGIN: Chat Active */}
                        {chatBox && (
                            <div className="flex flex-col h-full">
                                <div className="flex flex-col px-5 py-4 border-b sm:flex-row border-slate-200/60 dark:border-darkmode-400">
                                    <div className="flex items-center">
                                        <div className="relative flex-none w-10 h-10 sm:w-12 sm:h-12 image-fit">
                                            <img
                                                alt="Midone Tailwind HTML Admin Template"
                                                className="rounded-full"
                                                src={UserImage}
                                            />
                                        </div>
                                        <div className="ml-3 mr-auto">
                                            <div className="text-base font-medium">
                                                {
                                                    usersData.find(
                                                        (user) =>
                                                            user.id ===
                                                            selectedId
                                                    )?.name
                                                }
                                            </div>
                                            <div className="text-xs text-slate-500 sm:text-sm">
                                                Hey, I am using chat{" "}
                                                <span className="mx-1">•</span>{" "}
                                                Online
                                            </div>
                                        </div>
                                    </div>
                                  
                                </div>
                                <div className="flex-1 px-5 pt-5 overflow-y-scroll scrollbar-hidden">
                                    {userMessages.map((m, mk) => (
                                        <>
                                            {m.message_type === 0 ? (
                                                <div
                                                    key={mk}
                                                    className="flex items-end float-left mb-4 max-w-[90%] sm:max-w-[49%]"
                                                >
                                                    <div className="relative flex-none hidden w-10 h-10 mr-5 sm:block image-fit">
                                                        <img
                                                            alt="Midone Tailwind HTML Admin Template"
                                                            className="rounded-full"
                                                             src={UserImage}
                                                        />
                                                    </div>
                                                    <div className="px-4 py-3 bg-slate-100 dark:bg-darkmode-400 text-slate-500 rounded-r-md rounded-t-md">
                                                        {m.text}
                                                        <div className="mt-1 text-xs text-slate-500">
                                                            {/* { format(
    new Date(m.timestamp.seconds * 1000 + m.timestamp.nanoseconds  / 1000000),
    'yyyy-MM-dd HH:mm:ss'
  )} */}{" "}
                                                            {format(
                                                                m.formated_time,
                                                                "yyyy-MM-dd HH:mm:ss"
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="flex items-end float-right mb-4 max-w-[90%] sm:max-w-[49%]">
                                                    <div className="px-4 py-3 text-white bg-primary rounded-l-md rounded-t-md">
                                                        {m.text}
                                                        <div className="mt-1 text-xs text-white text-opacity-80">
                                                            {/* { format(
    new Date(m.timestamp.seconds * 1000 + m.timestamp.nanoseconds  / 1000000),
    'yyyy-MM-dd HH:mm:ss'
  )} */}
                                                            {format(
                                                                m.formated_time,
                                                                "yyyy-MM-dd HH:mm:ss"
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="relative flex-none hidden w-10 h-10 ml-5 sm:block image-fit">
                                                        <img
                                                            alt="Midone Tailwind HTML Admin Template"
                                                            className="rounded-full"
                                                            src={
                                                                localStorage.getItem(
                                                                    "store_logo"
                                                                ) || ""
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            <div className="clear-both"></div>
                                        </>
                                    ))}
                                </div>
                                <div className="flex items-center pt-4 pb-10 border-t sm:py-4 border-slate-200/60 dark:border-darkmode-400">
                                    <FormTextarea
                                        className="px-5 py-3 border-transparent shadow-none resize-none h-[46px] dark:bg-darkmode-600 focus:border-transparent focus:ring-0"
                                        rows={1}
                                        placeholder="Type your message..."
                                        value={messageValue}
                                        onChange={(e) => {
                                            setMessageValue(e.target.value);
                                        }}
                                    ></FormTextarea>
                                    <div className="absolute bottom-0 left-0 flex mb-5 ml-5 sm:static sm:ml-0 sm:mb-0">
                                      
                                    </div>
                                    <a
                                        className="flex items-center justify-center flex-none w-8 h-8 mr-5 text-white rounded-full sm:w-10 sm:h-10 bg-primary"
                                        onClick={() => {
                                            addDataToFirestore();
                                            const newMessage = {
                                                store_id: parseInt(
                                                    localStorage.getItem(
                                                        "store_id"
                                                    ) || "0"
                                                ),
                                                user_id: id,
                                                text: messageValue,
                                                message_type: 1,
                                                timestamp: serverTimestamp(),
                                                formated_time:
                                                    new Date().toISOString(),
                                            };
                                            addMessage(newMessage);
                                        }}
                                    >
                                        <Lucide
                                            icon="Send"
                                            className="w-4 h-4"
                                        />
                                    </a>
                                </div>
                            </div>
                        )}
                        {/* END: Chat Active */}
                        {/* BEGIN: Chat Default */}
                        {!chatBox && (
                            <div className="flex items-center h-full">
                                <div className="mx-auto text-center">
                                    <div className="flex-none w-16 h-16 mx-auto overflow-hidden rounded-full image-fit">
                                        <img
                                            alt="Midone Tailwind HTML Admin Template"
                                            src={
                                                localStorage.getItem(
                                                    "store_logo"
                                                ) || ""
                                            }
                                        />
                                    </div>
                                    <div className="mt-3">
                                        <div className="font-medium">
                                            Hey, {storeName}!
                                        </div>
                                        <div className="mt-1 text-slate-500">
                                            Please select a chat to start
                                            messaging.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* END: Chat Default */}
                    </div>
                </div>
                {/* END: Chat Content */}
            </div>
        </>
    );
}

export default Main;
