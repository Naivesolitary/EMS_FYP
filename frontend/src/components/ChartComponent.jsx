import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from "chart.js"
import { Bar, Pie } from "react-chartjs-2"

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title)

const ChartComponent = ({ type, data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  }

  return (
    <div className="h-64">
      {type === "bar" && <Bar data={data} options={options} />}
      {type === "pie" && <Pie data={data} options={options} />}
    </div>
  )
}

export default ChartComponent
