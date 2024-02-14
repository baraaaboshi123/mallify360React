import React, { useEffect, useRef, useState } from "react";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import Table from "../../base-components/Table";
import axios from "axios";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import ErrorPage from "../ErrorPage";
import * as XLSX from "xlsx";
import Menu from "../../base-components/Headless/Menu";
import { FormInline, FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import UserImage from "./user.png";
import Pagination from "../../base-components/Pagination";
import { Dialog } from "../../base-components/Headless";
import Notification, { NotificationElement } from "../../base-components/Notification";


type Props = {};

export default function index({}: Props) {
    const [user, setUser] = useState<{
        name:string;
        email:string;
        date:string;
    }>({
name:"",
date:"",
email:""
    })
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
    useState(false);
const deleteButtonRef = useRef(null);
const [deleteConfirmationModal1, setDeleteConfirmationModal1] =
    useState(false);
const deleteButtonRef1 = useRef(null);
    function exportToExcel(
        data: Array<{
            name: string;
            email: string;
            role: string;
            id: number;
            date_of_birth:string;
        }>,
        fileName: string
    ) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
    const [updatedId, setUpdatedId] = useState(0)
    const [userName, setUserName] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("all");
    const navigate = useNavigate();
    const [storeImages, setStoreImages] = useState<{
        [key: number]: string;
    }>({});
    const getImageSrc = async (storeId: number) => {
        try {
            // Make an API call to fetch the image source based on the productId
            const response = await axios.get(
                `http://localhost:8000/getProfilePhoto/${storeId}`
            );
            return response.data; // Adjust the property based on your API response
        } catch (error) {
            console.error("Error fetching image source:", error);
            return ""; // Return a default or empty string in case of an error
        }
    };

    const [stores, setStores] = useState<
        Array<{
            
            name: string;
            email: string;
            role: string;
            id: number;
            date_of_birth:string;
        }>
    >([]);
    const [allStores, setAllStores] = useState<
        Array<{
            name: string;
            email: string;
            role: string;
            id: number;
            date_of_birth:string;
        }>
    >([]);
    const [deletedId, setDeletedId] = useState(0);
    const toggleStatus = async () => {
        await axios
            .put(`http://localhost:8000/storeToggleStatus/${deletedId}`)
            .then((response) => {
                fetchInterests();
            });
    };

    const deleteUser = async () => {
        await axios.put(`http://localhost:8000/delUser/${deletedId}`)
        .then((response)=>{
            fetchInterests()
        })
    };

    useEffect(() => {
        toggleStatus();
    }, [deletedId]);

    const changeStatus = async () => {
        toggleStatus();
    };
    const fetchInterests = () => {
        axios.get(`http://localhost:8000/users`).then((response) => {
            setAllStores(response.data);
            setCurrentPage(1);
        });
    };
    useEffect(() => {
        fetchInterests();
    }, []);
    useEffect(() => {
        stores.forEach((sale: any) => {
            getImageSrc(sale.id).then((imageSrc) => {
                setStoreImages((prevImages) => ({
                    ...prevImages,
                    [sale.id]: imageSrc,
                }));
            });
        });
    }, [allStores, stores]);

    useEffect(() => {
        setTotal(allStores.length);
        let filtered = allStores;
        if (filter != "all") {
            filtered = filtered.filter(
                (transaction) => transaction[0].role == filter
            );
        }
        if (userName !== "") {
            filtered = filtered.filter(
                (transaction) =>
                    transaction[0].name &&
                    transaction[0].name
                        .toLowerCase()
                        .startsWith(userName.toLowerCase())
            );
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedTransactions = filtered.slice(
            startIndex,
            startIndex + itemsPerPage
        );
        setStores(paginatedTransactions);
    }, [filter, userName, currentPage, itemsPerPage, allStores]);

    const totalPages = Math.ceil(allStores.length / itemsPerPage);
    const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };
    return localStorage.getItem("role") === "admin" ? (
        <div>
            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                open={deleteConfirmationModal1}
                onClose={() => {
                    setDeleteConfirmationModal1(false);
                }}
                initialFocus={deleteButtonRef1}
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
                                setDeleteConfirmationModal1(false);
                            }}
                            className="w-24 mr-1"
                        >
                            Cancel
                        </Button>
                        <Button
                        onClick={async ()=>{
                            deleteUser()
                            
                        }}
                            variant="danger"
                            type="button"
                            className="w-24"
                            ref={deleteButtonRef1}
                        >
                            Delete
                        </Button>
                    </div>
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
                user updated successfully.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
             {/* BEGIN: Delete Confirmation Modal */}
             <Dialog
                open={deleteConfirmationModal}
                onClose={() => {
                    setDeleteConfirmationModal(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <form onSubmit={async(e)=>{
                            e.preventDefault()
                            await axios.put(`http://localhost:8000/updateUser/${updatedId}`,{
                                name:user.name,
                                email:user.email,
                                date:user.date
                            })
                            .then((response)=>{
                                successNotificationToggle()
                                setDeleteConfirmationModal(false)
                                fetchInterests()
                            })

                        }}>
                    <div className="p-5 text-center">
                    
                        <div className="mt-5 text-3xl">Update User</div>
                        
                            <FormInline>
                                
                                <FormInput
                                type="text"
                                id="name"
                                placeholder="Name"
                                value={user.name}
                                onChange={(e) => setUser(prev => ({
                                    ...prev,
                                    name: e.target.value
                                }))}
                                />
                                    
                                
                            </FormInline>
                            <FormInline>
                                
                                <FormInput
                                type="text"
                                id="Email"
                                placeholder="Email"
                                value={user.email}
                                onChange={(e) => setUser(prev => ({
                                    ...prev,
                                    email: e.target.value
                                }))}
                                />
                                    
                                
                            </FormInline>
                            <FormInline>
                                <FormInput
                                type="date"
                                id="date"
                                value={user.date}
                                onChange={(e) => setUser(prev => ({
                                    ...prev,
                                    date: e.target.value
                                }))}
                                />
                            </FormInline>
                        
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
                       
                            variant="primary"
                            type="submit"
                            className="w-24"
                            ref={deleteButtonRef}
                        >
                            update
                        </Button>
                       
                    
                    </div>
                     </form>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
            <h2 className="mt-10 text-xl font-medium intro-y">Users List</h2>

            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
                <div className="flex w-full sm:w-auto">
                <div className="relative w-48 text-slate-500">
                    <FormInput
                        type="text"
                        className="w-48 pr-10 !box"
                        placeholder="Search by user name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                    />
                </div>
                <FormSelect
                    className="ml-2 !box"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="all">Role</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                    <option value="mobile">Mobile</option>
                </FormSelect>
            </div>
            <div className="hidden mx-auto xl:block text-slate-500">
                Showing 1 to {itemsPerPage} of {total} entries
            </div>
            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                <Button
                    variant="primary"
                    className="mr-2 shadow-md"
                    onClick={() => exportToExcel(allStores, "users")}
                >
                    <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export
                    to Excel
                </Button>

                <Menu className="menu">
                    <Menu.Button as={Button} className="px-2 !box">
                        <span className="flex items-center justify-center w-5 h-5">
                            <Lucide icon="Plus" className="w-4 h-4" />
                        </span>
                    </Menu.Button>
                    <Menu.Items className="w-40">
                        <Menu.Item onClick={() => window.print()}>
                            <Lucide icon="Printer" className="w-4 h-4 mr-2" />{" "}
                            Print
                        </Menu.Item>
                        <Menu.Item
                            onClick={() =>
                                exportToExcel(allStores, "transactions")
                            }
                        >
                            <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                            Export to Excel
                        </Menu.Item>
                    </Menu.Items>
                </Menu>
            </div>
                </div>
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="  border-b-0 whitespace-nowrap">
                                    USER IMAGE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    USER NAME
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    USER EMAIL
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    USER ROLE
                                </Table.Th>

                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {stores.map((faker, fakerKey) => (
                                <Table.Tr
                                    onClick={() => {
                                        console.log("e");
                                    }}
                                    key={fakerKey}
                                    className="intro-x"
                                >
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="w-10 h-10 image-fit zoom-in">
                                            <Tippy
                                                as="img"
                                                alt="Midone Tailwind HTML Admin Template"
                                                className="rounded-full  shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                src={
                                                    storeImages[faker[0].id] || UserImage
                                                }
                                                content={`Uploaded at`}
                                            />
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker[0].name}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker[0].email}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker[0].role }{faker[0].role === "owner" ? ` (${faker[1]})` : ""}
                                    </Table.Td>
                                    {/* <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.status === 1 ? (
                                            <span className="text-success">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-danger">
                                                Inactive
                                            </span>
                                        )}
                                    </Table.Td> */}

                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            {/* {faker.status === 1 ? (
                                                <a
                                                    onClick={() => {
                                                        setDeletedId(faker.id);
                                                        changeStatus();
                                                    }}
                                                    className="flex items-center mr-3 text-danger cursor-pointer"
                                                >
                                                    <Lucide
                                                        icon="X"
                                                        className="w-4 h-4 mr-1 text-danger"
                                                    />
                                                    Deactivate
                                                </a>
                                            ) : (
                                                <a className="flex items-center mr-3 text-success cursor-pointer"
                                                onClick={() => {
                                                    setDeletedId(faker.id);
                                                    changeStatus();
                                                }}
                                                >
                                                    <Lucide
                                                        icon="Check"
                                                        className="w-4 h-4 mr-1 text-success"
                                                    />
                                                    Activate
                                                </a>
                                            )} */}
                                            <a className="flex items-center mr-3" onClick={()=>
                                                
                                                {
                                                    setUpdatedId(faker[0].id)
                                                    setUser(prev=>({
                                                        ...prev,
                                                        name:faker[0].name,
                                                        email:faker[0].email,
                                                        date: faker[0].date_of_birth

                                                    }))
                                                    setDeleteConfirmationModal(true)}}>
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Edit
                                            </a>
                                            <a
                                                className="flex cursor-pointer items-center text-danger"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setDeletedId(faker[0].id)
                                                    setDeleteConfirmationModal1(
                                                        true
                                                    );
                                                }}
                                            >
                                                <Lucide
                                                    icon="Trash2"
                                                    className="w-4 h-4 mr-1"
                                                />{" "}
                                                Delete
                                            </a>
                                            {
                                                faker.role === "owner" ? (
                                                    <a
                                                className="flex items-centertext-primary"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    // setDeleteConfirmationModal(
                                                    //     true
                                                    // );
                                                }}
                                            >
                                                <Lucide
                                                    icon="ShoppingCart"
                                                    className="w-4 h-4 mx-1"
                                                />{" "}
                                                Store
                                            </a> 
                                                ) : ""
                                            }
                                           
                                        </div>
                                    </Table.Td>
                                </Table.Tr>
                            ))}
                        </Table.Tbody>
                    </Table>
                </div>
                {/* END: Data List */}
                {/* BEGIN: Pagination */}
        <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                <Pagination className="w-full sm:w-auto sm:mr-auto">
                    <Pagination.Link onClick={(e) => 
                        {
                            e.preventDefault()
                            setCurrentPage(Math.max(1, currentPage - 1))
                        
                        }}>
                        <Lucide icon="ChevronLeft" className="w-4 h-4" />
                    </Pagination.Link>
                    {[...Array(totalPages)].map((_, idx) => (
                        <Pagination.Link key={idx} active={idx + 1 === currentPage} onClick={(e) => 
                        {
                            // e.preventDefault()
                            setCurrentPage(idx + 1)}
                        }
                        >
                            {idx + 1}
                        </Pagination.Link>
                    ))}
                    <Pagination.Link onClick={(e) => 
                        {
                            e.preventDefault()
                             setCurrentPage(Math.min(totalPages, currentPage + 1))
                        }
                       }>
                        <Lucide icon="ChevronRight" className="w-4 h-4" />
                    </Pagination.Link>
                </Pagination>
                <FormSelect className="w-20 mt-3 !box sm:mt-0" value={itemsPerPage.toString()} onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}>
                    <option>10</option>
                    <option>25</option>
                    <option>35</option>
                    <option>50</option>
                </FormSelect>
            </div>
        {/* END: Pagination */}
            </div>
        </div>
    ) : (
        (window.location.href = "/error")
    );
}
