import React, { useState } from 'react';
import { PieChart, Pie, Sector, Tooltip, ResponsiveContainer, Bar, Cell } from 'recharts';

const data = [
    { name: 'Group A', value: 400 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 500 },

];

const colors = [
    '#0088FE', // Blue color for Group A
    '#413ea0', // Yellow color for Group B
    '#8dd1e1', // Default color for other groups

];

const RevenueChart = ({ dataList }) => {

    return (
        <>
        {dataList && dataList.length > 0 ? 
        <ResponsiveContainer width='100%' height={200}>
            <PieChart width={100} height={100}>
                <Pie
                    data={dataList}
                    cx="50%"
                    cy="50%"
                    innerRadius={30}
                    outerRadius={50}
                    fill="#8884d8"
                    dataKey="value"
                    isAnimationActive={true}
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={index} fill={colors[index]} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </ResponsiveContainer >: <></>}
        </>

    );
};

export default RevenueChart;
