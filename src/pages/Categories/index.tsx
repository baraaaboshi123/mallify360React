import _ from "lodash";
import { useState, useRef, useEffect } from "react";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormLabel, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import { Dialog, Menu } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import Notification, { NotificationElement } from "../../base-components/Notification";


function Main() {
    const [deleteConfirmationModal, setDeleteConfirmationModal] =
        useState(false);
    const deleteButtonRef = useRef(null);
    const [catigoryModalPreview, setCatigoryModalPreview] = useState(false);
    const [cname, setCname] = useState("");
    const [catigories, setCatigories] = useState<
        Array<{
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
                setCatigories(response.data);
            });
    };
    const handleSubmit = (e: any) => {
        e.preventDefault();
        axios
            .post("http://localhost:8000/addCatigory", {
                name: cname,
                store_id: localStorage.getItem("store_id"),
            })
            .then((response) => {
                console.log(response.data.message);
                setCatigoryModalPreview(false);
                successNotificationToggle()
                fetchCatigories()
            });
    };
    useEffect(() => {
        localStorage.setItem("page", "Categories")
        fetchCatigories();
    }, []);
    const successNotification = useRef<NotificationElement | null>(null);
    const successNotificationToggle = () => {
        if (successNotification.current) {
          successNotification.current.showToast();
        }
      };
    return (
        <>
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
                category added successfully.
            </div>
        </div>
    </Notification>
    {/* END: Notification Content */}
            <Dialog
                open={catigoryModalPreview}
                onClose={() => {
                    setCatigoryModalPreview(false);
                }}
                initialFocus={deleteButtonRef}
            >
                <Dialog.Panel>
                    <div className="p-5 text-center">
                        <div className="mt-5 text-3xl">
                            <h2 className="text-xl font-bold mb-4">
                                Add New Catigory
                            </h2>
                        </div>
                    </div>
                    <div className="px-5 pb-8 text-center">
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-2  gap-2">
                                <FormLabel htmlFor="shareAmount">
                                    Catigory Name
                                </FormLabel>
                                <FormInput
                                    type="text"
                                    id="shareAmount"
                                    name="shareAmount"
                                    value={cname}
                                    onChange={(e) => {
                                        setCname(e.target.value);
                                    }}
                                    placeholder="Catigory Name"
                                />
                            </div>
                            <div className="mt-5">
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => {
                                        setCatigoryModalPreview(false);

                                        setCname("");
                                    }}
                                    className="w-24 mr-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-24 text-white "
                                    ref={deleteButtonRef}
                                >
                                    Add
                                </Button>
                            </div>
                        </form>
                    </div>
                </Dialog.Panel>
            </Dialog>
            <h2 className="mt-10 text-lg font-medium intro-y">Categories</h2>
            <div className="grid grid-cols-12 gap-6 mt-5">
                <div className="flex flex-wrap items-center col-span-12 mt-2 intro-y sm:flex-nowrap">
                    <Button
                        variant="primary"
                        className="mr-2 shadow-md"
                        onClick={() => setCatigoryModalPreview(true)}
                    >
                        Add New Category
                    </Button>
                    <Menu>
                        <Menu.Button as={Button} className="px-2 !box">
                            <span className="flex items-center justify-center w-5 h-5">
                                <Lucide icon="Plus" className="w-4 h-4" />
                            </span>
                        </Menu.Button>
                        <Menu.Items className="w-40">
                            <Menu.Item>
                                <Lucide
                                    icon="Printer"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Print
                            </Menu.Item>
                            <Menu.Item>
                                <Lucide
                                    icon="FileText"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Export to Excel
                            </Menu.Item>
                            <Menu.Item>
                                <Lucide
                                    icon="FileText"
                                    className="w-4 h-4 mr-2"
                                />{" "}
                                Export to PDF
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                    
                    <div className="w-full mt-3 sm:w-auto sm:mt-0 sm:ml-auto md:ml-0">
                        <div className="relative w-56 text-slate-500">
                            <FormInput
                                type="text"
                                className="w-56 pr-10 !box"
                                placeholder="Search..."
                            />
                            <Lucide
                                icon="Search"
                                className="absolute inset-y-0 right-0 w-4 h-4 my-auto mr-3"
                            />
                        </div>
                    </div>
                </div>
                {/* BEGIN: Data List */}
                <div className="col-span-12 overflow-auto intro-y lg:overflow-visible">
                    <Table className="border-spacing-y-[10px] border-separate -mt-2">
                        <Table.Thead>
                            <Table.Tr>
                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    CATEGORY NAME
                                </Table.Th>

                                <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                    ACTIONS
                                </Table.Th>
                            </Table.Tr>
                        </Table.Thead>
                        <Table.Tbody>
                            {catigories.length>0? 
                               catigories.map((faker, fakerKey) => (
                                <Table.Tr key={fakerKey} className="intro-x">
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
                            )):"no categories yet"}
                        </Table.Tbody>
                    </Table>
                </div>
                {/* END: Data List */}
              
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

export default Main;
