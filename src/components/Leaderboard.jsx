import { useEffect, useState } from "react";
import API from "../api";
import "../css/leaderboard.css";

export default function Leaderboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const res = await API.get("/leaderboard");
      if (res.data && res.data.leaderboard) {
        const sorted = res.data.leaderboard.sort((a, b) => b.count - a.count);
        setData(sorted); // keep all, slicing done later
      } else {
        setData([]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setData([]);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <h2 className="loading">Loading leaderboard...</h2>;

  // Split into chunks of 18 teams each
  const chunkSize = 18;
  const tables = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    tables.push(data.slice(i, i + chunkSize));
  }

  const renderTable = (tableData, tableIndex) => (
    <table className="leaderboard-table" key={tableIndex}>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Path No</th>
          <th>Locations</th>
        </tr>
      </thead>
      <tbody>
        {tableData.map((item, index) => (
          <tr
            key={item.path_no}
            className={index < 3 && tableIndex === 0 ? "top" : ""}
          >
            <td>{index + 1 + tableIndex * chunkSize}</td>
            <td>{item.path_no}</td>
            <td>{item.count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  return (
    <div className="leaderboard-container">
      <h1>🏆Leaderboard</h1>
      <div className="tables-wrapper">
        {tables.map((t, idx) => renderTable(t, idx))}
      </div>
    </div>
  );
}
