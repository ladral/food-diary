import React, { useEffect, useState } from "react";
import CorrelationChart from "../../components/charts/CorrelationChart.tsx";
import logger from "../../services/logging/logger.ts";
import { useAlert } from "../../context/AlertContext.tsx";
import CorrelationService from "../../services/api/correlation/CorrelationService.ts";
import Correlation from "../../services/api/correlation/models/Correlation.ts";


const Analysis: React.FC = () => {
    const [correlations, setCorrelations] = useState<Correlation[]>([]);
    const { addAlert } = useAlert();
    const correlationService = new CorrelationService(addAlert);

    const fetchCorrelations = async () => {
        try {
            const result = await correlationService.getCorrelations();
            if (result) {
                setCorrelations(result.correlations);
            } else {
                logger.error("No correlations found");
            }
        } catch (error) {
            logger.error("Failed to fetch correlations", error);
        }
    };


    useEffect(() => {
        fetchCorrelations();
    }, []);

    return (
        <div>
            <CorrelationChart correlations={correlations}></CorrelationChart>
        </div>
    )
}

export default Analysis;