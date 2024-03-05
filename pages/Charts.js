import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip ,head } from 'recharts';
const Charts = ({dataList}) => {
    return (
        <>

       {dataList && dataList.length > 0 ? 
        <ResponsiveContainer width='100%' height={190}>
            <BarChart data={dataList} width={80} height={90} isAnimationActive={true} >
                <XAxis dataKey="date"/>
                <YAxis />
                <Tooltip />
                <Bar dataKey="lead" fill="#8884d8" />
                <Bar dataKey="opportunity" fill="#82ca9d" />
            </BarChart>
        </ResponsiveContainer> : <></>}
        </>
    )
}

export default Charts