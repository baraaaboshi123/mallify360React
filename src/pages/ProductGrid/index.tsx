import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import * as XLSX from "xlsx";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Main() {
    function exportToExcel(
        data: Array<{
            name: string;
            description: string;
            id: number;
            condition: string;
            price: number;
            quantity: number;
            status: number;
            featured: boolean;
            catigory_id: number;
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
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [filter, setFilter] = useState(1000);
    const [products, setProducts] = useState<
        Array<{
            name: string;
            description: string;
            id: number;
            condition: string;
            price: number;
            quantity: number;
            status: number;
            featured: boolean;
            catigory_id: number;
        }>
    >([]);
    const [allProducts, setAllProducts] = useState<
        Array<{
            name: string;
            description: string;
            id: number;
            condition: string;
            price: number;
            quantity: number;
            status: number;
            featured: boolean;
            catigory_id: number;
        }>
    >([]);
    const [images, setImages] = useState<Array<string>>([]);

    const fetchProducts = () => {
        axios
            .get(
                `http://localhost:8000/products/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAllProducts(response.data);
                setCurrentPage(1);
            });
    };

    const navigate = useNavigate();
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const deleteButtonRef = useRef(null);
    const [deletedId, setDeletedId] = useState(0);

    const getImages = async () => {
        try {
            const requests = products.map(async (element) => {
                const response = await axios.get(
                    `http://localhost:8000/getImagesWeb/${element.id}`
                );
                return response.data.images[0];
            });

            const imagesData = await Promise.all(requests);

            // Now 'imagesData' contains an array of responses in the same order as 'products'
            console.log(imagesData);
            setImages(imagesData);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        localStorage.setItem("page", "Products")
        fetchProducts();
        getImages();
    }, []);

    useEffect(() => {
        getImages();
    }, [products, allProducts]);

    useEffect(() => {
        setTotal(allProducts.length);
        let filtered = allProducts;
        if (filter !== 1000) {
            if (filter === -1) {
                filtered = filtered.filter(
                    (transaction) => transaction.quantity == 0
                );
            } else
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
        setProducts(paginatedTransactions);
    }, [filter, userName, currentPage, itemsPerPage, allProducts]);

    const totalPages = Math.ceil(allProducts.length / itemsPerPage);
    return (
        <>
            <h2 className="mt-10 text-lg font-medium intro-y">Product Grid</h2>
            <Button
                variant="primary"
                className="mr-2 mt-4 shadow-md"
                onClick={() => navigate("/addProduct")}
            >
                Add New Product
            </Button>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
                    <div className="flex w-full sm:w-auto">
                        <div className="relative w-48 text-slate-500">
                            <FormInput
                                type="text"
                                className="w-58 pr-10 !box"
                                placeholder="Search by product name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <Lucide
                                icon="Search"
                                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                            />
                        </div>
                        <FormSelect
                            className="ml-10 !box"
                            value={filter}
                            onChange={(e) =>
                                setFilter(parseInt(e.target.value))
                            }
                        >
                            <option value={1000}>Status</option>
                            <option value={1}>Active</option>
                            <option value={0}>Inactive</option>
                            <option value={-1}>Out of stock</option>
                        </FormSelect>
                    </div>
                    <div className="hidden mx-auto xl:block text-slate-500">
                        Showing 1 to {itemsPerPage} of {total} entries
                    </div>
                    <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                        <Button
                            variant="primary"
                            className="mr-2 shadow-md"
                            onClick={() =>
                                exportToExcel(allProducts, "products")
                            }
                        >
                            <Lucide icon="FileText" className="w-4 h-4 mr-2" />{" "}
                            Export to Excel
                        </Button>

                        <Menu className="menu">
                            <Menu.Button as={Button} className="px-2 !box">
                                <span className="flex items-center justify-center w-5 h-5">
                                    <Lucide icon="Plus" className="w-4 h-4" />
                                </span>
                            </Menu.Button>
                            <Menu.Items className="w-40">
                                <Menu.Item onClick={() => window.print()}>
                                    <Lucide
                                        icon="Printer"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Print
                                </Menu.Item>
                                <Menu.Item
                                    onClick={() =>
                                        exportToExcel(allProducts, "products")
                                    }
                                >
                                    <Lucide
                                        icon="FileText"
                                        className="w-4 h-4 mr-2"
                                    />{" "}
                                    Export to Excel
                                </Menu.Item>
                            </Menu.Items>
                        </Menu>
                    </div>
                </div>
                {/* BEGIN: Users Layout */}
                {products.map((faker, fakerKey) => (
                    <div
                        key={fakerKey}
                        className="col-span-12 intro-y md:col-span-6 lg:col-span-4 xl:col-span-3"
                    >
                        <div className="box">
                            <div className="p-5">
                                <div className="h-40 overflow-hidden rounded-md 2xl:h-56 image-fit before:block before:absolute before:w-full before:h-full before:top-0 before:left-0 before:z-10 before:bg-gradient-to-t before:from-black before:to-black/10">
                                    <img
                                        alt="Midone - HTML Admin Template"
                                        className="rounded-md"
                                        src={images[fakerKey]}
                                    />
                                    {faker.featured && (
                                        <span className="absolute top-0 z-10 px-2 py-1 m-5 text-xs text-white rounded bg-pending/80">
                                            Featured
                                        </span>
                                    )}
                                    {faker.quantity === 0 && (
                                        <span className="absolute top-0 z-10 px-2 py-1 m-5 text-xs text-white rounded bg-danger">
                                            Out Of Stock
                                        </span>
                                    )}
                                    <div className="absolute bottom-0 z-10 px-5 pb-6 text-white">
                                        <a
                                            href=""
                                            className="block text-base font-medium"
                                        >
                                            {faker.name}
                                        </a>
                                        <span className="mt-3 text-xs text-white/90">
                                            {faker.catigory_id}
                                        </span>
                                    </div>
                                </div>
                                <div className="mt-5 text-slate-600 dark:text-slate-500">
                                    <div className="flex items-center">
                                        <Lucide
                                            icon="Link"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Price: {faker.price}₪
                                    </div>
                                    <div className="flex items-center mt-2">
                                        <Lucide
                                            icon="Layers"
                                            className="w-4 h-4 mr-2"
                                        />{" "}
                                        Remaining Stock:
                                        {faker.quantity}
                                    </div>
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
                                <a
                                    className="flex items-center mr-auto text-primary"
                                    href="#"
                                >
                                    <Lucide
                                        icon="ArrowLeftRight"
                                        className="w-4 h-4 mr-1"
                                    />{" "}
                                    Toggle status
                                </a>
                                <a
                                    className="flex items-center mr-3 cursor-pointer"
                                    href=""
                                    onClick={() =>
                                        navigate("/addProduct", {
                                            state: { id: faker.id },
                                        })
                                    }
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
                {/* BEGIN: Pagination */}
                <div className="flex flex-wrap items-center col-span-12 intro-y sm:flex-row sm:flex-nowrap">
                    <Pagination className="w-full sm:w-auto sm:mr-auto">
                        <Pagination.Link
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(Math.max(1, currentPage - 1));
                            }}
                        >
                            <Lucide icon="ChevronLeft" className="w-4 h-4" />
                        </Pagination.Link>
                        {[...Array(totalPages)].map((_, idx) => (
                            <Pagination.Link
                                key={idx}
                                active={idx + 1 === currentPage}
                                onClick={(e) => {
                                    // e.preventDefault()
                                    setCurrentPage(idx + 1);
                                }}
                            >
                                {idx + 1}
                            </Pagination.Link>
                        ))}
                        <Pagination.Link
                            onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(
                                    Math.min(totalPages, currentPage + 1)
                                );
                            }}
                        >
                            <Lucide icon="ChevronRight" className="w-4 h-4" />
                        </Pagination.Link>
                    </Pagination>
                    <FormSelect
                        className="w-20 mt-3 !box sm:mt-0"
                        value={itemsPerPage.toString()}
                        onChange={(e) =>
                            setItemsPerPage(parseInt(e.target.value, 10))
                        }
                    >
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
                            onClick={() => {
                                axios
                                    .delete(
                                        `http://localhost:8000/deleteProduct/${deletedId}`
                                    )
                                    .then((response) => {
                                        console.log(
                                            "product deleted successfully"
                                        );
                                        setDeleteConfirmationModal(false);
                                        fetchProducts();
                                    });
                            }}
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

export default Main;
