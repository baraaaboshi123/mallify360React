import React, { useEffect, useState } from "react";
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

type Props = {};

export default function index({}: Props) {
    useEffect(()=>{
        localStorage.setItem("page","AddInterest")
    },[])
    const [name, setName] = useState("");
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
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
                    name: name
                  
                };

                axios
                    .post(`http://localhost:8000/storeInterests`, {
                        requestData,
                    })
                    .then((response) => {
                        console.log(response.data.message);
                        //fetchStoreLogo();
                    })
                    .catch((error) => {
                        console.error("Error:", error);
                    });
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    return (
        <div>
            <div className="text-lg p-5">New Interest</div>
            <form onSubmit={handleLogoSubmit}>
                <div className="p-5 intro-y box">
                    <div className="p-5 border rounded-md border-slate-200/60 dark:border-darkmode-400">
                        <div className="flex items-center pb-5 text-base font-medium border-b border-slate-200/60 dark:border-darkmode-400">
                            <Lucide
                                icon="ChevronDown"
                                className="w-4 h-4 mr-2"
                            />{" "}
                            Upload Interest image
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
                                        Please uplode one image for your
                                        Interest. then add a name.
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

                            <FormInline className="my-10">
                                <FormLabel htmlFor="link">Interst Name</FormLabel>
                                <FormInput
                                    type="text"
                                    value={name}
                                    id="link"
                                    onChange={(e) => setName(e.target.value)}
                                />
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
        </div>
    );
}
