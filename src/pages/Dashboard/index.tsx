import _ from "lodash";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import fakerData from "../../utils/faker";
import Button from "../../base-components/Button";
import Pagination from "../../base-components/Pagination";
import { FormInput, FormSelect } from "../../base-components/Form";
import TinySlider, {
    TinySliderElement,
} from "../../base-components/TinySlider";
import Lucide from "../../base-components/Lucide";
import Tippy from "../../base-components/Tippy";
import Litepicker from "../../base-components/Litepicker";
import ReportDonutChart from "../../components/ReportDonutChart";
import ReportLineChart from "../../components/ReportLineChart";
import ReportPieChart from "../../components/ReportPieChart";
import ReportDonutChart1 from "../../components/ReportDonutChart1";
import SimpleLineChart1 from "../../components/SimpleLineChart1";
import { Menu, Tab } from "../../base-components/Headless";
import Table from "../../base-components/Table";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReportDonutChart2 from "../../components/ReportDonutChart2";
import SimpleLineChart4 from "../../components/SimpleLineChart4";
import ReportBarChart1 from "../../components/ReportBarChart1";
import ReportBarChart from "../../components/ReportBarChart";
import UserImage from "../Page1/user.png";

interface Statistics {
    visits: number;
    products: number;
    orders: number;
    sales: number;
}
interface ProductsData {
    newProducts: number;
    totalProducts: number;
    newProductsPercentage: number;
}
interface StoresData {
    newStores: number;
    totalStores: number;
    newStoresPercentage: number;
}

