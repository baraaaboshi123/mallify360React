import React, { useState, useEffect, useRef } from "react";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Lucide from "../../base-components/Lucide";
import { Dialog } from "../../base-components/Headless";
import { set } from "lodash";


type Props = {};

export default function index({}: Props) {
    const navigate = useNavigate();
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const deleteButtonRef = useRef(null);
    const [deletedId, setDeletedId] = useState(0);
    const [ads, setAds] = useState<
        Array<{
            path: string;
            type: string;
            status: number;
            link: string;
            id: number;
        }>
    >([]);

    const fetchAds = async () => {
        if (localStorage.getItem("role") === "admin") {
            await axios
                .get(`http://localhost:8000/getPublicAdsWeb`)
                .then((response) => {
                    setAds(response.data);
                });
        } else {
            await axios
                .get(
                    `http://localhost:8000/getStoreAds/${localStorage.getItem(
                        "store_id"
                    )}`
                )
                .then((response) => {
                    setAds(response.data);
                });
        }
    };
    const toggleStatus = async () => {
        await axios
            .put(`http://localhost:8000/adToggleStatus/${deletedId}`)
            .then((response) => {
                fetchAds();
            });
    };

    useEffect(() => {
        localStorage.setItem("page", "Ads")
        fetchAds();

    }, []);


    useEffect(() => {
        toggleStatus();
    }, [deletedId]);

    const changeStatus = async () =>{
        toggleStatus()
    }
    
    return (
        <div>
           
            <h2 className="mt-10 text-xl font-medium intro-y">Ads List</h2>
            <div className="m-5">
                <Button variant="primary" onClick={() => navigate("/newAdd")}>
                    Add New Ad
                </Button>
            </div>
            {/* BEGIN: Users Layout */}
            {ads.map((faker, fakerKey) => (
                <div
                    key={fakerKey}
                    className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3 mt-5"
                >
                    <div className="box">
                        <div className="p-5">
                            <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                <img
                                    alt="Midone - HTML Admin Template"
                                    className="rounded-md"
                                    src={
                                        "http://localhost:8000/storage/" +
                                        faker.path
                                    }
                                />

                                <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                                    {faker.type === "3" ? (
                                        <a
                                            href=""
                                            className="block text-base font-medium"
                                        >
                                            {faker.link}
                                        </a>
                                    ) : faker.type === 2 ? (
                                        <p>External Ad</p>
                                    ) : (
                                        "Internal Ad"
                                    )}
                                    <br />

                                    <span className="mt-3 text-xs text-white/90">
                                        {faker.type == "3"
                                            ? "public ad"
                                            : "store ad"}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-5 text-slate-600 dark:text-slate-500">
                                <div className="flex items-center mt-2">
                                    <Lucide
                                        icon="CheckSquare"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Status:
                                    {faker.status ? "Active" : "Inactive"}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center p-5 border-t lg:justify-end border-slate-200/60 dark:border-darkmode-400">
                            <p
                                className="flex items-center mr-auto text-primary cursor-pointer"
                                onClick={() => {
                                    setDeletedId(faker.id);
                                    changeStatus();
                                }}
                            >
                                <Lucide
                                    icon="ToggleLeft"
                                    className="w-4 h-4 mr-1"
                                />{" "}
                                Toggle Status
                            </p>
                            <a className="flex items-center mr-3" href="#">
                                <Lucide
                                    icon="CheckSquare"
                                    className="w-4 h-4 mr-1"
                                />{" "}
                                Edit
                            </a>
                            <a
                                className="flex items-center text-danger"
                                href="#"
                                onClick={(event) => {
                                    event.preventDefault();
                                    setDeleteConfirmationModal(true);
                                    setDeletedId(faker.id);
                                }}
                            >
                                <Lucide
                                    icon="Trash2"
                                    className="w-4 h-4 mr-1"
                                />{" "}
                                Delete
                            </a>
                        </div>
                    </div>
                </div>
            ))}
            {/* END: Users Layout */}
            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <Lucide
                            icon="XCircle"
                            className="w-16 h-16 mx-auto mt-3 text-danger"
                        />
                        <div className="mt-5 text-3xl">Are you sure?</div>
                        <div className="mt-2 text-slate-500">
                            Do you really want to delete these records? <br />
                            This process cannot be undone.
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <Button
                            variant="outline-secondary"
                            type="button"
                            onClick={() => {
                                setDeleteConfirmationModal(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            type="button"
                            className="w-24"
                            ref={deleteButtonRef}
                            onClick={() => {
                                axios
                                    .delete(
                                        `http://localhost:8000/deleteAd/${deletedId}`
                                    )
                                    .then((response) => {
                                        console.log(
                                            "product deleted successfully"
                                        );
                                        setDeleteConfirmationModal(false);
                                        fetchAds();
                                    });
                            }}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
        </div>
    );
}
