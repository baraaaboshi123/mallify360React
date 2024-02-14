import React, { useEffect, useRef, useState } from "react";
import { Dialog, Disclosure } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
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
import {
    FormCheck,
    FormInline,
    FormInput,
    FormLabel,
} from "../../base-components/Form";
import axios from "axios";
import Tippy from "../../base-components/Tippy";

type Props = {};

export default function index({}: Props) {

    const [followers, setFollowers] = useState([]);
    const fetchStoreFollowers = async () => {
        
            await axios.get(
                `http://localhost:8000/getFollowers/${localStorage.getItem(
                    "store_id"
                )}`
            )
        .then((response) => {
            setFollowers(response.data);
        });
    };
    const [addModal, setAddModal] = useState(false);
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});
    const deleteButtonRef = useRef(null);
    const addButtonRef = useRef(null);
    const [days, setDays] = useState<number>(0);
    const [deleteConfirmationModal1, setDeleteConfirmationModal1] =
        useState(false);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const getCurrentDate = (): string => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, "0");
        const day = today.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [endDate, setEndDate] = useState<string>(getCurrentDate());
    const [productId, setProductId] = useState(0);
    const handleDaysChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enteredDays = parseInt(event.target.value, 10) || 0;
        setDays(enteredDays);

        // Calculate the new end date based on the entered days
        const newEndDate = new Date();
        newEndDate.setDate(newEndDate.getDate() + enteredDays);

        // Format the new end date
        const year = newEndDate.getFullYear();
        const month = (newEndDate.getMonth() + 1).toString().padStart(2, "0");
        const day = newEndDate.getDate().toString().padStart(2, "0");
        const formattedEndDate = `${year}-${month}-${day}`;

        // Update the state with the new end date
        setEndDate(formattedEndDate);
    };
    const [percentage, setPercentage] = useState(0);
    const [categories, setCategories] = useState<
        Array<{
            id: number;
            name: string;
        }>
    >([]);
    const fetchCatigories = () => {
        axios
            .get(
                `http://localhost:8000/catigories/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setCategories(response.data);
            });
    };
    useEffect(() => {
        localStorage.setItem("page", "Add Sale")
        fetchCatigories();
        fetchStoreFollowers()
    }, []);
    const [products, setProducts] = useState<
        Array<{
            category: {
                name: string;
                id: number;
            };
            products: Array<{
                name: string;
                id: number;
                path: string;
            }>;
        }>
    >([]);
    const getImageSrc = async (productId: number) => {
        try {
            // Make an API call to fetch the image source based on the productId
            const response = await axios.get(
                `http://localhost:8000/getImagesWeb/${productId}`
            );
            return response.data.images[0]; // Adjust the property based on your API response
        } catch (error) {
            console.error("Error fetching image source:", error);
            return ""; // Return a default or empty string in case of an error
        }
    };
    const fetchProductsForCategory = async (categoryId: number) => {
        const response = await fetch(
            `http://localhost:8000/productsCategory/${categoryId}`
        );
        const data = await response.json();
        return data;
    };
    useEffect(() => {
        const fetchData = async () => {
            const productsArray = await Promise.all(
                categories.map(async (faker) => {
                    const categoryProducts = await fetchProductsForCategory(
                        faker.id
                    );
                    return { category: faker, products: categoryProducts };
                })
            );

            setProducts(productsArray);
        };

        fetchData();
    }, [categories]);
    useEffect(() => {
        // Use Promise.all to wait for all image fetching promises to complete
        Promise.all(
            products.map(({ products: categoryProducts }) =>
                Promise.all(
                    categoryProducts.map((product) =>
                        getImageSrc(product.id).then((imageSrc) => {
                            setProductImages((prevImages) => ({
                                ...prevImages,
                                [product.id]: imageSrc,
                            }));
                        })
                    )
                )
            )
        );
    }, [products]);

    const addDataToFirestore = async () => {
        try {
            // Reference to a Firestore collection
            const dataCollection = collection(database, `notifications/`);

            // Add a new document with the data
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                users: followers,
                title: "New Sales",
                content: "New sales added, please have a look.",
                type: 1,
                flag:1,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });

            console.log("Data added to Firestore successfully!");
        } catch (error) {
            console.error("Error adding data to Firestore: ", error);
        }
    };
    return (
        <div>
            <div className="text-lg p-5">New Sale</div>
            <form
                onSubmit={(e: any) => {
                    e.preventDefault();
                    axios
                        .post(
                            `http://localhost:8000/addSale/${localStorage.getItem(
                                "store_id"
                            )}`,
                            {
                                product_id: productId,
                                percentage: percentage,
                                days: days,
                                end_date: endDate,
                            }
                        )
                        .then((response) => {
                            console.log(response.data.message);
                            addDataToFirestore()
                            setAddModal(false);

                        });
                }}
            >
                <div className="p-5 box">
                   
                    <FormInline className="mt-2">
                        <FormLabel className="w-40" htmlFor="product_id">
                            Product ID
                        </FormLabel>
                        <FormInput
                            type="number"
                            id="product_id"
                            value={productId}
                            onChange={(e) => {
                                setProductId(parseInt(e.target.value));
                            }}
                        />
                        <Button
                            variant="primary"
                            className="mx-2"
                            onClick={() => {
                                setDeleteConfirmationModal1(true);
                            }}
                        >
                            choose product
                        </Button>
                    </FormInline>
                    <FormInline className="mt-2">
                        <FormLabel className="w-40" htmlFor="per">
                            Sale Percentage
                        </FormLabel>
                        <FormInput
                            type="number"
                            id="per"
                            value={percentage}
                            onChange={(e) => {
                                setPercentage(parseInt(e.target.value));
                            }}
                        />
                    </FormInline>
                    <FormInline className="mt-2">
                        <FormLabel className="w-40" htmlFor="days">
                            Days
                        </FormLabel>
                        <FormInput
                            type="number"
                            id="days"
                            value={days}
                            onChange={handleDaysChange}
                        />
                    </FormInline>
                    <FormInline className="mt-2">
                        <FormLabel className="w-40" htmlFor="per">
                            End Date
                        </FormLabel>
                        <FormInput type="date" value={endDate} id="per" />
                    </FormInline>
                    <Button
                        variant="primary"
                        type="submit"
                        className="m-5"
                        ref={addButtonRef}
                    >
                        Add
                    </Button>
                </div>
               
                    
                    
               
            </form>
            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal1}
                onClose={() => {
                    setDeleteConfirmationModal1(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <div className="box text-center p-8">
                        <p className="text-xl">choose one product</p>
                        <Disclosure.Group>
                            {products.map(
                                (
                                    { category, products: categoryProducts },
                                    fakerKey
                                ) => (
                                    <Disclosure key={fakerKey}>
                                        <div className="flex">
                                            <div className="w-6">
                                                <Disclosure.Button>
                                                    <Lucide icon="ChevronDown" />
                                                </Disclosure.Button>
                                            </div>
                                            <div>
                                                <FormCheck>
                                                    <FormCheck.Label>
                                                        {category.name}
                                                    </FormCheck.Label>
                                                </FormCheck>
                                            </div>
                                        </div>
                                        <Disclosure.Panel>
                                            {/* Map through and display the products for the current category */}
                                            {categoryProducts.map(
                                                (product, productKey) => (
                                                    <div key={productKey}></div>
                                                )
                                            )}
                                            <Table className="border-spacing-y-[10px] border-separate -mt-2">
                                                <Table.Thead>
                                                    <Table.Tr>
                                                        <Table.Th className="  border-b-0 whitespace-nowrap">
                                                            PRODUCT IMAGE
                                                        </Table.Th>
                                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                                            PRODUCT NAME
                                                        </Table.Th>

                                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                                            ACTIONS
                                                        </Table.Th>
                                                    </Table.Tr>
                                                </Table.Thead>
                                                <Table.Tbody>
                                                    {categoryProducts.map(
                                                        (
                                                            product,
                                                            productKey
                                                        ) => (
                                                            <Table.Tr
                                                                key={productKey}
                                                                className="intro-x"
                                                            >
                                                                <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                                    <div className="w-10 h-10 image-fit zoom-in">
                                                                        <Tippy
                                                                            as="img"
                                                                            alt="Midone Tailwind HTML Admin Template"
                                                                            className="rounded-full  shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                                            src={
                                                                                productImages[
                                                                                    product
                                                                                        .id
                                                                                ] ||
                                                                                ""
                                                                            }
                                                                            content={`Uploaded at`}
                                                                        />
                                                                    </div>
                                                                </Table.Td>
                                                                <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                                    <a
                                                                        href=""
                                                                        className="font-medium text-center  whitespace-nowrap"
                                                                    >
                                                                        {
                                                                            product.name
                                                                        }
                                                                    </a>
                                                                </Table.Td>

                                                                <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                                                    <div className="flex items-center justify-center">
                                                                        <Button
                                                                            variant="primary"
                                                                            onClick={() => {
                                                                                setProductId(
                                                                                    product.id
                                                                                );
                                                                                setDeleteConfirmationModal1(
                                                                                    false
                                                                                );
                                                                            }}
                                                                        >
                                                                            select
                                                                        </Button>
                                                                    </div>
                                                                </Table.Td>
                                                            </Table.Tr>
                                                        )
                                                    )}
                                                </Table.Tbody>
                                            </Table>
                                        </Disclosure.Panel>
                                    </Disclosure>
                                )
                            )}
                        </Disclosure.Group>
                    </div>
                    <Button
                        variant="secondary"
                        className="m-5"
                        onClick={() => setDeleteConfirmationModal1(false)}
                    >
                        close
                    </Button>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
        </div>
    );
}
