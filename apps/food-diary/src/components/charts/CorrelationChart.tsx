import React, { useRef } from "react";
import Correlation from "../../services/api/correlation/models/Correlation.ts";
import styles from "./CorrelationChart.module.scss";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip
} from 'chart.js';

interface CorrelationChartProps {
    correlations: Correlation[];
}

function getCssVar(ref: React.RefObject<HTMLDivElement | null>, name: string) {
    if (ref.current) {
        return getComputedStyle(ref.current).getPropertyValue(name);
    }
    return '';
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({ correlations }) => {
    const chartRef = useRef<HTMLDivElement>(null);

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Tooltip
    );

    const chartData = {
        labels: correlations.flatMap(correlation =>
            correlation.food_correlations.map(food =>
                food.food_name.length > 30 ? food.food_name.slice(0, 30) + '...' : food.food_name
            )
        ),
        datasets: [
            {
                label: "correlation coefficient",
                data: correlations.flatMap(correlation =>
                    correlation.food_correlations.map(food => food.correlation_coefficient)
                ),
                backgroundColor: getCssVar(chartRef, '--_correlationChart__bar-BackgroundColor'),
                borderColor: getCssVar(chartRef, '--_correlationChart__bar-Color'),
                borderWidth: 1
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "correlation coefficient"
                }

            },
            x: {
                ticks: {
                    maxRotation: 90,
                    minRotation: 20
                }
            }
        }
    };

    return (
        <div className={styles.correlationChart} ref={chartRef}>
            {correlations.length > 0 ? (
                <Bar
                    data={chartData}
                    options={chartOptions}
                />
            ) : (
                <div>No data available</div>
            )}
        </div>
    );
};

export default CorrelationChart;
