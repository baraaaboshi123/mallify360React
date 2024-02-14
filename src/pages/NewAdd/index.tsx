import React, { useEffect, useRef, useState } from "react";
import Lucide from "../../base-components/Lucide";
import {
    FormCheck,
    FormInline,
    FormInput,
    FormLabel,
} from "../../base-components/Form";
import Tippy from "../../base-components/Tippy";
import Button from "../../base-components/Button";
import axios from "axios";
import { Dialog, Disclosure } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import Notification, { NotificationElement } from "../../base-components/Notification";


type Props = {};

export default function index({}: Props) {
    const [link, setLink] = useState("");
    const [productId, setProductId] = useState(0);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [adType, setAdType] = useState("");
    const [t, setT] = useState(0);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const deleteButtonRef = useRef(null);
    const [deletedId, setDeletedId] = useState(0);
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
        localStorage.setItem("page", "NewAd")
        fetchCatigories();
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
    const handleLogoSubmit = (e: any) => {
        e.preventDefault();
        if (adType === "one") setT(1);
        else setT(2);

        const base64Images = selectedImages.map((image: any) => {
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
                    link:
                        localStorage.getItem("role") === "owner"
                            ? "https//google.com"
                            : link,
                    type: localStorage.getItem("role") === "owner" ? t : 3,
                    product_id:
                        localStorage.getItem("role") === "owner"
                            ? productId
                            : null,
                    store_id:
                        localStorage.getItem("role") === "owner"
                            ? localStorage.getItem("store_id")
                            : null,
                };

                axios
                    .post(`http://localhost:8000/storeAd`, {
                        requestData,
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        setSelectedImages([])
                        setProductId(0)
                        
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
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
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});
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
    const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };
    return (
        <div>
             

            <div className="text-lg p-5">New Ad</div>
            <form onSubmit={handleLogoSubmit}>
                <div className="p-5 intro-y box">
                    <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                        <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                            <Lucide
                                icon="ChevronDown"
                                className="w-4 h-4 mr-2"
                            />{" "}
                            Upload Ad image
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
                                        Please uplode one image for your Ad.
                                        then add a link to forward the user when
                                        he/she clicked on the ad.
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
                                    {selectedImages.map((image, index) => (
                                        <div
                                            key={index}
                                            className="relative col-span-5  cursor-pointer md:col-span-2 h-28 image-fit zoom-in"
                                        >
                                            <img
                                                className="rounded-md "
                                                alt={`Product Image ${index}`}
                                                src={URL.createObjectURL(image)}
                                            />
                                            <Tippy
                                                content="Remove this image?"
                                                className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 -mt-2 -mr-2 text-white rounded-full bg-danger"
                                            >
                                                <Lucide
                                                    icon="X"
                                                    className="w-4 h-4"
                                                    onClick={(e) => {
                                                        const updatedImages = [
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
                                    ))}
                                </div>
                            </FormInline>
                            {localStorage.getItem("role") == "admin" ? (
                                <FormInline className="my-10">
                                    <FormLabel htmlFor="link">Link</FormLabel>
                                    <FormInput
                                        type="text"
                                        value={link}
                                        id="link"
                                        onChange={(e) =>
                                            setLink(e.target.value)
                                        }
                                    />
                                </FormInline>
                            ) : (
                                ""
                            )}

                            {localStorage.getItem("role") == "owner" ? (
                                <FormInline className="my-10">
                                    <FormLabel htmlFor="">Product</FormLabel>
                                    <FormInput
                                        type="number"
                                        className="mx-3"
                                        value={productId}
                                        onChange={(e) =>
                                            setProductId(
                                                parseInt(e.target.value)
                                            )
                                        }
                                    ></FormInput>
                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            
                                            setDeleteConfirmationModal(true);
                                        }}
                                    >
                                        choose product
                                    </Button>
                                </FormInline>
                            ) : (
                                ""
                            )}
                            {localStorage.getItem("role") == "owner" ? (
                                <FormInline className="flex-col items-start pt-5 mt-5 xl:flex-row first:mt-0 first:pt-0">
                                    <FormLabel className="xl:w-64 xl:!mr-10">
                                        <div className="text-left">
                                            <div className="flex items-center">
                                                <div className="font-medium">
                                                    Ad Type
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
                                                    value="one"
                                                    checked={adType === "one"}
                                                    onChange={(e) => {
                                                        setAdType(
                                                            e.target.value
                                                        );
                                                        setT(1);
                                                    }}
                                                />
                                                <FormCheck.Label htmlFor="condition-new">
                                                    internal
                                                </FormCheck.Label>
                                            </FormCheck>
                                            <FormCheck className="mt-2 mr-4 sm:mt-0">
                                                <FormCheck.Input
                                                    id="condition-second"
                                                    type="radio"
                                                    name="horizontal_radio_button"
                                                    value="two"
                                                    checked={adType === "two"}
                                                    onChange={(e) => {
                                                        setAdType(
                                                            e.target.value
                                                        );
                                                        setT(2);
                                                    }}
                                                />
                                                <FormCheck.Label htmlFor="condition-second">
                                                    external
                                                </FormCheck.Label>
                                            </FormCheck>
                                        </div>
                                    </div>
                                </FormInline>
                            ) : (
                                ""
                            )}

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
            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
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
                                                                        <Button variant="primary"
                                                                        onClick={()=>{
                                                                            setProductId(product.id)
                                                                            setDeleteConfirmationModal(false)
                                                                        }}>select</Button>
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
                    <Button variant="secondary" className="m-5" onClick={()=>setDeleteConfirmationModal(false)}>close</Button>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
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
                Ad added successfully.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
        </div>
    );
}
