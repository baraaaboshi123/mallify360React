import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import LoadingIcon from "../../base-components/LoadingIcon";

interface MainProps extends React.ComponentPropsWithoutRef<"canvas"> {
  width: number;
  height: number;
  
}
interface ProductsData {
  newProducts: number;
  totalProducts: number;
  newProductsPercentage: number;
}

function Main(props: MainProps) {
  const [loading, setLoading] = useState(true);
  const [productsData, setProductsData] = useState<ProductsData>({
    newProducts: 0,
    totalProducts: 0,
    newProductsPercentage: 0,
});
  const fetchProductsData = async () => {
    await axios
        .get(
            `http://localhost:8000/getNewProductStatsForStore/${localStorage.getItem(
                "store_id"
            )}`
        )
        .then((response) => {
            
            setProductsData(response.data);
            setLoading(false)
        });
};
useEffect(()=>{
  fetchProductsData()
},[])
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

  const chartData = [15, 10, 65];
  const chartColors = () => [
    getColor("pending", 0.9),
    getColor("warning", 0.9),
    getColor("primary", 0.9),
  ];
  const data: ChartData = useMemo(() => {
    return {
      labels: ["Yellow", "Dark"],
      datasets: [
        {
          data: [productsData.newProducts,productsData.totalProducts-productsData.newProducts],
          backgroundColor: colorScheme ? chartColors() : "",
          hoverBackgroundColor: colorScheme ? chartColors() : "",
          borderWidth: 5,
          borderColor: darkMode
            ? getColor("darkmode.700")
            : getColor("slate.200"),
        },
      ],
    };
  }, [colorScheme, darkMode, productsData]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "82%",
    };
  }, [colorScheme, darkMode]);

  return (
    <>
    {loading ? (
      <div>
        <LoadingIcon icon="three-dots"/>
      </div>
    )
  :(
    <Chart
      type="doughnut"
      width={props.width}
      height={props.height}
      data={data}
      options={options}
      className={props.className}
    />
  )
  }
    
    </>
    
  );
}

Main.defaultProps = {
  width: "auto",
  height: "auto",
  className: "",
};

export default Main;
