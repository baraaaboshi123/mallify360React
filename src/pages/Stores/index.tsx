import React, { useEffect, useState } from "react";
import Button from "../../base-components/Button";
import { useNavigate } from "react-router-dom";
import Table from "../../base-components/Table";
import axios from "axios";
import Tippy from "../../base-components/Tippy";
import Lucide from "../../base-components/Lucide";
import ErrorPage from "../ErrorPage";
import * as XLSX from "xlsx";
import { FormInput, FormSelect } from "../../base-components/Form";
import Menu from "../../base-components/Headless/Menu";
import Pagination from "../../base-components/Pagination";

type Props = {};

export default function index({}: Props) {
    function exportToExcel(
        data: Array<{
            name: string;
            path: string;
            status: number;
            admin_category_id: number;
            id: number;
            category: {
                name: string;
            };
        }>,
        fileName: string
    ) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
    const [userName, setUserName] = useState("");
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState(2);
    const [storeImages, setStoreImages] = useState<{
        [key: number]: string;
    }>({});
    const getImageSrc = async (storeId: number) => {
        try {
            // Make an API call to fetch the image source based on the productId
            const response = await axios.get(
                `http://localhost:8000/getLogo/${storeId}`
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
            path: string;
            status: number;
            admin_category_id: number;
            id: number;
            category: {
                name: string;
            };
        }>
    >([]);
    const [allStores, setAllStores] = useState<
        Array<{
            name: string;
            path: string;
            status: number;
            admin_category_id: number;
            id: number;
            category: {
                name: string;
            };
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

    useEffect(() => {
        if(deletedId != 0)
        toggleStatus();
    }, [deletedId]);

    const changeStatus = async () => {
        toggleStatus();
    };
    const fetchInterests = () => {
        axios.get(`http://localhost:8000/stores`).then((response) => {
            setAllStores(response.data);
        });
    };
    useEffect(() => {
        localStorage.setItem("page","Stores")
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
    }, [allStores,stores]);

    useEffect(() => {
        setTotal(allStores.length);
        let filtered = allStores;
        if (filter != 2) {
            filtered = filtered.filter(
                (transaction) => transaction.status == filter
            );
        }
        if (userName !== "") {
            filtered = filtered.filter(
                (transaction) =>
                    transaction.name &&
                    transaction.name
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

    return localStorage.getItem("role") === "admin" ? (
        <div>
            <h2 className="mt-10 text-xl font-medium intro-y">Stores List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
            <div className="flex w-full sm:w-auto">
                <div className="relative w-48 text-slate-500">
                    <FormInput
                        type="text"
                        className="w-48 pr-10 !box"
                        placeholder="Search by store name"
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
                    onChange={(e) => setFilter(parseInt(e.target.value))}
                >
                    <option value={2}>Status</option>
                    <option value={1}>Active</option>
                    <option value={0}>Inactive</option>
                </FormSelect>
            </div>
            <div className="hidden mx-auto xl:block text-slate-500">
                Showing 1 to {itemsPerPage} of {total} entries
            </div>
            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                <Button
                    variant="primary"
                    className="mr-2 shadow-md"
                    onClick={() => exportToExcel(allStores, "stores")}
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
                                exportToExcel(allStores, "stores")
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
                                    STORE IMAGE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STORE NAME
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STORE CATEGORY
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STORE STATUS
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
                                                    storeImages[faker.id] || ""
                                                }
                                                content={`Uploaded at`}
                                            />
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.name}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.category.name}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.status === 1 ? (
                                            <span className="text-success">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-danger">
                                                Inactive
                                            </span>
                                        )}
                                    </Table.Td>

                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            {faker.status === 1 ? (
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
                                                <a
                                                    className="flex items-center mr-3 text-success cursor-pointer"
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
                                            )}
                                            <a className="flex items-center mr-3">
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Edit
                                            </a>
                                            <a
                                                className="flex items-center text-danger"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    // setDeleteConfirmationModal(
                                                    //     true
                                                    // );
                                                }}
                                            >
                                                <Lucide
                                                    icon="Trash2"
                                                    className="w-4 h-4 mr-1"
                                                />{" "}
                                                Delete
                                            </a>
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
