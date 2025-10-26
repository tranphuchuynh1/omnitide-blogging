import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { db } from "firebase-app/firebase-config";
import { collection, query, where, getDocs, limit, startAfter } from "firebase/firestore";
import { Button } from "components/button";
import PostItem from "module/post/PostItem";
import Layout from "components/layout/Layout";

const BlogPageStyles = styled.div`
  .blog-banner {
    background-image: linear-gradient(
      to right bottom,
      ${(props) => props.theme.primary},
      ${(props) => props.theme.secondary}
    );
    padding: 60px 0;
    text-align: center;
    color: white;
    margin-bottom: 60px;
  }

  .blog-banner h1 {
    font-size: 48px;
    font-weight: bold;
  }

  .post-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 30px;
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    margin-top: 40px;
  }

  .pagination button {
    background: ${(props) => props.theme.primary};
    color: white;
    border: none;
    border-radius: 6px;
    padding: 10px 16px;
    cursor: pointer;
    transition: all 0.25s ease;
  }

  .pagination button.active {
    background: ${(props) => props.theme.secondary};
    font-weight: bold;
  }

  .pagination button:hover {
    background: ${(props) => props.theme.secondary};
  }

  @media screen and (max-width: 1023.98px) {
    .post-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media screen and (max-width: 600px) {
    .post-grid {
      grid-template-columns: 1fr;
    }
  }
`;

const BlogPage = () => {
  const POSTS_PER_PAGE = 8;
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSnapshots, setPageSnapshots] = useState([]);

  // Tổng số bài viết (để tính số trang)
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTotal = async () => {
      const colRef = collection(db, "posts");
      const q = query(colRef, where("status", "==", 1));
      const snapshot = await getDocs(q);
      const total = snapshot.size;
      setTotalPages(Math.ceil(total / POSTS_PER_PAGE));
    };
    fetchTotal();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      const colRef = collection(db, "posts");
      let q = query(colRef, where("status", "==", 1), limit(POSTS_PER_PAGE));

      // nếu không phải trang đầu thì query sau lastDoc của trang trước
      if (page > 1 && pageSnapshots[page - 2]) {
        q = query(colRef, where("status", "==", 1), startAfter(pageSnapshots[page - 2]), limit(POSTS_PER_PAGE));
      }

      const snapshot = await getDocs(q);
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setPosts(results);

      // lưu lại lastDoc để dùng cho trang kế tiếp
      if (snapshot.docs.length > 0) {
        const newSnapshots = [...pageSnapshots];
        newSnapshots[page - 1] = snapshot.docs[snapshot.docs.length - 1];
        setPageSnapshots(newSnapshots);
      }
    };
    fetchPosts();
  }, [page]);

  return (
    <BlogPageStyles>
    <Layout/>
      <div className="blog-banner">
        <h1>Blog</h1>
      </div>

      <div className="container">
        <div className="post-grid">
          {posts.map((post) => (
            <PostItem key={post.id} data={post} />
          ))}
        </div>

        {/* ✅ Phân trang dạng số */}
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={page === i + 1 ? "active" : ""}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </BlogPageStyles>
  );
};

export default BlogPage;
