import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import PostItem from "module/post/PostItem";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { v4 } from "uuid";

const HomeMorePostsStyles = styled.div`
  margin-top: -10px;
`;

const HomeMorePosts = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const colRef = collection(db, "posts");
    // Lấy toàn bộ bài viết hợp lệ (status = 1, không hot)
    const q = query(
      colRef,
      where("status", "==", 1),
      where("hot", "==", false),
      orderBy("createdAt", "desc")
    );

    onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setPosts(results);
    });
  }, []);

  // Bỏ qua 4 bài đầu (Latest posts) => chỉ lấy từ bài thứ 5 trở đi
  const morePosts = posts.slice(4);

  if (morePosts.length <= 0) return null;

  return (
    <HomeMorePostsStyles className="home-block">
      <div className="container">
        {/* <Heading>Các bài viết khác</Heading> */}
        <div className="grid-layout grid-layout--primary">
          {morePosts.map((post) => (
            <PostItem key={v4()} data={post}></PostItem>
          ))}
        </div>
      </div>
    </HomeMorePostsStyles>
  );
};

export default HomeMorePosts;
