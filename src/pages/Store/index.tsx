import React, { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import {
    FormInput,
    FormInline,
    FormLabel,
    FormSelect,
    FormCheck,
} from "../../base-components/Form";
import axios from "axios";
import { Tab } from "../../base-components/Headless";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Notification, { NotificationElement } from "../../base-components/Notification";
import Theme2 from "../../assets/images/themes/77e443c6-207c-49b7-aa11-7b586e225a07.jpg";
import Theme1 from "../../assets/images/themes/bd4da68f-23a1-450e-b2e2-f2c9710bb91b.jpg";
import Breadcrumb from "../../base-components/Breadcrumb";
type Props = {};
interface store {
    name: string;
    catigory: string;
    description: string;
    email: string;
    location: string;
    phone: string;
    facebook: string;
    theme:number;
    instagram: string;
}
export default function index({}: Props) {
    const [logo, setLogo] = useState("");
    const [theme, setTheme] = useState(0);
    const [store, setStore] = useState<store>({
        name: "",
        catigory: "",
        description: "",
        email: "",
        location: "",
        phone: "",
        facebook: "",
        instagram: "",
        theme: 0
    });
    const [catigory, setCatigory] = useState(0);
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
            })
            .then((response) => {
                console.log(response.data);
                localStorage.setItem("store_id", response.data.store_id);
            });
    };

    const fetchStoreData = () => {
        axios
            .post(`http://localhost:8000/getStore`, {
                id: localStorage.getItem("store_id"),
            })
            .then((response) => {
                setStore({
                    ...store,
                    name: response.data.store.name,
                    description: response.data.store.description,
                    location: response.data.store.location,
                    catigory: response.data.store.catigory,
                    email: response.data.store.email,
                    phone: response.data.store.phone,
                    facebook: response.data.store.facebook_url,
                    instagram: response.data.store.instagram_url,
                    theme: response.data.store.theme
                    
                });
            });
    };
    const fetchStoreLogo = async () => {
        await axios
            .get(
                `http://localhost:8000/getLogo/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setLogo(response.data);
                localStorage.setItem("store_logo", response.data);
            });
    };

    useEffect(()=>{
setTheme(store.theme)
    },[store])

    const fetchCategories = async () => {
        await axios
            .get("http://localhost:8000/getAdminCategories")
            .then((response) => {
                setCategories(response.data);
            });
    };

    useEffect(() => {
        localStorage.setItem("page", "store")
        if (localStorage.getItem("store_id") !== "0") {
            fetchStoreData();
            fetchStoreLogo();
        }
        fetchCategories();
    }, []);
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

    const handleLogoSubmit = (e: any) => {
        e.preventDefault();

        const base64Images = selectedImages.map((image) => {
            const reader = new FileReader();

            return new Promise((resolve) => {
                reader.onload = () => {
                    if (reader.result && typeof reader.result === "string") {
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
                };

                axios
                    .post(
                        `http://localhost:8000/handleLogoUpload/${localStorage.getItem(
                            "store_id"
                        )}`,
                        requestData
                    )
                    .then((response) => {
                        console.log(response.data.message);
                        fetchStoreLogo();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };
    const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };

    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    return (
        <>
         
            <Tab.Group className="mt-5">
                <Tab.List variant="boxed-tabs">
                    <Tab>
                        <Tab.Button className="w-full py-2" as="button">
                            Store Logo
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2" as="button">
                            Basic Information
                        </Tab.Button>
                    </Tab>
                    <Tab>
                        <Tab.Button className="w-full py-2" as="button">
                            Tamplate
                        </Tab.Button>
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-5">
                    <Tab.Panel className="leading-relaxed">
                        <form onSubmit={handleLogoSubmit}>
                            <div className="p-5 intro-y box">
                                <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                                    <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                                        <Lucide
                                            icon="ChevronDown"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Upload Store Logo
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
                                                    Please uplode one image for
                                                    your store logo, this image
                                                    is the one that will apear
                                                    from outside your store.
                                                </span>
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
                                                    Upload an image
                                                </span>{" "}
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
                                        <Button
                                            variant="primary"
                                            className="m-5 "
                                            type="submit"
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </form>
                        <div className="mt-10 grid justify-items-center">
                            <img src={logo} className="w-80 " alt="" />
                        </div>
                    </Tab.Panel>
                    <Tab.Panel className="leading-relaxed">
                        <div className="flex items-center mt-8 intro-y">
                            <h2 className="mr-auto text-lg font-medium">
                                My Store
                            </h2>
                        </div>
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
                    </Tab.Panel>
                    <Tab.Panel className="leading-relaxed">
                        <h2 className="mt-10 text-lg font-medium intro-y">
                            Choose your store theme for mobile app
                        </h2>

                        <FormInline className="flex-col items-start pt-5 box mt-5 xl:flex-row first:mt-0 first:pt-0">
                            <div className="flex-1 w-full mt-3 xl:mt-0">
                                <div className="flex flex-col sm:flex-row">
                                    <FormCheck className="mr-4">
                                        <FormCheck.Input
                                            id="condition-new"
                                            type="radio"
                                            name="horizontal_radio_button"
                                            value={1}
                                            checked={theme == 1}
                                            onChange={(e) => {
                                                setTheme(1);
                                            }}
                                        />
                                        <FormCheck.Label htmlFor="condition-new">
                                            <h2 className="mt-10 text-lg font-medium my-4 intro-y">
                                                Theme 1
                                            </h2>

                                            <img src={Theme1} alt="" />
                                        </FormCheck.Label>
                                    </FormCheck>
                                    <FormCheck className="mt-2 mr-4 sm:mt-0">
                                        <FormCheck.Input
                                            id="condition-second"
                                            type="radio"
                                            name="horizontal_radio_button"
                                            value={2}
                                            checked={theme == 2}
                                            onChange={(e) => {
                                                setTheme(2);
                                            }}
                                        />
                                        <FormCheck.Label htmlFor="condition-second">
                                            <h2 className="mt-10 text-lg font-medium my-4 intro-y">
                                                Theme 2
                                            </h2>
                                            <img src={Theme2} alt="" />
                                        </FormCheck.Label>
                                    </FormCheck>
                                </div>
                            </div>
                        </FormInline>
                        <Button 
                        className="m-10"
                        onClick={async ()=>{
                            await axios.put(`http://localhost:8000/updateTheme/${localStorage.getItem("store_id")}`,
                            {
                                theme: theme
                            })
                            .then((response)=>{
                                successNotificationToggle()
                            })
                        }} variant="primary">Save</Button>
                    </Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
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
                store theme updated successfully.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
        </>
    );
}