function Main() {
    const navigate = useNavigate();
    const [storeNum, setStoreNum] = useState(0)
    const [plansNum, setPlansNum] = useState(0)
    const [bestStores, setBestStores] = useState<Array<
    {
        id: number;
        name:string;
        logoUrl:string;
        rate_stars: number;

    }>>([])
    const [transactionNum, setTransactionNum] = useState(0)
    const [statistics, setStatistics] = useState<Statistics>({
        visits: 0,
        products: 0,
        orders: 0,
        sales: 0,
    });
    const [bestSeller, setBestSeller] = useState<
        Array<{
            id: number;
            name: string;
            total_products_ordered: number;
        }>
    >([]);
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        }).format(date);
    };

    const [productsData, setProductsData] = useState<ProductsData>({
        newProducts: 0,
        totalProducts: 0,
        newProductsPercentage: 0,
    });
    const [storesData, setStoresData] = useState<StoresData>({
        newStores: 0,
        totalStores: 0,
        newStoresPercentage: 0,
    });
    const [salesReportFilter, setSalesReportFilter] = useState<string>();
    const importantNotesRef = useRef<TinySliderElement>();
    const fetchBestStores = async () => {
        await axios.get("http://localhost:8000/getBestRatedStores").then((response)=>{
            setBestStores(response.data)
        })
    }
    const fetchStatistics = async () => {
        await axios
            .get(
                `http://localhost:8000/getStatistics/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setStatistics(response.data);
            });
    };

    const [activities, setActivities] = useState<
        Array<{
            id: number;
            discription: string;
            created_at: string;
        }>
    >([]);

    const fetchActivities = async () => {
        await axios
            .get(
                `http://localhost:8000/getActivities/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setActivities(response.data);
            });
    };
    const fetchAdminActivities = async () => {
        await axios
            .get(
                `http://localhost:8000/getAdminActivities`
            )
            .then((response) => {
                setActivities(response.data);
            });
    };
    const fetchStoreNum = async () => {
        await axios
            .get(
                `http://localhost:8000/getStoresNumber`
            )
            .then((response) => {
                setStoreNum(response.data);
            });
    };

    const [revenue, setRevnue] = useState(0)


    const fetchRevenue = async () => {
        await axios
            .get(
                `http://localhost:8000/getTotalRevenue`
            )
            .then((response) => {
               setRevnue(response.data);
            });
    };
    const fetchActivePlansNum = async () => {
        await axios
            .get(
                `http://localhost:8000/getActivePlansNumber`
            )
            .then((response) => {
                setPlansNum(response.data);
            });
    };
    const fetchTransactionNum = async () => {
        await axios
            .get(
                `http://localhost:8000/getTransactionNumber`
            )
            .then((response) => {
                setTransactionNum(response.data);
            });
    };
    const [transactions, setTransactions] = useState<
        Array<{
            user_name: string;
            path: string;
            amount: number;
            created_at: string;
            total_amount: number;
            total_amount_for_store:number;
        }>
    >([]);

    const fetchTransactions = async () => {
        await axios
            .get(
                `http://localhost:8000/getTransactions/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setTransactions(response.data);
            });
    };
    const fetchAllTransactions = async () => {
        await axios
            .get(
                `http://localhost:8000/getTransactionWeb`
            )
            .then((response) => {
                setTransactions(response.data);
            });
    };
    const [agesData, setAgesData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [plansData, setPlansData] = useState([]);
    const [genderssData, setGendersData] = useState([]);
    const [adsData, setAdsData] = useState([]);
    const [joinedStores, setJoinedStores] = useState([]);
    const fetchAgesData = async () => {
        await axios
            .get(
                `http://localhost:8000/getAgesData/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAgesData(response.data);
            });
    };
    const fetchPlansData = async () => {
        await axios
            .get(
                `http://localhost:8000/getStoresPlansData`
            )
            .then((response) => {
                setPlansData(response.data);
            });
    };
    const fetchJoinedStoresData = async () => {
        await axios
            .get(
                `http://localhost:8000/getJoinedStores`
            )
            .then((response) => {
                setJoinedStores(response.data);
            });
    };

    const fetchGendersData = async () => {
        await axios
            .get(
                `http://localhost:8000/getUserGenderData/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setGendersData(response.data);
            });
    };
    const fetchTranactionsData = async () => {
        await axios
            .get(
                `http://localhost:8000/getTransactionsTypes`
            )
            .then((response) => {
                setTransactionsData(response.data);
            });
    };
    const [totalAds, setTotalAds] = useState(0);
    const fetchMonthlyAdData = async () => {
        await axios
            .get(
                `http://localhost:8000/getMonthlyAdData/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setAdsData(response.data.monthlyAds);
                setTotalAds(response.data.totalAds);
            });
    };
    const fetchMonthlyAdsData = async () => {
        await axios
            .get(
                `http://localhost:8000/getAdsMonthsData`
            )
            .then((response) => {
                setAdsData(response.data.monthly_counts);
                setTotalAds(response.data.total_count);
            });
    };
    const fetchProductsData = async () => {
        await axios
            .get(
                `http://localhost:8000/getNewProductStatsForStore/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                
                setProductsData(response.data);
            });
    };
    const fetchStoresData = async () => {
        await axios
            .get(
                `http://localhost:8000/getNewStoreStats`
            )
            .then((response) => {
                setStoresData(response.data);
            });
    };

    const fetchBestSeller = async () => {
        await axios
            .get(
                `http://localhost:8000/getBestCustomers/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setBestSeller(response.data);
            });
    };

    const [bestProducts, setBestProducts] = useState<
        Array<{
            id: number;
            name: string;
            quantity: number;
            status: number;
            total_quantity_sold: number;
        }>
    >([]);
    const [bestProductsMall, setBestProductsMall] = useState<
    Array<{
        id: number;
        name: string;
        quantity: number;
        status: number;
        total_quantity_sold: number;
        first_image_url:string;
    }>
>([]);
    const [productImages, setProductImages] = useState<{
        [key: number]: string;
    }>({});
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

    const fetchBestProducts = async () => {
        await axios
            .get(
                `http://localhost:8000/getTopSellingProducts/${localStorage.getItem(
                    "store_id"
                )}`
            )
            .then((response) => {
                setBestProducts(response.data);
            });
    };

    const fetchBestProductsMall = async () => {
        await axios
            .get(
                `http://localhost:8000/getTopSellingProductsMall`
            )
            .then((response) => {
                setBestProductsMall(response.data);
            });
    };
    function calculatePercentages(counts: number[]): number[] {
        const total = counts.reduce((acc, count) => acc + count, 0);
        if (total === 0) {
            return counts.map(() => 0);
        }
        return counts.map((count) => (count / total) * 100);
    }
    const [percentages, setPercentages] = useState<Array<number>>([]);
    const [percentages1, setPercentages1] = useState<Array<number>>([]);

    useEffect(() => {
        localStorage.setItem("page","Dashboard")
        if(localStorage.getItem("role") === "admin")
        {
            fetchStoreNum()
            fetchTransactionNum()
            fetchActivePlansNum()
            fetchRevenue()
            fetchPlansData()
            fetchTranactionsData()
            fetchJoinedStoresData()
            fetchStoresData()
            fetchMonthlyAdsData()
            fetchAdminActivities()
            fetchBestStores()
            fetchBestProductsMall()
            fetchAllTransactions()
        }
        else{
        fetchStatistics();
        fetchAgesData();
        fetchGendersData();
        fetchMonthlyAdData();
        fetchProductsData();
        fetchBestSeller();
        fetchBestProducts();
        fetchActivities();
        fetchTransactions(); 
       
        }
       
    }, []);
    useEffect(() => {
        setPercentages(calculatePercentages(agesData));
    }, [agesData]);
    useEffect(() => {
        setPercentages(calculatePercentages(plansData));
    }, [plansData]);

    useEffect(() => {
        setPercentages1(calculatePercentages(genderssData));
    }, [genderssData]);
    useEffect(() => {
        setPercentages1(calculatePercentages(transactionsData));
    }, [transactionsData]);

    useEffect(() => {
        bestProducts.forEach((sale: any) => {
            getImageSrc(sale.id).then((imageSrc) => {
                setProductImages((prevImages) => ({
                    ...prevImages,
                    [sale.id]: imageSrc,
                }));
            });
        });
    }, [bestProducts]);
    const [showLoadingIcon, setShowLoadingIcon] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            // Toggle the loading icon visibility
            setShowLoadingIcon(prev => !prev);
        }, 3000);

        // Clear the interval when the component is unmounted
        return () => clearInterval(interval);
    }, []);

    return localStorage.getItem("role") === "owner" ? (
<div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 2xl:col-span-9">
                <div className="grid grid-cols-12 gap-6">
                    {/* BEGIN: General Report */}
                    <div className="col-span-12 mt-8">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                General Report
                            </h2>
                            <a
                                href=""
                                className="flex items-center ml-auto text-primary"
                            >
                                <Lucide
                                    icon="RefreshCcw"
                                    className="w-4 h-4 mr-3"
                                />{" "}
                                Reload Data
                            </a>
                        </div>
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="ShoppingCart"
                                                className="w-[28px] h-[28px] text-primary"
                                            />
                                            <div className="ml-auto">
                                                
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {statistics.sales}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Item Sales
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="CreditCard"
                                                className="w-[28px] h-[28px] text-pending"
                                            />
                                            <div className="ml-auto">
                                               
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {statistics.orders}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Orders
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="Monitor"
                                                className="w-[28px] h-[28px] text-warning"
                                            />
                                            <div className="ml-auto">
                                                
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {statistics.products}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Total Products
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="User"
                                                className="w-[28px] h-[28px] text-success"
                                            />
                                            <div className="ml-auto">
                                                
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {statistics.visits}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Visitors
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: Sales Report */}
                    <div className="col-span-12 mt-8 lg:col-span-6">
                        <div className="items-center block h-10 intro-y sm:flex">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Sales Report
                            </h2>
                        </div>
                        <div className="p-5 mt-12 intro-y box sm:mt-5">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex">
                                    <div>
                                        <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                                            {localStorage.getItem("month")}₪
                                        </div>
                                        <div className="mt-0.5 text-slate-500">
                                            This Month
                                        </div>
                                    </div>
                                    <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                                </div>
                                <Menu className="mt-5 md:ml-auto md:mt-0">
                                    <Menu.Button
                                        as={Button}
                                        variant="outline-secondary"
                                        className="font-normal"
                                    >
                                        Filter by Category
                                        <Lucide
                                            icon="ChevronDown"
                                            className="w-4 h-4 ml-2"
                                        />
                                    </Menu.Button>
                                    <Menu.Items className="w-40 h-32 overflow-y-auto">
                                        <Menu.Item>PC & Laptop</Menu.Item>
                                        <Menu.Item>Smartphone</Menu.Item>
                                        <Menu.Item>Electronic</Menu.Item>
                                        <Menu.Item>Photography</Menu.Item>
                                        <Menu.Item>Sport</Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                            <div
                                className={clsx([
                                    "relative",
                                    "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                                    "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                                ])}
                            >
                                <ReportLineChart
                                    height={275}
                                    className="mt-6 -mb-6"
                                />
                            </div>
                        </div>
                    </div>
                    {/* END: Sales Report */}
                    {/* BEGIN: Weekly Top Seller */}
                    <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-3">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Sellers Ages
                            </h2>
                        </div>
                        <div className="p-5 mt-5 intro-y box">
                            <div className="mt-3">
                                <ReportPieChart height={213} info={agesData} />
                            </div>
                            <div className="mx-auto mt-8 w-52 sm:w-auto">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                                    <span className="truncate">
                                        17 - 30 Years old
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[0].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                                    <span className="truncate">
                                        31 - 50 Years old
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[1].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                                    <span className="truncate">
                                        &gt;= 50 Years old
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[2].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: Weekly Top Seller */}
                    {/* BEGIN: Sales Report */}
                    <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-3">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Sellers Gender
                            </h2>
                        </div>
                        <div className="p-5 mt-5 intro-y box">
                            <div className="mt-3">
                                <ReportDonutChart
                                    height={250}
                                    info={genderssData}
                                />
                            </div>
                            <div className="mx-auto mt-8 w-52 sm:w-auto">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                                    <span className="truncate">Male</span>
                                    <span className="ml-auto font-medium">
                                        {percentages1 && percentages1.length > 0
                                            ? `${percentages1[0].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                                    <span className="truncate">Female</span>
                                    <span className="ml-auto font-medium">
                                        {percentages1 && percentages1.length > 0
                                            ? `${percentages1[1].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: Sales Report */}

                    {/* BEGIN: General Report */}
                    <div className="grid grid-cols-12 col-span-12 gap-6 mt-8">
                        
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="p-5 box zoom-in">
                                <div className="flex items-center">
                                    <div className="flex-none w-2/4">
                                        <div className="text-xs font-medium truncate">
                                            New Products
                                        </div>
                                        <div className="mt-1 text-slate-500">
                                            {productsData.totalProducts}{" "}
                                            Products
                                        </div>
                                    </div>
                                    <div className="relative flex-none ml-auto">
                                        <ReportDonutChart2
                                           
                                            width={90}
                                            height={90}
                                        />
                                        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full font-medium">
                                            {productsData.newProductsPercentage}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="p-5 box zoom-in">
                                <div className="flex">
                                    <div className="mr-3 text-lg font-medium truncate">
                                        Ads
                                    </div>
                                    <div className="flex items-center px-2 py-1 ml-auto text-xs truncate rounded-full cursor-pointer bg-slate-100 dark:bg-darkmode-400 text-slate-500">
                                        {totalAds} Ads
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <SimpleLineChart1
                                        info={adsData}
                                        height={58}
                                        className="-ml-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: monthly Top Products */}
                    <div className="col-span-12 mt-6">
                        <div className="items-center block h-10 intro-y sm:flex">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Monthly Top Products
                            </h2>
                        </div>
                        <div className="mt-8 overflow-auto intro-y lg:overflow-visible sm:mt-0">
                            <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="border-b-0 whitespace-nowrap">
                                            IMAGES
                                        </Table.Th>
                                        <Table.Th className="border-b-0 whitespace-nowrap">
                                            PRODUCT NAME
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            STOCK
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            STATUS
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            ACTIONS
                                        </Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {bestProducts.map((faker, fakerKey) => (
                                        <Table.Tr
                                            key={fakerKey}
                                            className="intro-x"
                                        >
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <div className="flex">
                                                    <div className="w-10 h-10 image-fit zoom-in">
                                                        <Tippy
                                                            as="img"
                                                            alt="Midone Tailwind HTML Admin Template"
                                                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                            src={
                                                                productImages[
                                                                    faker.id
                                                                ] || ""
                                                            }
                                                            content={`Uploaded at`}
                                                        />
                                                    </div>
                                                    {/* <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                                                            <Tippy
                                                                as="img"
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                                src={
                                                                    ""
                                                                }
                                                                content={`Uploaded at `}
                                                            />
                                                        </div>
                                                        <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                                                            <Tippy
                                                                as="img"
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                                src={
                                                                    ""
                                                                }
                                                                content={`Uploaded at`}
                                                            />
                                                        </div> */}
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <a
                                                    href=""
                                                    className="font-medium whitespace-nowrap"
                                                >
                                                    {faker.name}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {faker.total_quantity_sold}{" "}
                                                    sold
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {faker.quantity}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <div
                                                    className={clsx([
                                                        "flex items-center justify-center",
                                                        {
                                                            "text-success":
                                                                faker.status,
                                                        },
                                                        {
                                                            "text-danger":
                                                                !faker.status,
                                                        },
                                                    ])}
                                                >
                                                    <Lucide
                                                        icon="CheckSquare"
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                    {faker.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </div>
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
                                                        href=""
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
                    </div>
                    {/* END: Weekly Top Products */}
                </div>
            </div>
            <div className="col-span-12 2xl:col-span-3">
                <div className="pb-10 -mb-10 2xl:border-l">
                    <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
                        {/* BEGIN: Transactions */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
                            <div className="flex items-center h-10 intro-x">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                    Transactions
                                </h2>
                            </div>
                            <div className="mt-5">
                                {transactions
                                    .slice(0, 4)
                                    .map((faker, fakerKey) => (
                                        <div key={fakerKey} className="intro-x">
                                            <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                                                <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                                                    <img
                                                        alt="Midone Tailwind HTML Admin Template"
                                                        src={UserImage}
                                                    />
                                                </div>
                                                <div className="ml-4 mr-auto">
                                                    <div className="font-medium">
                                                        {faker.user_name}
                                                    </div>
                                                    <div className="text-slate-500 text-xs mt-0.5">
                                                        {formatDate(
                                                            faker.created_at
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={"text-success"}>
                                                    {"+"}
                                                    {
                                                        faker.total_amount_for_store
                                                    }
                                                    ₪
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                <a
                                    onClick={()=> navigate("/transactions", {state: {data: localStorage.getItem("store_id")}})}
                                    className="block cursor-pointer w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                                >
                                    View More
                                </a>
                            </div>
                        </div>
                        {/* END: Transactions */}
                        {/* BEGIN: Recent Activities */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                            <div className="flex items-center h-10 intro-x">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                    Recent Activities
                                </h2>
                                <a
                                    href=""
                                    className="ml-auto truncate text-primary"
                                >
                                    Show More
                                </a>
                            </div>
                            <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                                {activities
                                    .slice(0, 4)
                                    .map((activity, activityKey) => (
                                        <div
                                            className="relative flex items-center mb-3 intro-x"
                                            key={activityKey}
                                        >
                                            <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                                                <div className="flex items-center">
                                                    <div className="ml-auto text-xs text-slate-500">
                                                        {formatDate(
                                                            activity.created_at
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-1 text-black-500">
                                                    {activity.discription}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {/* END: Recent Activities */}
                        {/* BEGIN: monthly Best Sellers */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                            <div className="flex items-center h-10 intro-y">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                    Monthly Best Sellers
                                </h2>
                            </div>
                            <div className="mt-5">
                                {bestSeller.map((faker, fakerKey) => (
                                    <div key={fakerKey} className="intro-y">
                                        <div className="flex items-center px-4 py-4 mb-3 box zoom-in">
                                            <div className="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
                                                <img
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    src={UserImage}
                                                />
                                            </div>
                                            <div className="ml-4 mr-auto">
                                                <div className="font-medium">
                                                    {faker.name}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-0.5"></div>
                                            </div>
                                            <div className="px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-success">
                                                {faker.total_products_ordered}{" "}
                                                Sales
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* END: monthly Best Sellers */}
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="grid grid-cols-12 gap-6">
            <div className="col-span-12 2xl:col-span-9">
                <div className="grid grid-cols-12 gap-6">
                    {/* BEGIN: General Report */}
                    <div className="col-span-12 mt-8">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                General Report
                            </h2>
                            <a
                                href=""
                                className="flex items-center ml-auto text-primary"
                            >
                                <Lucide
                                    icon="RefreshCcw"
                                    className="w-4 h-4 mr-3"
                                />{" "}
                                Reload Data
                            </a>
                        </div>
                        <div className="grid grid-cols-12 gap-6 mt-5">
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="ShoppingBag"
                                                className="w-[28px] h-[28px] text-primary"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    as="div"
                                                    className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                                    content="33% Higher than last month"
                                                >
                                                    33%
                                                    <Lucide
                                                        icon="ChevronUp"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {storeNum}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Number Of Stores
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="ArrowLeftRight"
                                                className="w-[28px] h-[28px] text-pending"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    as="div"
                                                    className="cursor-pointer bg-danger py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                                    content="2% Lower than last month"
                                                >
                                                    2%
                                                    <Lucide
                                                        icon="ChevronDown"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {transactionNum}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Number Of Transactions
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="DollarSign"
                                                className="w-[28px] h-[28px] text-warning"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    as="div"
                                                    className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                                    content="12% Higher than last month"
                                                >
                                                    12%{" "}
                                                    <Lucide
                                                        icon="ChevronUp"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {revenue}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Total Revenue
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                                <div
                                    className={clsx([
                                        "relative zoom-in",
                                        "before:content-[''] before:w-[90%] before:shadow-[0px_3px_20px_#0000000b] before:bg-slate-50 before:h-full before:mt-3 before:absolute before:rounded-md before:mx-auto before:inset-x-0 before:dark:bg-darkmode-400/70",
                                    ])}
                                >
                                    <div className="p-5 box">
                                        <div className="flex">
                                            <Lucide
                                                icon="Briefcase"
                                                className="w-[28px] h-[28px] text-success"
                                            />
                                            <div className="ml-auto">
                                                <Tippy
                                                    as="div"
                                                    className="cursor-pointer bg-success py-[3px] flex rounded-full text-white text-xs pl-2 pr-1 items-center font-medium"
                                                    content="22% Higher than last month"
                                                >
                                                    22%{" "}
                                                    <Lucide
                                                        icon="ChevronUp"
                                                        className="w-4 h-4 ml-0.5"
                                                    />
                                                </Tippy>
                                            </div>
                                        </div>
                                        <div className="mt-6 text-3xl font-medium leading-8">
                                            {plansNum}
                                        </div>
                                        <div className="mt-1 text-base text-slate-500">
                                            Active Plans
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: Sales Report */}
                    <div className="col-span-12 mt-8 lg:col-span-6">
                        <div className="items-center block h-10 intro-y sm:flex">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Sales Report
                            </h2>
                        </div>
                        <div className="p-5 mt-12 intro-y box sm:mt-5">
                            <div className="flex flex-col md:flex-row md:items-center">
                                <div className="flex">
                                    <div>
                                        <div className="text-lg font-medium text-primary dark:text-slate-300 xl:text-xl">
                                            {localStorage.getItem("month")}₪
                                        </div>
                                        <div className="mt-0.5 text-slate-500">
                                            This Month
                                        </div>
                                    </div>
                                    <div className="w-px h-12 mx-4 border border-r border-dashed border-slate-200 dark:border-darkmode-300 xl:mx-5"></div>
                                </div>
                                <Menu className="mt-5 md:ml-auto md:mt-0">
                                    <Menu.Button
                                        as={Button}
                                        variant="outline-secondary"
                                        className="font-normal"
                                    >
                                        Filter by Category
                                        <Lucide
                                            icon="ChevronDown"
                                            className="w-4 h-4 ml-2"
                                        />
                                    </Menu.Button>
                                    <Menu.Items className="w-40 h-32 overflow-y-auto">
                                        <Menu.Item>PC & Laptop</Menu.Item>
                                        <Menu.Item>Smartphone</Menu.Item>
                                        <Menu.Item>Electronic</Menu.Item>
                                        <Menu.Item>Photography</Menu.Item>
                                        <Menu.Item>Sport</Menu.Item>
                                    </Menu.Items>
                                </Menu>
                            </div>
                            <div
                                className={clsx([
                                    "relative",
                                    "before:content-[''] before:block before:absolute before:w-16 before:left-0 before:top-0 before:bottom-0 before:ml-10 before:mb-7 before:bg-gradient-to-r before:from-white before:via-white/80 before:to-transparent before:dark:from-darkmode-600",
                                    "after:content-[''] after:block after:absolute after:w-16 after:right-0 after:top-0 after:bottom-0 after:mb-7 after:bg-gradient-to-l after:from-white after:via-white/80 after:to-transparent after:dark:from-darkmode-600",
                                ])}
                            >
                                <ReportLineChart
                                    height={275}
                                    className="mt-6 -mb-6"
                                />
                            </div>
                        </div>
                    </div>
                    {/* END: Sales Report */}
                    {/* BEGIN: Weekly Top Seller */}
                    <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-3">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Stores Plans
                            </h2>
                        </div>
                        <div className="p-5 mt-5 intro-y box">
                            <div className="mt-3">
                                <ReportPieChart height={213} info={plansData} />
                            </div>
                            <div className="mx-auto mt-8 w-52 sm:w-auto">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                                    <span className="truncate">
                                        Basic
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[0].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                                    <span className="truncate">
                                        Business
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[1].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-warning"></div>
                                    <span className="truncate">
                                        Enterprise
                                    </span>
                                    <span className="ml-auto font-medium">
                                        {percentages && percentages.length > 0
                                            ? `${percentages[2].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: Weekly Top Seller */}
                    {/* BEGIN: Sales Report */}
                    <div className="col-span-12 mt-8 sm:col-span-6 lg:col-span-3">
                        <div className="flex items-center h-10 intro-y">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Transactions Types
                            </h2>
                        </div>
                        <div className="p-5 mt-5 intro-y box">
                            <div className="mt-3">
                                <ReportDonutChart
                                    height={250}
                                    info={transactionsData}
                                />
                            </div>
                            <div className="mx-auto mt-8 w-52 sm:w-auto">
                                <div className="flex items-center">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-primary"></div>
                                    <span className="truncate">Paypal</span>
                                    <span className="ml-auto font-medium">
                                        {percentages1 && percentages1.length > 0
                                            ? `${percentages1[0].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="w-2 h-2 mr-3 rounded-full bg-pending"></div>
                                    <span className="truncate">COD</span>
                                    <span className="ml-auto font-medium">
                                        {percentages1 && percentages1.length > 0
                                            ? `${percentages1[1].toFixed(2)}%`
                                            : "Loading..."}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: Sales Report */}

                    {/* BEGIN: General Report */}
                    <div className="grid grid-cols-12 col-span-12 gap-6 mt-8">
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="p-5 box zoom-in">
                                <div className="flex">
                                    <div className="mr-3 text-sm font-medium truncate">
                                        Stores Joined 
                                    </div>
                                    <div className="flex items-center px-2 py-1 ml-auto text-xs truncate rounded-full cursor-pointer bg-slate-100 dark:bg-darkmode-400 text-slate-500">
                                        {storeNum} Stores
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <SimpleLineChart1
                                        info={joinedStores}
                                        height={58}
                                        className="-ml-1"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="p-5 box zoom-in">
                                <div className="flex items-center">
                                    <div className="flex-none w-2/4">
                                        <div className="text-xs font-medium truncate">
                                            New Stores
                                        </div>
                                        <div className="mt-1 text-slate-500">
                                            {storesData.newStores}{" "}
                                            Stores
                                        </div>
                                    </div>
                                    <div className="relative flex-none ml-auto">
                                        <ReportDonutChart1
                                            
                                            width={90}
                                            height={90}
                                        />
                                        <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full font-medium">
                                            {storesData.newStoresPercentage}
                                            %
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 sm:col-span-6 2xl:col-span-3 intro-y">
                            <div className="p-5 box zoom-in">
                                <div className="flex">
                                    <div className="mr-3 text-lg font-medium truncate">
                                        Ads
                                    </div>
                                    <div className="flex items-center px-2 py-1 ml-auto text-xs truncate rounded-full cursor-pointer bg-slate-100 dark:bg-darkmode-400 text-slate-500">
                                        {totalAds} Ads
                                    </div>
                                </div>
                                <div className="mt-1">
                                    <SimpleLineChart1
                                        info={adsData}
                                        height={58}
                                        className="-ml-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* END: General Report */}
                    {/* BEGIN: monthly Top Products */}
                    <div className="col-span-12 mt-6">
                        <div className="items-center block h-10 intro-y sm:flex">
                            <h2 className="mr-5 text-lg font-medium truncate">
                                Monthly Top Products
                            </h2>
                        </div>
                        <div className="mt-8 overflow-auto intro-y lg:overflow-visible sm:mt-0">
                            <Table className="border-spacing-y-[10px] border-separate sm:mt-2">
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th className="border-b-0 whitespace-nowrap">
                                            IMAGES
                                        </Table.Th>
                                        <Table.Th className="border-b-0 whitespace-nowrap">
                                            PRODUCT NAME
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            STOCK
                                        </Table.Th>
                                        <Table.Th className="text-center border-b-0 whitespace-nowrap">
                                            STATUS
                                        </Table.Th>
                                       
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {bestProductsMall.map((faker, fakerKey) => (
                                        <Table.Tr
                                            key={fakerKey}
                                            className="intro-x"
                                        >
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <div className="flex">
                                                    <div className="w-10 h-10 image-fit zoom-in">
                                                        <Tippy
                                                            as="img"
                                                            alt="Midone Tailwind HTML Admin Template"
                                                            className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                            src={
                                                                `http://localhost:8000/storage/${faker.first_image_url}`
                                                            }
                                                            content={`Uploaded at`}
                                                        />
                                                    </div>
                                                    {/* <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                                                            <Tippy
                                                                as="img"
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                                src={
                                                                    ""
                                                                }
                                                                content={`Uploaded at `}
                                                            />
                                                        </div>
                                                        <div className="w-10 h-10 -ml-5 image-fit zoom-in">
                                                            <Tippy
                                                                as="img"
                                                                alt="Midone Tailwind HTML Admin Template"
                                                                className="rounded-full shadow-[0px_0px_0px_2px_#fff,_1px_1px_5px_rgba(0,0,0,0.32)] dark:shadow-[0px_0px_0px_2px_#3f4865,_1px_1px_5px_rgba(0,0,0,0.32)]"
                                                                src={
                                                                    ""
                                                                }
                                                                content={`Uploaded at`}
                                                            />
                                                        </div> */}
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <a
                                                    href=""
                                                    className="font-medium whitespace-nowrap"
                                                >
                                                    {faker.name}
                                                </a>
                                                <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                                                    {faker.total_quantity_sold}{" "}
                                                    sold
                                                </div>
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md text-center bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                {faker.quantity}
                                            </Table.Td>
                                            <Table.Td className="first:rounded-l-md last:rounded-r-md w-40 bg-white border-b-0 dark:bg-darkmode-600 shadow-[20px_3px_20px_#0000000b]">
                                                <div
                                                    className={clsx([
                                                        "flex items-center justify-center",
                                                        {
                                                            "text-success":
                                                                faker.status,
                                                        },
                                                        {
                                                            "text-danger":
                                                                !faker.status,
                                                        },
                                                    ])}
                                                >
                                                    <Lucide
                                                        icon="CheckSquare"
                                                        className="w-4 h-4 mr-2"
                                                    />
                                                    {faker.status
                                                        ? "Active"
                                                        : "Inactive"}
                                                </div>
                                            </Table.Td>
                                           
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    </div>
                    {/* END: Weekly Top Products */}
                </div>
            </div>
            <div className="col-span-12 2xl:col-span-3">
                <div className="pb-10 -mb-10 2xl:border-l">
                    <div className="grid grid-cols-12 2xl:pl-6 gap-x-6 2xl:gap-x-0 gap-y-6">
                        {/* BEGIN: Transactions */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12 2xl:mt-8">
                            <div className="flex items-center h-10 intro-x">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                    Transactions
                                </h2>
                            </div>
                            <div className="mt-5">
                                {transactions
                                    .slice(0, 4)
                                    .map((faker, fakerKey) => (
                                        <div key={fakerKey} className="intro-x">
                                            <div className="flex items-center px-5 py-3 mb-3 box zoom-in">
                                                <div className="flex-none w-10 h-10 overflow-hidden rounded-full image-fit">
                                                    <img
                                                        alt="Midone Tailwind HTML Admin Template"
                                                         src={UserImage}
                                                    />
                                                </div>
                                                <div className="ml-4 mr-auto">
                                                    <div className="font-medium">
                                                        {faker.user_name}
                                                    </div>
                                                    <div className="text-slate-500 text-xs mt-0.5">
                                                        {formatDate(
                                                            faker.created_at
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={"text-success"}>
                                                    {"+"}
                                                    {
                                                        faker.total_amount
                                                    }
                                                    ₪
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                <a
                                    href="/transactions"
                                    className="block w-full py-3 text-center border border-dotted rounded-md intro-x border-slate-400 dark:border-darkmode-300 text-slate-500"
                                >
                                    View More
                                </a>
                            </div>
                        </div>
                        {/* END: Transactions */}
                        {/* BEGIN: Recent Activities */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                            <div className="flex items-center h-10 intro-x">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                    Recent Activities
                                </h2>
                                <a
                                    href=""
                                    className="ml-auto truncate text-primary"
                                >
                                    Show More
                                </a>
                            </div>
                            <div className="mt-5 relative before:block before:absolute before:w-px before:h-[85%] before:bg-slate-200 before:dark:bg-darkmode-400 before:ml-5 before:mt-5">
                                {activities
                                    .slice(0, 4)
                                    .map((activity, activityKey) => (
                                        <div
                                            className="relative flex items-center mb-3 intro-x"
                                            key={activityKey}
                                        >
                                            <div className="flex-1 px-5 py-3 ml-4 box zoom-in">
                                                <div className="flex items-center">
                                                    <div className="ml-auto text-xs text-slate-500">
                                                        {formatDate(
                                                            activity.created_at
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-1 text-black-500">
                                                    {activity.discription}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                        {/* END: Recent Activities */}
                        {/* BEGIN: monthly Best Sellers */}
                        <div className="col-span-12 mt-3 md:col-span-6 xl:col-span-4 2xl:col-span-12">
                            <div className="flex items-center h-10 intro-y">
                                <h2 className="mr-5 text-lg font-medium truncate">
                                     Best Rated Stores 
                                </h2>
                            </div>
                            <div className="mt-5">
                                {bestStores.map((faker, fakerKey) => (
                                    <div key={fakerKey} className="intro-y">
                                        <div className="flex items-center px-4 py-4 mb-3 box zoom-in">
                                            <div className="flex-none w-10 h-10 overflow-hidden rounded-md image-fit">
                                                <img
                                                    alt="Midone Tailwind HTML Admin Template"
                                                    src={`http://localhost:8000/storage/${faker.logoUrl}`}
                                                />
                                            </div>
                                            <div className="ml-4 mr-auto">
                                                <div className="font-medium">
                                                    {faker.name}
                                                </div>
                                                <div className="text-slate-500 text-xs mt-0.5"></div>
                                            </div>
                                            <div className="px-2 py-1 text-xs font-medium text-white rounded-full cursor-pointer bg-success">
                                                {faker.rate_stars}{" "}
                                                Stars
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* END: monthly Best Sellers */}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
