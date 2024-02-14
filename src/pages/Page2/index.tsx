import _ from "lodash";
import clsx from "clsx";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormCheck, FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import * as XLSX from 'xlsx';

function Main() {
    function exportToExcel(data : Array<{
        id: number;
        user_id: number;
        user_first_name: string;
        user_last_name: string;
        user_phone: string;
        user_city: string;
        user_address: string;
        total_price_from_store: number;
        status: string;
    }>, fileName : string) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    
        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
const [total, setTotal] = useState(0)
  const [filter, setFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
    const [orders, setOrders] = useState<
        Array<{
            id: number;
            user_id: number;
            user_first_name: string;
            user_last_name: string;
            user_phone: string;
            user_city: string;
            user_address: string;
            total_price_from_store: number;
            status: string;
        }>
    >([]);

    const [allOrders, setAllOrders] = useState<
        Array<{
            id: number;
            user_id: number;
            user_first_name: string;
            user_last_name: string;
            user_phone: string;
            user_city: string;
            user_address: string;
            total_price_from_store: number;
            status: string;
        }>
    >([]);

    const fetchOrders = async () => {
        await axios
            .get(
                `http://localhost:8000/getOrdersForStore/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAllOrders(response.data);
                setCurrentPage(1)
            });
    };

    useEffect(() => {
        localStorage.setItem("page","Orders")
        fetchOrders();

    }, []);
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const [deleteConfirmationModal1, setDeleteConfirmationModal1] =
        useState(false);
    const deleteButtonRef = useRef(null);

    const [products, setProducts] = useState<
        Array<{
            id: number;
            name: string;
            path: string;
            price: number;
            pivot: {
                quantity: number;
                properties:string;
            };
        }>
    >([]);
    const [orderId, setOrderId] = useState(0);

    const fetchOrderProducts = async (id: number) => {
        const storeId = localStorage.getItem("store_id");
    
        if (storeId !== null) {
            await axios.get(`http://localhost:8000/getOrderProducts/${id}`, {
                params: {
                    store_id: storeId
                }
            })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching order products:", error);
                // Optionally handle the error, e.g., set an error state, show a message, etc.
            });
        } else {
            console.error("Store ID is null");
            // Optionally handle the case when storeId is null
        }
    };
    
    const [customerName, setCustomerName] = useState("")

    const getImageSrc = async (productId: number) => {
        try {
            // Make an API call to fetch the image source based on the productId
            const response = await axios.get(
                `http://localhost:8000/getImagesWeb/${productId}`
            );
            console.log(response.data);
            return response.data.images[0]; // Adjust the property based on your API response
        } catch (error) {
            console.error("Error fetching image source:", error);
            return ""; // Return a default or empty string in case of an error
        }
    };
    useEffect(() => {
        console.log(products);
        products.forEach((sale: any) => {
            getImageSrc(sale.id).then((imageSrc) => {
                setProductImages((prevImages) => ({
                    ...prevImages,
                    [sale.id]: imageSrc,
                }));
            });
        });
    }, [products]);


    useEffect(() => {
        setTotal(allOrders.length)
        let filtered = allOrders;
        if (filter !== "all") {
            filtered = filtered.filter(transaction => transaction.status === filter);
        }
        if (customerName !== "") {
            filtered = filtered.filter(transaction => 
                transaction.user_first_name && transaction.user_first_name.toLowerCase().startsWith(customerName.toLowerCase())
            );}
        const startIndex = (currentPage - 1) * itemsPerPage;
        const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);
        setOrders(paginatedTransactions);
    }, [filter, customerName, currentPage, itemsPerPage, allOrders]);
    
    const totalPages = Math.ceil(allOrders.length / itemsPerPage);

    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Orders List</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
            <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
          <div className="flex w-full sm:w-auto">
            <div className="relative w-48 text-slate-500">
              <FormInput
                type="text"
                className="w-48 pr-10 !box"
                placeholder="Search by store name"
                value={customerName}
                onChange={(e)=>setCustomerName(e.target.value)}
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
              <option value="placed">placed</option>
              <option value="Out for Delivery">Out for Delivery </option>
              <option value="Delivered">Delivered</option>
            </FormSelect>
          </div>
          <div className="hidden mx-auto xl:block text-slate-500">
            Showing 1 to {itemsPerPage} of {total} entries
          </div>
          <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
            <Button variant="primary" className="mr-2 shadow-md" onClick={()=>exportToExcel(allOrders,"orders")}>
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
                <Menu.Item onClick={()=>exportToExcel(allOrders,"orders")}>
                  <Lucide icon="FileText" className="w-4 h-4 mr-2" /> Export to
                  Excel
                </Menu.Item>
                
              </Menu.Items>
            </Menu>
          </div>
        </div>





                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y 2xl:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                               
                                <Table.Th className="border-b-0 whitespace-nowrap">
                                    CUSTOMER
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ADDRESS
                                </Table.Th>

                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    STATUS
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    TOTAL PRICE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {orders.map((faker, fakerKey) => (
                                <Table.Tr key={fakerKey} className="intro-x">
                                    
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md !py-3.5 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <div className="flex items-center">
                                            <div className="ml-4">
                                                <a
                                                    href=""
                                                    className="font-medium whitespace-nowrap"
                                                >
                                                    {faker.user_first_name +
                                                        " " +
                                                        faker.user_last_name}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {faker.user_phone}
                                                </div>
                                            </div>
                                        </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.user_city +
                                            " " +
                                            faker.user_address}
                                    </Table.Td>

                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.status}
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        {faker.total_price_from_store} ₪
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            <a
                                                className="flex items-center mr-3"
                                                href="#"
                                                onClick={() => {
                                                    //setOrderId(faker.id);
                                                    fetchOrderProducts(
                                                        faker.id
                                                    );
                                                    setDeleteConfirmationModal1(
                                                        true
                                                    );
                                                }}
                                            >
                                                <Lucide
                                                    icon="List"
                                                    className="w-4 h-4 mr-1"
                                                />{" "}
                                                Products
                                            </a>
                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                                onClick={() => {
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

            {/* BEGIN: Delete Confirmation Modal */}
            <Dialog
                size="xl"
                open={deleteConfirmationModal1}
                onClose={() => {
                    setDeleteConfirmationModal1(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel className="max-w-4xl w-full overflow-auto">
                    <div className="box text-center p-8">
                        <p className="text-xl">List Of All Order Products</p>

                        {products.map((product, index) => (
                            <Table className="border-spacing-y-[10px] border-separate -mt-2">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="border-b-0 whitespace-nowrap">
                                            PRODUCT IMAGE
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            PRODUCT NAME
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            PRODUCT PRICE
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            PRODUCT QUANTITY
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            PRODUCT PROPERTIES
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            ACTIONS
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    <Table.Tr key={index} className="intro-x">
                                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <div className="w-10 h-10 image-fit zoom-in">
                                                <Tippy
                                                    as="img"
                                                    alt="Product Image"
                                                    className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                    src={
                                                        productImages[
                                                            product.id
                                                        ] || ""
                                                    }
                                                    content={`Uploaded at`}
                                                />
                                            </div>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <a
                                                href=""
                                                className="font-medium text-center whitespace-nowrap"
                                            >
                                                {product.name}
                                            </a>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <a
                                                href=""
                                                className="font-medium text-center whitespace-nowrap"
                                            >
                                                {product.price }₪
                                            </a>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <a
                                                href=""
                                                className="font-medium text-center whitespace-nowrap"
                                            >
                                                {product.pivot.quantity}
                                            </a>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                            <a
                                                href=""
                                                className="font-medium text-center whitespace-nowrap"
                                            >
                                                {product.pivot.properties}
                                            </a>
                                        </Table.Td>
                                        <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                            <div className="flex items-center justify-center">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => {
                                                        // Set your onClick functionality here
                                                    }}
                                                >
                                                    remove
                                                </Button>
                                            </div>
                                        </Table.Td>
                                    </Table.Tr>
                                </Table.Tbody>
                            </Table>
                        ))}
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
        </>
    );
}

export default Main;
