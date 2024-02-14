import React, { useEffect, useRef, useState } from 'react'
import Button from "../../base-components/Button";
import { useNavigate, } from 'react-router-dom';
import Table from '../../base-components/Table';
import axios from 'axios';
import Tippy from '../../base-components/Tippy';
import * as XLSX from "xlsx";
import Lucide from '../../base-components/Lucide';
import ErrorPage from "../ErrorPage";
import Pagination from '../../base-components/Pagination';
import { FormInput, FormSelect } from '../../base-components/Form';
import Menu from '../../base-components/Headless/Menu';
import { Dialog } from '../../base-components/Headless';
import Notification, { NotificationElement } from "../../base-components/Notification";


type Props = {}

export default function index({}: Props) {
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
    useState(false);
const deleteButtonRef = useRef(null);
    function exportToExcel(
        data: Array<{
            name: string;
        }>,
        fileName: string
    ) {
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

        // Write the workbook to a file
        XLSX.writeFile(workbook, `${fileName}.xlsx`);
    }
    const [currentPage, setCurrentPage] = useState(1);
    const [userName, setUserName] = useState("");
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [total, setTotal] = useState(0);
    const [deletedId, setDeletedId] = useState(0)
  const navigate = useNavigate()
  const [interests, setInterests] = useState<
  Array<{
      name: string;
      path: string;
      id: number;
  }>
>([]);
const [allInterests, setAllInterests] = useState<
Array<{
    name: string;
    path: string;
    id:number;
}>
>([]);
const fetchInterests = () => {
  axios.get(`http://localhost:8000/getAdminCategories`).then((response) => {
      setAllInterests(response.data);
  });
};
useEffect(() => {
    localStorage.setItem("page", "AdminCategories")
  fetchInterests();
}, []);

useEffect(() => {
    setTotal(allInterests.length);
    let filtered = allInterests;
    
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
    setInterests(paginatedTransactions);
}, [ userName, currentPage, itemsPerPage, allInterests]);

const totalPages = Math.ceil(allInterests.length / itemsPerPage);

const deleteCategory = async() =>{
    await axios.delete(`http://localhost:8000/removeAdminCategory/${deletedId}`).then((response)=>{
        if(response.status ==200){
            successNotificationToggle()
            setDeleteConfirmationModal(false)
            fetchInterests()
        }
        else if(response.data.message == "00"){
           // faildNotificationToggle()
        }
    })
}
const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };
      const faildNotification = useRef<NotificationElement | null>(null);
    const faildNotificationToggle = () => {
        if (faildNotification.current) {
          faildNotification.current.showToast();
        }
      };

  return (
    localStorage.getItem("role") === "admin" ? (
       
        <div>
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
                category deleted successfully.
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
                        onClick={()=>{
                            
                            deleteCategory()
                        }}
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
        <h2 className="mt-10 text-xl font-medium intro-y">Categories List</h2>
        <div className='m-5'>
            <Button variant='primary'
            onClick={()=> navigate("/addAdminCategories")}
            >
                Add New Category
            </Button>
        </div>

        <div className="grid grid-cols-12 gap-6 mt-5">

        <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y xl:flex-nowrap">
            <div className="flex w-full sm:w-auto">
                <div className="relative w-48 text-slate-500">
                    <FormInput
                        type="text"
                        className="w-48 pr-10 !box"
                        placeholder="Search by category name"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <Lucide
                        icon="Search"
                        className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                    />
                </div>
                
            </div>
            <div className="hidden mx-auto xl:block text-slate-500">
                Showing 1 to {itemsPerPage} of {total} entries
            </div>
            <div className="flex items-center w-full mt-3 xl:w-auto xl:mt-0">
                <Button
                    variant="primary"
                    className="mr-2 shadow-md"
                    onClick={() => exportToExcel(allInterests, "adminCategories")}
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
                                exportToExcel(allInterests, "adminCategories")
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
                                    CATEGORY IMAGE
                                </Table.Th>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                CATEGORY NAME
                                </Table.Th>

                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {interests.map((faker, fakerKey) => (
                                <Table.Tr key={fakerKey} className="intro-x">
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                    <div className="w-10 h-10 image-fit zoom-in">
                                                <Tippy
                                                    as="img"
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    className="rounded-full  shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                    src={"http://localhost:8000/storage/" + faker.path}
                                                    content={`Uploaded at`}
                                                />
                                            </div>
                                    </Table.Td>
                                    <Table.Td className="first:rounded-l-md text-center last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                        <a
                                            href=""
                                            className="font-medium text-center  whitespace-nowrap"
                                        >
                                            {faker.name}
                                        </a>
                                    </Table.Td>

                                    <Table.Td className="first:rounded-l-md last:rounded-r-md w-56 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b] py-0 relative before:block before:w-px before:h-8 before:bg-slate-200 before:absolute before:left-0 before:inset-y-0 before:my-auto before:dark:bg-darkmode-400">
                                        <div className="flex items-center justify-center">
                                            <a
                                                className="flex items-center mr-3"
                                                href=""
                                            >
                                                <Lucide
                                                    icon="CheckSquare"
                                                    className="w-4 h-4 mr-1"
                                                />
                                                Edit
                                            </a>
                                            <a
                                                className="flex items-center text-danger"
                                                href="#"
                                                onClick={(event) => {
                                                    event.preventDefault();
                                                    setDeletedId(faker.id)
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
    </div>
    ) : 
    (
        window.location.href = "/error"
    )
    
  )
}