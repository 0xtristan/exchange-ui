// "use client";

// import React, { useState, useEffect } from 'react';
// import { Client } from '@zetamarkets/zetax-sdk';

// const RecentTrades: React.FC = () => {
//   const [trades, setTrades] = useState<any[]>([]);

//   useEffect(() => {
//     const fetchRecentTrades = async () => {
//       try {
//         const client = await Client.connect();
//         const recentTrades = await client.exchange.getRecentTrades();
//         setTrades(recentTrades);
//       } catch (error) {
//         console.error('Error fetching recent trades:', error);
//       }
//     };

//     fetchRecentTrades();
//     const interval = setInterval(fetchRecentTrades, 5000); // Update every 5 seconds

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <div className="h-1/3">
//       <h2>Recent Trades</h2>
//       <table>
//         <thead>
//           <tr>
//             <th>Time</th>
//             <th>Price</th>
//             <th>Size</th>
//           </tr>
//         </thead>
//         <tbody>
//           {trades.map((trade, index) => (
//             <tr key={index}>
//               <td>{new Date(trade.time).toLocaleTimeString()}</td>
//               <td>{trade.price}</td>
//               <td>{trade.size}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default RecentTrades;
