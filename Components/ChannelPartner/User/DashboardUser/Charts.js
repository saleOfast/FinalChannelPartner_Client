// import React from 'react'
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip ,head } from 'recharts';
// const Charts = ({dataList}) => {
//     return (
//         <>

//        {dataList && dataList.length > 0 ? 
//         <ResponsiveContainer width='120%' height={350}>
//             <BarChart data={dataList} width={80} height={90} isAnimationActive={true} >
//                 <XAxis dataKey="date"/>
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="lead" fill="#8884d8" />
//                 <Bar dataKey="booking" fill="#82ca9d" />
//             </BarChart>
//         </ResponsiveContainer> : <></>}
//         </>
//     )
// }

// export default Charts

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const Charts = ({ dataList }) => {
    // Function to generate Y-axis ticks
    const getYAxisTicks = () => {
        const maxLead = Math.max(...dataList.map(data => data.lead));
        const maxBooking = Math.max(...dataList.map(data => data.booking));
        const maxValue = Math.ceil(Math.max(maxLead, maxBooking)); // Get the maximum value and round up

         // Determine tick interval based on maxValue
        const interval = Math.ceil(maxValue / 10);

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
                        <XAxis dataKey="date" />
                        <YAxis ticks={getYAxisTicks()} /> {/* Set custom Y-axis ticks */}
                        <Tooltip />
                        <Bar dataKey="lead" fill="#8884d8" />
                        <Bar dataKey="booking" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <></>
            )}
        </>
    );
};

export default Charts;