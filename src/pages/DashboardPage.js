import React, { useEffect, useState } from "react";
import styled from "styled-components";
import DashboardHeading from "module/dashboard/DashboardHeading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot } from "firebase/firestore";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const DashboardStyles = styled.div`
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    margin-bottom: 50px;
  }
  .stats-card {
    background-color: #f8f9fa;
    border-radius: 16px;
    padding: 30px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  }
  .stats-number {
    font-size: 40px;
    font-weight: bold;
    color: ${(props) => props.theme.primary};
  }
  .stats-label {
    font-size: 18px;
    color: #666;
  }
`;

const DashboardPage = () => {
  const [userCount, setUserCount] = useState(0);
  const [categoryCount, setCategoryCount] = useState(0);
  const [postCount, setPostCount] = useState(0);
  const [chartData, setChartData] = useState([]);

  // 🧍‍♂️ Lấy số lượng người dùng đang online (status = active)
  useEffect(() => {
    const usersRef = collection(db, "users");
    onSnapshot(usersRef, (snapshot) => {
      const activeUsers = snapshot.docs.filter(
        (doc) => doc.data().status === "active" || doc.data().status === 1
      );
      setUserCount(activeUsers.length);
    });
  }, []);

  // 🗂 Lấy số lượng category
  useEffect(() => {
    const categoryRef = collection(db, "categories");
    onSnapshot(categoryRef, (snapshot) => {
      setCategoryCount(snapshot.size);
    });
  }, []);

  // 📝 Lấy số lượng bài viết + dữ liệu cho biểu đồ
  useEffect(() => {
    const postRef = collection(db, "posts");
    onSnapshot(postRef, (snapshot) => {
      setPostCount(snapshot.size);

      // gom bài viết theo ngày đăng
      const postData = {};
      snapshot.forEach((doc) => {
        const data = doc.data();
        const seconds = data?.createdAt?.seconds;
        if (!seconds) return;
        const date = new Date(seconds * 1000);
        const dateKey = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

        if (!postData[dateKey]) postData[dateKey] = 0;
        postData[dateKey]++;
      });

      const formattedData = Object.keys(postData).map((key) => ({
        date: key,
        count: postData[key],
      }));

      // sắp xếp theo ngày (tăng dần)
      formattedData.sort((a, b) => {
        const [da, ma, ya] = a.date.split("/").map(Number);
        const [db, mb, yb] = b.date.split("/").map(Number);
        return new Date(ya, ma - 1, da) - new Date(yb, mb - 1, db);
      });

      setChartData(formattedData);
    });
  }, []);

  return (
    <DashboardStyles>
      <DashboardHeading
        title="Dashboard"
        desc="Overview dashboard monitor"
      ></DashboardHeading>

      {/* 🧍‍♂️🗂📝 3 ô thống kê */}
      <div className="stats-grid">
        <div className="stats-card">
          <div className="stats-number">{userCount}</div>
          <div className="stats-label">Người dùng đang online</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{categoryCount}</div>
          <div className="stats-label">Danh mục</div>
        </div>
        <div className="stats-card">
          <div className="stats-number">{postCount}</div>
          <div className="stats-label">Bài viết</div>
        </div>
      </div>

      {/* 📊 Biểu đồ thống kê bài viết */}
      <div className="chart-container" style={{ width: "100%", height: 400 }}>
        <h2 className="text-xl font-semibold mb-5">Thống kê bài viết theo ngày</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [`Bài viết được tạo: ${value}`]}
            />
            <Bar dataKey="count" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </DashboardStyles>
  );
};

export default DashboardPage;
