import Heading from "components/layout/Heading";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import PostItem from "./PostItem";

const PostRelated = ({ categoryId = "", currentPostId = "" }) => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (!categoryId) return;
    const q = query(
      collection(db, "posts"),
      where("category.id", "==", categoryId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      // bỏ bài đang xem ra khỏi danh sách liên quan
      const filtered = results.filter((item) => item.id !== currentPostId);
      setPosts(filtered);
    });

    return unsubscribe;
  }, [categoryId, currentPostId]);

  if (!categoryId || posts.length <= 0) return null;

  return (
    <div className="post-related">
      <Heading>Bài viết liên quan</Heading>
      <div className="grid-layout grid-layout--primary">
        {posts.map((item) => (
          <PostItem key={item.id} data={item}></PostItem>
        ))}
      </div>
    </div>
  );
};

export default PostRelated;
