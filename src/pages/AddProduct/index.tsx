import _ from "lodash";
import { useState, useEffect, ChangeEvent, useRef } from "react";
import Button from "../../base-components/Button";
import {
    FormInput,
    FormInline,
    FormSelect,
    FormLabel,
    FormHelp,
    FormCheck,
    InputGroup,
    FormSwitch,
    FormTextarea,
} from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { app, database } from "../../../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Notification, {
    NotificationElement,
} from "../../base-components/Notification";

function Main() {
    const location = useLocation();
    const idFromPreviousPage = location.state?.id;

    const fetchProductInfo = async () => {
        await axios
            .get(`http://localhost:8000/product/${idFromPreviousPage}`)
            .then((response) => {
                setName(response.data.name);
                setEditorData(response.data.description);
                setQuantity(response.data.quantity);
                setStatus(response.data.status);
                setCondition(response.data.condition);
                setPrice(response.data.price);
                setFeatured(response.data.featured);
            });
    };
    const [properties, setProperties] = useState<
        { name: string; values: string[]; quantities: number[] }[]
    >([
        { name: "", values: [""], quantities: [] }, // Initial property with one value
    ]);

    const addProperty = () => {
        setProperties([
            ...properties,
            { name: "", values: [""], quantities: [] },
        ]);
    };

    const handleNameChange = (index: number, name: string) => {
        const updatedProperties = [...properties];
        updatedProperties[index].name = name;
        setProperties(updatedProperties);
    };

    const handleValueChange = (
        propertyIndex: number,
        valueIndex: number,
        value: string
    ) => {
        const updatedProperties = [...properties];
        updatedProperties[propertyIndex].values[valueIndex] = value;
        setProperties(updatedProperties);
    };
    const handleQuantityChange = (
        propertyIndex: number,
        valueIndex: number,
        value: number
    ) => {
        const updatedProperties = [...properties];
        updatedProperties[propertyIndex].quantities[valueIndex] = value;
        setProperties(updatedProperties);
    };

    const addValue = (propertyIndex: number) => {
        const updatedProperties = [...properties];
        updatedProperties[propertyIndex].values.push("");
        setProperties(updatedProperties);
        
    };
    const addQuantity = (propertyIndex: number) => {
        const updatedProperties = [...properties];
        updatedProperties[propertyIndex].quantities.push(0);
        setProperties(updatedProperties);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Send the properties data to your backend for processing
        console.log(properties);
    };

    const [editorData, setEditorData] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [name, setName] = useState("");
    const [catigory, setCatigory] = useState(0);
    const [condition, setCondition] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState(false);
    const [featured, setFeatured] = useState(false);
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState(0);
    const [weight, setWeight] = useState(0);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [length, setLingth] = useState(0);
    const [shippingInsurance, setShippingInsurance] = useState("optional");
    const [categories, setCatigories] = useState<
        Array<{ name: string; id: number }>
    >([]);
    const fetchCatigories = () => {
        axios
            .get(
                `http://localhost:8000/catigories/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setCatigories(response.data);
            });
    };

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
        localStorage.setItem("page", "Add Product");
        if (idFromPreviousPage) {
            fetchProductInfo();
        }
        fetchCatigories();
        fetchStoreFollowers();
    }, []);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCondition(e.target.value);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (files) {
            const newImages: File[] = [];

            for (let i = 0; i < files.length; i++) {
                newImages.push(files[i]);
            }

            setSelectedImages(newImages);
        }
    };

    useEffect(() => {
        if (categories && categories.length > 0) {
            setCatigory(categories[0].id);
        }
    }, [categories]);

    const addDataToFirestore = async () => {
        try {
            // Reference to a Firestore collection
            const dataCollection = collection(database, `notifications/`);

            // Add a new document with the data
            await addDoc(dataCollection, {
                store_id: parseInt(localStorage.getItem("store_id") || "0"),
                users: followers,
                title: "New Arrival",
                content: "New product added, come and have a look now.",
                type: 1,
                flag: 1,
                timestamp: serverTimestamp(),
                formated_time: new Date().toISOString(),
            });

            console.log("Data added to Firestore successfully!");
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
        <>
            <form
                encType="multipart/form-data" // Set enctype to multipart/form-data
                onSubmit={(e) => {
                    e.preventDefault();
                    if (idFromPreviousPage) {
                        const base64Images = selectedImages.map((image) => {
                            const reader = new FileReader();

                            return new Promise((resolve) => {
                                reader.onload = () => {
                                    if (
                                        reader.result &&
                                        typeof reader.result === "string"
                                    ) {
                                        resolve(reader.result.split(",")[1]);
                                    } else {
                                        resolve("");
                                    }
                                };
                                reader.readAsDataURL(image);
                            });
                        });

                        Promise.all(base64Images)
                            .then((base64Images) => {
                                const requestData = {
                                    images: base64Images,
                                    name: name,
                                    quantity: quantity,
                                    condition: condition,
                                    catigory: catigory,
                                    width: width,
                                    weight: weight,
                                    height: height,
                                    length: length,
                                    shippingInsurance: shippingInsurance,
                                    description: editorData,
                                    status: status,
                                    store_id: localStorage.getItem("store_id"),
                                    image_id: 1,
                                    price: price,
                                    featured: featured,
                                    properties: properties,
                                };

                                axios
                                    .put(
                                        `http://localhost:8000/image/${idFromPreviousPage}`,
                                        requestData
                                    )
                                    .then((response) => {
                                        successNotificationToggle();

                                        addDataToFirestore();
                                    })
                                    .catch((error) => {
                                        console.error("Error:", error);
                                    });
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    } else {
                        const base64Images = selectedImages.map((image) => {
                            const reader = new FileReader();

                            return new Promise((resolve) => {
                                reader.onload = () => {
                                    if (
                                        reader.result &&
                                        typeof reader.result === "string"
                                    ) {
                                        resolve(reader.result.split(",")[1]);
                                    } else {
                                        resolve("");
                                    }
                                };
                                reader.readAsDataURL(image);
                            });
                        });

                        Promise.all(base64Images)
                            .then((base64Images) => {
                                const requestData = {
                                    images: base64Images,
                                    name: name,
                                    quantity: quantity,
                                    condition: condition,
                                    catigory: catigory,
                                    width: width,
                                    weight: weight,
                                    height: height,
                                    length: length,
                                    shippingInsurance: shippingInsurance,
                                    description: editorData,
                                    status: status,
                                    store_id: localStorage.getItem("store_id"),
                                    image_id: 1,
                                    price: price,
                                    featured: featured,
                                    properties: properties,
                                };

                                axios
                                    .post(
                                        "http://localhost:8000/image",
                                        requestData
                                    )
                                    .then((response) => {
                                        console.log(response.data.message);
                                        addDataToFirestore();
                                    })
                                    .catch((error) => {
                                        console.error("Error:", error);
                                    });
                            })
                            .catch((error) => {
                                console.error("Error:", error);
                            });
                    }
                }}
            >
                <div className="flex items-center mt-8 intro-y">
                    <h2 className="mr-auto text-lg font-medium">Add Product</h2>
                </div>
                <div className="grid grid-cols-11 pb-20 mt-5 gap-x-6">
                    <div className="col-span-11 intro-y 2xl:col-span-9">
                        {/* BEGIN: Uplaod Product */}
                        <div className="p-5 intro-y box">
                            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Upload Product
                                </div>
                                <div className="mt-5">
                                    <div className="flex items-center text-slate-500">
                                        <span>
                                            <Lucide
                                                icon="Lightbulb"
                                                className="w-5 h-5 text-warning"
                                            />
                                        </span>
                                        <div className="ml-2">
                                            <span className="mr-1">
                                                Avoid selling counterfeit
                                                products / violating
                                                Intellectual Property Rights, so
                                                that your products are not
                                                deleted.
                                            </span>
                                            <a
                                                href="https://themeforest.net/item/midone-jquery-tailwindcss-html-admin-template/26366820"
                                                className="font-medium text-primary"
                                                target="blank"
                                            >
                                                Learn More
                                            </a>
                                        </div>
                                    </div>

                                    <FormInline className="flex-col items-start mt-10 xl:flex-row">
                                        {/* ... Other form elements ... */}
                                        <div className="relative flex items-center justify-center px-4 pb-4 mt-5 cursor-pointer">
                                            <Lucide
                                                icon="Image"
                                                className="w-4 h-4 mr-2"
                                            />
                                            <span className="mr-1 text-primary">
                                                Upload a file
                                            </span>{" "}
                                            or drag and drop
                                            <FormInput
                                                id="horizontal-form-1"
                                                type="file"
                                                className="absolute top-0 left-0 w-full h-full opacity-0"
                                                multiple // Allow multiple file selection
                                                onChange={handleImageUpload} // Handle image upload
                                            />
                                        </div>

                                        {/* Display the selected images */}
                                        <div className="grid grid-cols-6 gap-40  pl-1 pr-1">
                                            {selectedImages.map(
                                                (image, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative col-span-5  cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                                                    >
                                                        <img
                                                            className="rounded-md "
                                                            alt={`Product Image ${index}`}
                                                            src={URL.createObjectURL(
                                                                image
                                                            )}
                                                        />
                                                        <Tippy
                                                            content="Remove this image?"
                                                            className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                                                        >
                                                            <Lucide
                                                                icon="X"
                                                                className="w-4 h-4"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    const updatedImages =
                                                                        [
                                                                            ...selectedImages,
                                                                        ];
                                                                    updatedImages.splice(
                                                                        index,
                                                                        1
                                                                    ); // Remove the clicked image
                                                                    setSelectedImages(
                                                                        updatedImages
                                                                    );
                                                                }}
                                                            />
                                                        </Tippy>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </FormInline>
                                </div>
                            </div>
                        </div>
                        {/* END: Uplaod Product */}
                        {/* BEGIN: Product Information */}
                        <div className="p-5 mt-5 intro-y box">
                            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Product Information
                                </div>
                                <div className="mt-5">
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Product Name
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    Include min. 40 characters
                                                    to make it more attractive
                                                    and easy for buyers to find,
                                                    consisting of product type,
                                                    brand, and information such
                                                    as color, material, or type.
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput
                                                id="product-name"
                                                type="text"
                                                placeholder="Product name"
                                                value={name}
                                                onChange={(e) =>
                                                    setName(e.target.value)
                                                }
                                            />
                                            <FormHelp className="text-right">
                                                Maximum character 0/70
                                            </FormHelp>
                                        </div>
                                    </FormInline>
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
                                    {/* <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                  <FormLabel className="xl:w-64 xl:!mr-10">
                    <div className="text-left">
                      <div className="flex items-center">
                        <div className="font-medium">Subcategory</div>
                      </div>
                      <div className="mt-3 text-xs leading-relaxed text-slate-500">
                        You can add a new subcategory or choose from the
                        existing subcategory list.
                      </div>
                    </div>
                  </FormLabel>
                  <div className="flex-1 w-full mt-3 xl:mt-0">
                    <TomSelect
                      value={subcategory}
                      onChange={setSubcategory}
                      options={{
                        placeholder: "Etalase",
                      }}
                      className="w-full"
                      multiple
                    >
                      {_.take(fakerData, 2).map((faker, fakerKey) => (
                        <option key={fakerKey} value={fakerKey}>
                          {faker.categories[0].name}
                        </option>
                      ))}
                    </TomSelect>
                  </div>
                </FormInline> */}
                                </div>
                            </div>
                        </div>
                        {/* END: Product Information */}
                        {/* BEGIN: Product Detail */}
                        <div className="p-5 mt-5 intro-y box">
                            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Product Detail
                                </div>
                                <div className="mt-5">
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Condition
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <div className="flex flex-col sm:flex-row">
                                                <FormCheck className="mr-4">
                                                    <FormCheck.Input
                                                        id="condition-new"
                                                        type="radio"
                                                        name="horizontal_radio_button"
                                                        value="new"
                                                        checked={
                                                            condition === "new"
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <FormCheck.Label htmlFor="condition-new">
                                                        New
                                                    </FormCheck.Label>
                                                </FormCheck>
                                                <FormCheck className="mt-2 mr-4 sm:mt-0">
                                                    <FormCheck.Input
                                                        id="condition-second"
                                                        type="radio"
                                                        name="horizontal_radio_button"
                                                        value="second"
                                                        checked={
                                                            condition ===
                                                            "second"
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <FormCheck.Label htmlFor="condition-second">
                                                        Second
                                                    </FormCheck.Label>
                                                </FormCheck>
                                            </div>
                                        </div>
                                    </FormInline>
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Product Description
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    <div>
                                                        Make sure the product
                                                        description provides a
                                                        detailed explanation of
                                                        your product so that it
                                                        is easy to understand
                                                        and find your product.
                                                    </div>
                                                    <div className="mt-2">
                                                        It is recommended not to
                                                        enter info on mobile
                                                        numbers, e-mails, etc.
                                                        into the product
                                                        description to protect
                                                        your personal data.
                                                    </div>
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormTextarea
                                                value={editorData}
                                                onChange={(e) =>
                                                    setEditorData(
                                                        e.target.value
                                                    )
                                                }
                                                rows={20}
                                            />
                                        </div>
                                    </FormInline>

                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel
                                            className="xl:w-64 xl:!mr-10"
                                            htmlFor="product-price"
                                        >
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Product Price
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput
                                                id="product-price"
                                                type="number"
                                                placeholder="Input Product Stock"
                                                value={price}
                                                onChange={(e) => {
                                                    setPrice(
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                            />
                                        </div>
                                    </FormInline>
                                </div>
                            </div>
                        </div>
                        {/* END: Product Detail */}

                        {/* BEGIN: Product Management */}
                        <div className="p-5 mt-5 intro-y box">
                            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Product Management
                                </div>
                                <div className="mt-5">
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Product Status
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    If the status is active,
                                                    your product can be searched
                                                    for by potential buyers.
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormSwitch
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setStatus(e.target.checked);
                                                }}
                                            >
                                                <FormSwitch.Input
                                                    id="product-status-active"
                                                    type="checkbox"
                                                    checked={status}
                                                />
                                                <FormSwitch.Label htmlFor="product-status-active">
                                                    Active
                                                </FormSwitch.Label>
                                            </FormSwitch>
                                        </div>
                                    </FormInline>
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Featured
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-xs leading-relaxed text-slate-500">
                                                    If the switch is active,
                                                    your product will be added
                                                    to featured section
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormSwitch
                                                onChange={(
                                                    e: React.ChangeEvent<HTMLInputElement>
                                                ) => {
                                                    setFeatured(
                                                        e.target.checked
                                                    );
                                                }}
                                            >
                                                <FormSwitch.Input
                                                    id="product-status-active"
                                                    type="checkbox"
                                                    checked={featured}
                                                />
                                                <FormSwitch.Label htmlFor="product-status-active">
                                                    Active
                                                </FormSwitch.Label>
                                            </FormSwitch>
                                        </div>
                                    </FormInline>
                                    <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                        <FormLabel className="xl:w-64 xl:!mr-10">
                                            <div className="text-left">
                                                <div className="flex items-center">
                                                    <div className="font-medium">
                                                        Product Stock
                                                    </div>
                                                    <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                        Required
                                                    </div>
                                                </div>
                                            </div>
                                        </FormLabel>
                                        <div className="flex-1 w-full mt-3 xl:mt-0">
                                            <FormInput
                                                id="product-stock"
                                                type="number"
                                                placeholder="Input Product Stock"
                                                value={quantity}
                                                onChange={(e) => {
                                                    setQuantity(
                                                        parseInt(e.target.value)
                                                    );
                                                }}
                                            />
                                        </div>
                                    </FormInline>
                                </div>
                            </div>
                        </div>
                        {/* END: Product Management */}

                        {/* BEGIN: Product properties */}
                        <div className="p-5 mt-5 intro-y box">
                            <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                    <Lucide
                                        icon="ChevronDown"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Product Properties
                                </div>
                                <div className="mt-5">
                                    {properties.map(
                                        (property, propertyIndex) => (
                                            <div key={propertyIndex}>
                                                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                                    <FormLabel
                                                        className="xl:w-64 xl:!mr-10"
                                                        htmlFor="propName"
                                                    >
                                                        <div className="text-left">
                                                            <div className="flex items-center">
                                                                <div className="font-medium">
                                                                    Property
                                                                    Name
                                                                </div>
                                                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                                    Required
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormLabel>
                                                    <div className="flex-1 w-full mt-3 xl:mt-0">
                                                        <FormInput
                                                            type="text"
                                                            id="propName"
                                                            placeholder="Property Name"
                                                            value={
                                                                property.name
                                                            }
                                                            onChange={(e) =>
                                                                handleNameChange(
                                                                    propertyIndex,
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </FormInline>

                                                <ul>
                                                    {property.values.map(
                                                        (value, valueIndex) => (
                                                            <li
                                                                key={valueIndex}
                                                            >
                                                                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                                                    <FormLabel
                                                                        className="xl:w-64 xl:!mr-10"
                                                                        htmlFor="value"
                                                                    >
                                                                        <div className="text-left">
                                                                            <div className="flex items-center">
                                                                                <div className="font-medium">
                                                                                    Value
                                                                                </div>
                                                                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                                                    Required
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </FormLabel>
                                                                    <div className="flex-1 w-full mt-3 xl:mt-0">
                                                                        <FormInput
                                                                            className="mt-3"
                                                                            type="text"
                                                                            id="value"
                                                                            placeholder="Value"
                                                                            value={
                                                                                value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleValueChange(
                                                                                    propertyIndex,
                                                                                    valueIndex,
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </FormInline>
                                                            </li>
                                                        )
                                                    )}
                                                    <li>
                                                        <Button
                                                            className="my-3"
                                                            variant="primary"
                                                            type="button"
                                                            onClick={() =>
                                                                addValue(
                                                                    propertyIndex
                                                                )
                                                            }
                                                        >
                                                            Add Value
                                                        </Button>
                                                    </li>
                                                </ul>
                                                <ul>
                                                    {property.quantities.map(
                                                        (value, valueIndex) => (
                                                            <li
                                                                key={valueIndex}
                                                            >
                                                                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                                                    <FormLabel
                                                                        className="xl:w-64 xl:!mr-10"
                                                                        htmlFor="qua"
                                                                    >
                                                                        <div className="text-left">
                                                                            <div className="flex items-center">
                                                                                <div className="font-medium">
                                                                                    Quantity
                                                                                </div>
                                                                                <div className="ml-2 px-2 py-0.5 bg-slate-200 text-slate-600 dark:bg-darkmode-300 dark:text-slate-400 text-xs rounded-md">
                                                                                    Required
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </FormLabel>
                                                                    <div className="flex-1 w-full mt-3 xl:mt-0">
                                                                        <FormInput
                                                                            className="mt-3"
                                                                            type="text"
                                                                            id="value"
                                                                            placeholder="Quantity"
                                                                            value={
                                                                                value
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                handleQuantityChange(
                                                                                    propertyIndex,
                                                                                    valueIndex,
                                                                                    parseInt(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    )
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </FormInline>
                                                            </li>
                                                        )
                                                    )}
                                                    <li>
                                                        <Button
                                                            className="my-3"
                                                            variant="primary"
                                                            type="button"
                                                            onClick={() =>
                                                                addQuantity(
                                                                    propertyIndex
                                                                )
                                                            }
                                                        >
                                                            Add Quantity
                                                        </Button>
                                                    </li>
                                                </ul>
                                            </div>
                                        )
                                    )}
                                    <Button
                                        className="my-3"
                                        variant="primary"
                                        type="button"
                                        onClick={addProperty}
                                    >
                                        Add Property
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* END: Product properties */}

                        <div className="flex flex-col justify-end gap-2 mt-5 md:flex-row">
                            <Button
                                type="button"
                                className="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="w-full py-3 border-slate-300 dark:border-darkmode-400 text-slate-500 md:w-52"
                            >
                                Save & Add New Product
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                className="w-full py-3 md:w-52"
                            >
                                Save
                            </Button>
                        </div>
                    </div>

                    <div className="hidden col-span-2 intro-y 2xl:block">
                        <div className="sticky top-0 pt-10">
                            <ul className="text-slate-500 relative before:content-[''] before:w-[2px] before:bg-slate-200 before:dark:bg-darkmode-600 before:h-full before:absolute before:left-0 before:z-[-1]">
                                <li className="pl-5 mb-4 font-medium border-l-2 border-primary dark:border-primary text-primary">
                                    <a href="">Upload Product</a>
                                </li>
                                <li
                                    className={`pl-5 mb-4 border-l-2 ${
                                        name === ""
                                            ? "border-transparent"
                                            : "border-primary text-primary"
                                    } dark:border-transparent`}
                                >
                                    <a href="">Product Information</a>
                                </li>
                                <li
                                    className={`pl-5 mb-4 border-l-2 ${
                                        condition === ""
                                            ? "border-transparent "
                                            : "border-primary text-primary"
                                    }  dark:border-transparent`}
                                >
                                    <a href="">Product Detail</a>
                                </li>

                                <li
                                    className={`pl-5 mb-4 border-l-2  ${
                                        quantity === 0
                                            ? "border-transparent"
                                            : "border-primary text-primary"
                                    } dark:border-transparent`}
                                >
                                    <a href="">Product Management</a>
                                </li>
                            </ul>
                            <div className="relative p-5 mt-10 border rounded-md bg-warning/20 dark:bg-darkmode-600 border-warning dark:border-0">
                                <Lucide
                                    icon="Lightbulb"
                                    className="absolute top-0 right-0 w-12 h-12 mt-5 mr-3 text-warning/80"
                                />
                                <h2 className="text-lg font-medium">Tips</h2>
                                <div className="mt-5 font-medium">Price</div>
                                <div className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-500">
                                    <div>
                                        The image format is .jpg .jpeg .png and
                                        a minimum size of 300 x 300 pixels (For
                                        optimal images use a minimum size of 700
                                        x 700 pixels).
                                    </div>
                                    <div className="mt-2">
                                        Select product photos or drag and drop
                                        up to 5 photos at once here. Include
                                        min. 3 attractive photos to make the
                                        product more attractive to buyers.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
            {/* BEGIN: Notification Content */}
            <Notification
                getRef={(el) => {
                    successNotification.current = el;
                }}
                className="flex"
            >
                <Lucide icon="CheckCircle" className="text-success" />
                <div className="ml-4 mr-4">
                    <div className="font-medium">Success</div>
                    <div className="mt-1 text-slate-500">
                        product added successfully.
                    </div>
                </div>
            </Notification>
            {/* END: Notification Content */}
        </>
    );
}

export default Main;
