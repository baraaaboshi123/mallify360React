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
interface StoresData {
  newStores: number;
  totalStores: number;
  newStoresPercentage: number;
}

function Main(props: MainProps) {
  const [loading, setLoading] = useState(true);

  const [storesData, setStoresData] = useState<StoresData>({
    newStores: 0,
    totalStores: 0,
    newStoresPercentage: 0,
});
const fetchStoresData =  () => {
   axios
      .get(
          `http://localhost:8000/getNewStoreStats`
      )
      .then((response) => {
          setStoresData(response.data);
          setLoading(false);
          
      });
};
useEffect(()=>{
  fetchStoresData()
},[])
useEffect(()=>{
  
},[storesData])
  const colorScheme = useAppSelector(selectColorScheme);
  const darkMode = useAppSelector(selectDarkMode);

 
  const chartColors = () => [
    getColor("primary", 0.9),
    getColor("pending", 0.9),
    
  ];
  const data: ChartData = useMemo( () => {
    return {
      labels: ["Yellow", "Dark"],
      datasets: [
        {
          data:  [storesData.newStores,storesData.totalStores-storesData.newStores],
          backgroundColor: colorScheme ? chartColors() : "",
          hoverBackgroundColor: colorScheme ? chartColors() : "",
          borderWidth: 2,
          borderColor: darkMode ? getColor("darkmode.700") : getColor("white"),
        },
      ],
    };
  }, [colorScheme, darkMode,storesData]);

  const options: ChartOptions = useMemo(() => {
    return {
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      cutout: "83%",
    };
  }, [colorScheme, darkMode]);

  return (
    <> 
    {loading ? (
      <div>
        <LoadingIcon icon="three-dots" />
      </div> // You can replace this with a spinner or any loading indicator
  ) : (
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
