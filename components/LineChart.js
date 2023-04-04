import { Line } from 'react-chartjs-2';
// import { useMediaQuery } from '@material-ui/core';
import useMediaQuery from '@mui/material/useMediaQuery';
import 'chartjs-adapter-moment';


import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale,
  } from 'chart.js';
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    TimeScale
  );

const LineChart = (props) => {

const data = {
  labels: props.labels,
  datasets: [
    {
      label: 'My First Dataset',
      data: props.data,
      fill: true,
    //   borderColor: 'rgb(75, 192, 192)',
      borderColor: 'hex(#0D2636 )',

      tension: 0.1,
    },
  ],
};

const options = {
  responsive: true,
  scales: {
    x: {
    // type: 'time',
    // time: {
    //     unit: 'day',
    //   },
      ticks: {
        font: {
          size: 16, // default font size for larger screens
        },
      },
    },
    y: {
      ticks: {
        font: {
          size: 16, // default font size for larger screens
          beginAtZero: true,
        },
      },
    },
  },
};

// media query for smaller screens
const smallScreenOptions = {
  responsive: true,

  scales: {
    x: {
      ticks: {
        font: {
          size: 10, // smaller font size for smaller screens
        },
      },
          type: 'time',
        //   time: {
        //     unit: 'day',
        //   },
    },
    y: {
      ticks: {
        beginAtZero: true,
        font: {
          size: 10, // smaller font size for smaller screens
        },
      },
    },
  },
};


const isSmallScreen = useMediaQuery('(max-width: 580px)'); // adjust breakpoint as needed
const chartOptions = isSmallScreen ? smallScreenOptions : options;

return <Line data={data} options={chartOptions} />;

}
;
  

export default LineChart;