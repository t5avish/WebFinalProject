import React, { useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

/**
 * Renders the details of a selected challenge, including a graph
 * showing daily progress and a set of buttons to update daily values.
 * Allows users to input new values for specific dates.
 */
const ChallengeDetails = ({
    challengeDetails,
    selectedChallenge,
    sortedDays,
    handleButtonClick,
    isNumberInputOpen,
    selectedDateValue,
    setSelectedDateValue,
    handleSave,
    graphData,
    graphOptions,
    setChallengeDetails,
}) => {
    const chartRef = useRef(null);

    useEffect(() => {
        return () => {
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 dark:bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="relative bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-4xl overflow-auto max-h-[90vh]">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label="Close"
                    onClick={() => setChallengeDetails(null)}
                >
                    X
                </button>
                <h1 className="text-2xl font-bold mb-4 text-center">
                    {selectedChallenge.title}
                </h1>
                <div className="flex justify-center mb-6">
                    <div className="flex items-center">
                        <h2 className="font-bold mr-2 text-gray-800 dark:text-white">
                            Daily goal:
                        </h2>
                        <h3 className="text-gray-600 dark:text-gray-400">
                            {selectedChallenge.goal} {selectedChallenge.measurement}
                        </h3>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-4">
                    {sortedDays.reduce((rows, [key, value], index) => {
                        if (index % 5 === 0) rows.push([]);
                        rows[rows.length - 1].push(
                            <button
                                key={key}
                                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 mb-4 mx-2"
                                onClick={() => handleButtonClick(key)}
                                style={{ minWidth: '100px' }}
                            >
                                {key}
                            </button>
                        );
                        return rows;
                    }, []).map((row, i) => (
                        <div key={i} className="flex flex-wrap justify-center mb-2">
                            {row}
                        </div>
                    ))}
                </div>

                {isNumberInputOpen && (
                    <div className="flex items-center justify-center mt-4">
                        <input
                            type="number"
                            value={selectedDateValue}
                            onChange={(e) => setSelectedDateValue(e.target.value)}
                            className="border border-gray-300 dark:border-gray-600 dark:bg-gray-700 p-2 rounded-md mr-2 text-center w-20"
                        />
                        <button
                            onClick={handleSave}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                        >
                            Save
                        </button>
                    </div>
                )}

                <div className="mt-8">
                    <Line
                        id="myChart"
                        ref={chartRef}
                        data={graphData}
                        options={graphOptions}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChallengeDetails;
