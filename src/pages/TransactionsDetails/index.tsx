import _ from "lodash";
import Button from "../../base-components/Button";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import { Menu } from "../../base-components/Headless";
import { useLocation } from "react-router-dom";
import Table from "../../base-components/Table";
import { useEffect, useState } from "react";
import axios from "axios";

function Main() {
    const location = useLocation();
    const idFromPreviousPage = location.state?.id;

    const [transaction, setTransaction] = useState<{
        user_name: string;
        type: string;
        status: string;
        amount: number;
        total_amount:number;
        order_id: number;
        user_id: number;
        store_id: number;
        created_at: string;
        order: {
            user_phone: string;
            user_city: string;
            user_address: string;
        };
        store: {
            location: string;
            phone: string;
        };
    }>({
        user_name: "string",
        type: "string",
        status: "string",
        amount: 0,
        order_id: 0,
        user_id: 0,
        total_amount:0,
        store_id: 0,
        created_at: "",
        order: {
            user_phone: "",
            user_city: "",
            user_address: "",
        },
        store: {
            phone: "",
            location: "",
        },
    });

    const fetchTransaction = async () => {
        await axios
            .get(`http://localhost:8000/transaction/${idFromPreviousPage}`)
            .then((response) => {
                setTransaction(response.data);
            });
    };
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});

    const [products, setProducts] = useState<
        Array<{
            id: number;
            name: string;
            path: string;
            price: number;
            pivot: {
                quantity: number;
            };
        }>
    >([]);
    const fetchOrderProducts = async (id: number) => {
      
    
      
            await axios.get(`http://localhost:8000/getOrderProducts/${id}`, {
                params: {
                    store_id: transaction.store_id
                }
            })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching order products:", error);
                // Optionally handle the error, e.g., set an error state, show a message, etc.
            });
       
    };
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
        localStorage.setItem("page", "TransactionDetails");
        fetchTransaction();
    }, []);
    useEffect(() => {
        // Check if transaction data is loaded and has a valid order_id
        if (transaction && transaction.order_id && transaction.store_id) {
            fetchOrderProducts(transaction.order_id);
        }
    }, [transaction]); 
    useEffect(() => {
        if(products)
        products.forEach((sale: any) => {
            getImageSrc(sale.id).then((imageSrc) => {
                setProductImages((prevImages) => ({
                    ...prevImages,
                    [sale.id]: imageSrc,
                }));
            });
        });
    }, [products]);

    return (
        <>
            <div className="flex flex-col items-center mt-8 intro-y sm:flex-row">
                <h2 className="mr-auto text-lg font-medium">
                    Transaction Details
                </h2>
                <div className="flex w-full mt-4 sm:w-auto sm:mt-0">
                    <Button variant="primary" className="mr-2 shadow-md">
                        Print
                    </Button>
                    <Menu className="ml-auto sm:ml-0">
                        <Menu.Button as={Button} className="px-2 !box">
                            <span className="flex items-center justify-center w-5 h-5">
                                <Lucide icon="Plus" className="w-4 h-4" />
                            </span>
                        </Menu.Button>
                        <Menu.Items className="w-40">
                            <Menu.Item>
                                <Lucide icon="File" className="w-4 h-4 mr-2" />{" "}
                                Export Word
                            </Menu.Item>
                            <Menu.Item>
                                <Lucide icon="File" className="w-4 h-4 mr-2" />{" "}
                                Export to PDF
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
            {/* BEGIN: Transaction Details */}
            <div className="grid grid-cols-11 gap-5 mt-5 intro-y">
                <div className="col-span-12 lg:col-span-4 2xl:col-span-3">
                    <div className="p-5 rounded-md box">
                        <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div className="text-base font-medium truncate">
                                Transaction Details
                            </div>
                        </div>
                        <div className="flex items-center"></div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="Calendar"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            {transaction.created_at}
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="Clock"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Transaction Status:
                            <span className="px-2 ml-1 rounded bg-success/20 text-success">
                                {transaction.status}
                            </span>
                        </div>
                    </div>
                    <div className="p-5 mt-5 rounded-md box">
                        <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div className="text-base font-medium truncate">
                                Buyer Details
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Lucide
                                icon="Clipboard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Name:
                            <a
                                href=""
                                className="ml-1 underline decoration-dotted"
                            >
                                {transaction.user_name}
                            </a>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="Calendar"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Phone Number: {transaction.order.user_phone}
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="MapPin"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Address:{" "}
                            {transaction.order.user_city +
                                " " +
                                transaction.order.user_address}
                        </div>
                    </div>
                    <div className="p-5 mt-5 rounded-md box">
                        <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div className="text-base font-medium truncate">
                                Payment Details
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Lucide
                                icon="Clipboard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Payment Method:
                            <div className="ml-auto">
                                {transaction.type === "paypal"
                                    ? "PayPal payment"
                                    : "Cash On Delivery payment"}
                            </div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="CreditCard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Total Price :
                            <div className="ml-auto">₪{transaction.total_amount}</div>
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="CreditCard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Total Shipping Cost :
                            <div className="ml-auto">₪20</div>
                        </div>

                        <div className="flex items-center pt-5 mt-5 font-medium border-t border-slate-200/60 dark:border-darkmode-400">
                            <Lucide
                                icon="CreditCard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Grand Total:
                            <div className="ml-auto">
                                ₪{transaction.total_amount + 20}
                            </div>
                        </div>
                    </div>
                    <div className="p-5 mt-5 rounded-md box">
                        <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div className="text-base font-medium truncate">
                                Shipping Information
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Lucide
                                icon="Clipboard"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Courier: Mallify360 Delivery
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="Calendar"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            Order Number: {transaction.order_id}
                            <Lucide
                                icon="Copy"
                                className="w-4 h-4 ml-2 text-slate-500"
                            />
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="MapPin"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            {transaction.store.location}
                        </div>
                        <div className="flex items-center mt-3">
                            <Lucide
                                icon="Phone"
                                className="w-4 h-4 mr-2 text-slate-500"
                            />
                            {transaction.store.phone}
                        </div>
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-7 2xl:col-span-8">
                    <div className="p-5 rounded-md box">
                        <div className="flex items-center pb-5 mb-5 border-b border-slate-200/60 dark:border-darkmode-400">
                            <div className="text-base font-medium truncate">
                                Order Details
                            </div>
                           
                        </div>
                        <div className="-mt-3 overflow-auto lg:overflow-visible">
                            <Table striped>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="whitespace-nowrap !py-5">
                                            Product
                                        </Table.Th>
                                        <Table.Th className="text-right whitespace-nowrap">
                                            Unit Price
                                        </Table.Th>
                                        <Table.Th className="text-right whitespace-nowrap">
                                            Qty
                                        </Table.Th>
                                        <Table.Th className="text-right whitespace-nowrap">
                                            Total
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>

                                    {products && products.map(
                                        (faker, fakerKey) => (
                                            <Table.Tr key={fakerKey}>
                                                <Table.Td className="!py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 image-fit zoom-in">
                                                            <Tippy
                                                                as="img"
                                                                alt="Midone - HTML Admin Template"
                                                                className="border-2 border-white rounded-lg shadow-md"
                                                                src={
                                                                    productImages[faker.id]
                                                                }
                                                                content={`Uploaded at `}
                                                            />
                                                        </div>
                                                        <a
                                                            href=""
                                                            className="ml-4 font-medium whitespace-nowrap"
                                                        >
                                                            {
                                                               faker.name
                                                            }
                                                        </a>
                                                    </div>
                                                </Table.Td>
                                                <Table.Td className="text-right">
                                                ₪
                                                    {faker.price
                                                       }
                                                </Table.Td>
                                                <Table.Td className="text-right">
                                                    {faker.pivot.quantity}
                                                </Table.Td>
                                                <Table.Td className="text-right">
                                                ₪
                                                    {faker.price*faker.pivot.quantity}
                                                </Table.Td>
                                            </Table.Tr>
                                        )
                                    )}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            </div>
            {/* END: Transaction Details */}
        </>
    );
}

export default Main;
