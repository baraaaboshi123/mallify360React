import React, { useEffect } from "react";
import { useState, useRef } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import * as XLSX from "xlsx";

type Props = {};
interface ProductInfo {
    name: string;
    price: number;
}

export default function index({}: Props) {
    function exportToExcel(
        data: Array<{
            id: number;
            product_id: number;
            percentage: number;
            end_date: string;
        }>,
        fileName: string
    ) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
    const [productName, setProductName] = useState("")
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState("all");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const [productInfo, setProductInfo] = useState<Record<number, ProductInfo>>(
        {}
    );
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
        fetchCatigories();
    }, []);
    const [categories, setCategories] = useState<
        Array<{
            id: number;
            name: string;
        }>
    >([]);

    const deleteButtonRef = useRef(null);

    const [sales, setSales] = useState<
        Array<{
            id: number;
            product_id: number;
            percentage: number;
            end_date: string;
        }>
    >([]);
    const [allSales, setAllSales] = useState<
        Array<{
            id: number;
            product_id: number;
            percentage: number;
            end_date: string;
        }>
    >([]);
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});

    const fetchSales = async () => {
        await axios
            .get(
                `http://localhost:8000/getSalesWeb/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAllSales(response.data);
                setCurrentPage(1)
            });
    };
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
        localStorage.setItem("page", "Sales")
        fetchSales();

    }, []);

    useEffect(() => {
        sales.forEach((sale: any) => {
            getImageSrc(sale.product_id).then((imageSrc) => {
                setProductImages((prevImages) => ({
                    ...prevImages,
                    [sale.product_id]: imageSrc,
                }));
            });
        });
    }, [sales,allSales]);
    async function fetchProductInfo(productId: number): Promise<ProductInfo> {
        const apiUrl = `http://localhost:8000/product/${productId}`;

        try {
            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(
                    `API responded with status code ${response.status}`
                );
            }
            const productInfo: ProductInfo = await response.json();
            return productInfo;
        } catch (error) {
            // Handle errors, such as network issues
            console.error("Error fetching product info:", error);
            throw error; // Or handle it more gracefully as needed
        }
    }

    useEffect(() => {
        const fetchProductData = async () => {
            let newProductInfo: Record<number, ProductInfo> = {};

            for (const sale of sales) {
                const data: ProductInfo = await fetchProductInfo(
                    sale.product_id
                );
                newProductInfo[sale.product_id] = data;
            }

            setProductInfo(newProductInfo);
        };

        fetchProductData();
    }, [sales,allSales]);
    const navigate = useNavigate();
    useEffect(() => {
        setTotal(allSales.length)
        let filtered = allSales;
        if (filter !== "all") {
            const currentDate = new Date();
        
            if (filter === "active") {
                // Filter for active transactions (end date not yet occurred)
                filtered = filtered.filter(transaction => 
                    new Date(transaction.end_date) > currentDate
                );
            } else if (filter === "finished") {
                // Filter for finished transactions (end date already passed)
                filtered = filtered.filter(transaction => 
                    new Date(transaction.end_date) <= currentDate
                );
            }
        }
        if (productName !== "") {
            filtered = filtered.filter(transaction => {
                // Check if transaction exists and has a product_id
                if (transaction && transaction.product_id) {
                    // Get the product name using the product_id from productInfo
                    const productNameFromId = productInfo[transaction.product_id]?.name;
        
                    // Check if the product name matches the filter condition
                    return productNameFromId && productNameFromId.toLowerCase().startsWith(productName.toLowerCase());
                }
                return false;
            });
        }
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);
        setSales(paginatedTransactions);
    }, [filter, productName, currentPage, itemsPerPage, allSales]);
    
    const totalPages = Math.ceil(allSales.length / itemsPerPage);
    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Sales List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <Button variant="primary" onClick={()=>navigate("/addSales")}>Add  Sale</Button>
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="relative w-48 text-slate-500">
              <FormInput
                type="text"
                className="w-48 pr-10 !box"
                placeholder="Search by product name"
                value={productName}
                onChange={(e)=>setProductName(e.target.value)}
              />
              <Lucide
                icon="Search"
                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
              />
            </div>
            <FormSelect className="ml-2 !box"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Status</option>
              <option value="active">Active</option>
              <option value="finished">Finished</option>
              
            </FormSelect>
          </div>
          <div className="hidden mx-auto xl:block text-slate-500">
            Showing 1 to {itemsPerPage} of {total} entries
          </div>
          <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
            <Button variant="primary" className="mr-2 shadow-md" onClick={()=>exportToExcel(allSales,"sales")}>
              <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
              Excel
            </Button>
            
            <Menu className="menu">
              <Menu.Button as={Button} className="px-2 !box">
                <span className="flex items-center justify-center w-5 h-5">
                  <Lucide icon="Plus" className="w-4 h-4" />
                </span>
              </Menu.Button>
              <Menu.Items className="w-40">
                <Menu.Item onClick={()=>window.print()}>
                  <Lucide icon="Printer" className="w-4 h-4 mr-2" /> Print
                </Menu.Item>
                <Menu.Item onClick={()=>exportToExcel(allSales,"sales")}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
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
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    IMAGES
                                </Table.Th>
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    PRODUCT NAME
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    PERCENTAGE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    NEW PRICE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    END DATE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {sales.map((faker, fakerKey) => (
                                <Table.Tr key={fakerKey} className="intro-x">
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="flex">
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                <Tippy
                                                    as="img"
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                    src={
                                                        productImages[
                                                            faker.product_id
                                                        ] || ""
                                                    }
                                                    content={`Uploaded at`}
                                                />
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <a
                                            href=""
                                            className="font-medium whitespace-nowrap"
                                        >
                                            {
                                                productInfo[faker.product_id]
                                                    ?.name
                                            }
                                        </a>
                                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                            {/* {faker.products[0].category} */}
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.percentage}%
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {productInfo[faker.product_id]?.price -
                                            (productInfo[faker.product_id]
                                                ?.price *
                                                faker.percentage) /
                                                100}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.end_date}
                                        {/* <div
                                             className={clsx([
                                                 "flex items-center justify-center",
                                                 {
                                                     "text-success":
                                                         faker.trueFalse[0],
                                                 },
                                                 {
                                                     "text-danger":
                                                         !faker.trueFalse[0],
                                                 },
                                             ])}
                                        >
                                            <Lucide
                                                icon="CheckSquare"
                                                className="w-4 h-4 mr-2"
                                            />
                                            {faker.trueFalse[0]
                                                ? "Active"
                                                : "Inactive"}
                                        </div> */}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            <a
                                                className="flex items-center mr-3"
                                                href="#"
                                            >
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
                                                    setDeleteConfirmationModal(
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
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog.Panel>
            </Dialog>
            {/* END: Delete Confirmation Modal */}
        </>
    );
}
