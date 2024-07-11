// import React from 'react'
// import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip ,head } from 'recharts';
// const Charts = ({dataList}) => {
//     return (
//         <>

//        {dataList && dataList.length > 0 ? 
//         <ResponsiveContainer style={{width:"fit-content"}} height={194}>
//             <BarChart data={dataList} width={100} height={90} isAnimationActive={true} >
//                 <XAxis dataKey="date"/>
//                 <YAxis />
//                 <Tooltip />
//                 <Bar dataKey="lead" fill="#8884d8" />
//                 <Bar dataKey="opportunity" fill="#82ca9d" />
//             </BarChart>
//         </ResponsiveContainer> : <></>}
//         </>
//     )
// }

// export default Charts

import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const Charts = ({ dataList }) => {
    return (
        <>
            {dataList && dataList.length > 0 ? 
                <ResponsiveContainer style={{ width: "fit-content" }} height={300}>
                    <BarChart data={dataList} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="lead" name="Lead" fill="#8884d8" />
                        <Bar dataKey="opportunity" name="Opportunity" fill="#82ca9d" />
                    </BarChart>
                </ResponsiveContainer>
                : <></>}
        </>
    );
}

export default Charts;
