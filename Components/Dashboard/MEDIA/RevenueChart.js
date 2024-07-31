// import React, { useState } from 'react';
// import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer, Bar, Cell } from 'recharts';

// const data = [
//     { name: 'Group A', value: 400 },
//     { name: 'Group B', value: 300 },
//     { name: 'Group C', value: 500 },

// ];

// const colors = [
//     '#0088FE', // Blue color for Group A
//     '#413ea0', // Yellow color for Group B
//     '#8dd1e1', // Default color for other groups
// ];

// const RevenueChart = ({ dataList }) => {

//     return (
//         <>
//         {dataList && dataList.length > 0 ? 
//         <ResponsiveContainer width='100%' height={200}>
//             <PieChart width={100} height={200}>
//                 <Pie
//                     data={dataList}
//                     cx="50%"
//                     cy="50%"
//                     innerRadius={30}
//                     outerRadius={50}
//                     fill="#8884d8"
//                     dataKey="value"
//                     isAnimationActive={true}
//                     label
//                 >
//                     {data.map((entry, index) => (
//                         <Cell key={index} fill={colors[index]} />
//                     ))}
//                 </Pie>
//                 <Tooltip />
//             </PieChart>
//         </ResponsiveContainer >: <></>}
//         </>

//     );
// };

// export default RevenueChart;

import React from 'react';
import {
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend
} from 'recharts';

const colors = ["#0088FE", "#413ea0", "#8dd1e1", "#ff7300"];

const formatValue = (value) => {
    if (value >= 1e7) {
        return (value / 1e7).toFixed(2) + 'Cr';
    } else if (value >= 1e5) {
        return (value / 1e5).toFixed(2) + ' L';
    } else if (value >= 1e3) {
        return (value / 1e3).toFixed(2) + 'K';
    }
    return value;
};

const CustomLabel = ({ x, y, value }) => {
    return (
        <text
            x={x}
            y={y}
            fill="#000"
            textAnchor="middle"
            dominantBaseline="central"
            fontWeight="bold"
        >
            {formatValue(value)}
        </text>
    );
};

const RevenueChart = ({ dataList }) => {
    return (
        <>
            {dataList && dataList.length > 0 ? 
                <ResponsiveContainer width='100%' height={300}>
                    <PieChart>
                        <Pie
                            data={dataList}
                            cx="40%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            fill="#8884d8"
                            dataKey="value"
                            isAnimationActive={true}
                            label={CustomLabel}
                        >
                            {dataList.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip formatter={formatValue} />
                        <Legend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                        />
                    </PieChart>
                </ResponsiveContainer>
            : null}
        </>
    );
};

export default RevenueChart;
