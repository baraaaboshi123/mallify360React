import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
    width: number;
    height: number;
}

function Main(props: MainProps) {
    const colorScheme = useAppSelector(selectColorScheme);
    const [salesData, setSalesData] = useState([
      
    ]);
    const [salesData1, setSalesData1] = useState([
      
    ]);
    const [currentMonthSales, setCurrentMonthSales] = useState(0)
    const fetchSalesData = async () => {
        
            await axios.get(
                `http://localhost:8000/getSalesData/${localStorage.getItem(
                    "store_id"
                )}`
            ).then((response) => {
              setSalesData(response.data.monthlySales)
              localStorage.setItem("month", response.data.currentMonthSales)
            });
        
    };
    const fetchSalesData1 = async () => {
        
        await axios.get(
            `http://localhost:8000/getStoresSales`
        ).then((response) => {
          setSalesData(response.data.monthly_sales)
          localStorage.setItem("month", response.data.current_month_sales)
        });
    
};
    useEffect(()=>{
        if(localStorage.getItem("role")==="admin"){
            fetchSalesData1()
        }
        else
      fetchSalesData()
    },[])
    const darkMode = useAppSelector(selectDarkMode);

    const data: ChartData = useMemo(() => {
        return {
            labels: [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ],
            datasets: [
                {
                    label: "# of Votes",
                    data: salesData,
                    borderWidth: 2,
                    borderColor: colorScheme ? getColor("primary", 0.8) : "",
                    backgroundColor: "transparent",
                    pointBorderColor: "transparent",
                    tension: 0.4,
                },
                {
                    label: "# of Votes",
                    data: salesData,
                    borderWidth: 2,
                    borderDash: [2, 2],
                    borderColor: darkMode
                        ? getColor("slate.400", 0.6)
                        : getColor("slate.400"),
                    backgroundColor: "transparent",
                    pointBorderColor: "transparent",
                    tension: 0.4,
                },
            ],
        };
    }, [colorScheme, darkMode,salesData]);

    const options: ChartOptions = useMemo(() => {
        return {
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false,
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12,
                        },
                        color: getColor("slate.500", 0.8),
                    },
                    grid: {
                        display: false,
                        drawBorder: false,
                    },
                },
                y: {
                    ticks: {
                        font: {
                            size: 12,
                        },
                        color: getColor("slate.500", 0.8),
                        callback: function (value) {
                            return "₪" + value;
                        },
                    },
                    grid: {
                        color: darkMode
                            ? getColor("slate.500", 0.3)
                            : getColor("slate.300"),
                        borderDash: [2, 2],
                        drawBorder: false,
                    },
                },
            },
        };
    }, [colorScheme, darkMode]);

    return (
        <Chart
            type="line"
            width={props.width}
            height={props.height}
            data={data}
            options={options}
            className={props.className}
        />
    );
}

Main.defaultProps = {
    width: "auto",
    height: "auto",
    className: "",
};

export default Main;
