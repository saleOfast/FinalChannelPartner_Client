import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Charts1 = ({ dataList, keyX = 'lead', keyY = 'booking' }) => {
    // Function to generate Y-axis ticks
    const getYAxisTicks = () => {
        const maxX = Math.max(...dataList.map(data => data[keyX]));
        const maxY = Math.max(...dataList.map(data => data[keyY]));
        const maxValue = Math.ceil(Math.max(maxX, maxY)); // Get the maximum value and round up
    
        // Determine tick interval based on maxValue
        const interval = Math.ceil(maxValue / 10); // Aim for around 10 ticks
    
        // Create an array of ticks with the chosen interval
        const ticks = [];
        for (let i = 0; i <= maxValue; i += interval) {
            ticks.push(i);
        }
        return ticks;
    };
    

    return (
        <>
            {dataList && dataList.length > 0 ? (
                <ResponsiveContainer width='120%' height={350}>
                    <BarChart data={dataList} width={80} height={90} isAnimationActive={true}>
                        <XAxis dataKey="created_by" />
                        <YAxis ticks={getYAxisTicks()} /> {/* Set custom Y-axis ticks */}
                        <Tooltip />
                        {/* <Bar dataKey={keyX} fill="#8884d8" /> */}
                        <Bar dataKey={keyY} fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <></>
            )}
        </>
    );
};

export default Charts1;



