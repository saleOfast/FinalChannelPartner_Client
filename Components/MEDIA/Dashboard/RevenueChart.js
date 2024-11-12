import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    { status: 'Group A', count: 400 },
    { status: 'Group B', count: 300 },
    { status: 'Group C', count: 500 },
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
                <ResponsiveContainer width='100%' height={490}>
                    <PieChart>
                        <Pie
                            data={dataList}
                            cx="40%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={75}
                            fill="#8884d8"
                            dataKey="count"
                            nameKey="status"
                            isAnimationActive={true}
                            label
                        >
                            {data.map((entry, index) => (
                                <Cell key={index} fill={colors[index % colors.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
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
