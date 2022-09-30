import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const options = {
  responsive: true,
  scales: {
    color:"#ede2e1",
    xAxis: {
      ticks: {
        color:"#ede2e1",
        font: {
          family: "Proxima Nova Ligth",
          size: "12vw"
        }
      }
    },
    yAxis: {
      ticks: {
        color:"#ede2e1",
        font: {
          family: "Proxima Nova Ligth",
          size: "12vw"
        }
      }
    }
  }
  ,
  plugins: {

    legend: {
      labels: {
        // This more specific font property overrides the global property
        font: {
          family: "Proxima Nova Ligth",
          size: "12vw"
        },
        color:"#ede2e1"     
      }
    }
  }
};

export default function LineChart(props) {
  /* const labels = props.data.labels
  const scores = props.data.scores */
  const scores = props.scores
  const labels = props.labels
  const scoresF = props.scoresF
  const data = {
    datasets: [
      {
        label: props.legendData,
        data: scores,
        tension: 0.3,
        borderColor: "rgb(75, 192, 192)",
        pointRadius: 2,
        pointBackgroundColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.3)",
        fill: false,
        borderWidth: 0
      },
      {
        label: props.legendFunction,
        data: scoresF,
        tension: 0.3,
        borderColor: "#bd0502",
        pointRadius: 0,
        pointBackgroundColor: "rgb(75, 192, 192)",
        backgroundColor: "#bd0502",
        fill: false,
        borderWidth: 3
      }
    ],
    labels,
  }

  return <Line data={data} options={options} />
}