import styled from "styled-components";
import React, { useEffect, useState } from "react";
import PostRelated from "module/post/PostRelated";
import PostMeta from "module/post/PostMeta";
import PostImage from "module/post/PostImage";
import PostCategory from "module/post/PostCategory";
import PageNotFound from "./PageNotFound";
import Layout from "components/layout/Layout";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useAuth } from "contexts/auth-context";
import { userRole } from "utils/constants";

const PostDetailsPageStyles = styled.div`
  padding-bottom: 100px;
  .post {
    &-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;
      margin: 40px 0;
    }
    &-feature {
      width: 100%;
      max-width: 640px;
      height: 466px;
      border-radius: 20px;
    }
    &-heading {
      font-weight: bold;
      font-size: 36px;
      margin-bottom: 16px;
    }
    &-info {
      flex: 1;
    }
    &-content {
      max-width: 700px;
      margin: 80px auto;
    }
  }
  .author {
    margin-top: 40px;
    margin-bottom: 80px;
    display: flex;
    border-radius: 20px;
    background-color: ${(props) => props.theme.grayF3};
    &-image {
      width: 200px;
      height: 200px;
      flex-shrink: 0;
      border-radius: inherit;
    }
    &-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: inherit;
    }
    &-content {
      flex: 1;
      padding: 20px;
    }
    &-name {
      font-weight: bold;
      margin-bottom: 10px;
      font-size: 20px;
    }
    &-desc {
      font-size: 14px;
      line-height: 2;
    }
  }
  @media screen and (max-width: 1023.98px) {
    padding-bottom: 40px;
    .post {
      &-header {
        flex-direction: column;
      }
      &-feature {
        height: auto;
      }
      &-heading {
        font-size: 26px;
      }
      &-content {
        margin: 40px 0;
      }
    }
    .author {
      flex-direction: column;
      &-image {
        width: 100%;
        height: auto;
      }
    }
  }
`;

const PostDetailsPage = () => {
  const { slug } = useParams();
  const [postInfo, setPostInfo] = useState({});
  const { userInfo } = useAuth();
  const navigate = useNavigate();

  // ✅ Dùng 1 useEffect duy nhất để kiểm tra đăng nhập và lấy dữ liệu
  useEffect(() => {
    // Nếu chưa đăng nhập → chuyển sang trang đăng nhập
    if (!userInfo) {
      navigate("/sign-in", { state: { from: window.location.pathname } });
      return; // Dừng tại đây, không cần fetch dữ liệu
    }

    // Nếu đã có slug và user đăng nhập → load bài viết
    if (slug) {
      const colRef = query(collection(db, "posts"), where("slug", "==", slug));
      onSnapshot(colRef, (snapshot) => {
        snapshot.forEach((doc) => {
          doc.data() &&
            setPostInfo({
              id: doc.id,
              ...doc.data(),
            });
        });
      });
    }

    // Cuộn lên đầu trang mỗi khi đổi bài viết
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [slug, userInfo, navigate]);

  // Nếu chưa có dữ liệu hoặc slug không tồn tại
  if (!slug) return <PageNotFound />;
  if (!postInfo.title) return null;

  const { user } = postInfo;

  return (
    <PostDetailsPageStyles>
      <Layout>
        <div className="container">
          <div className="post-header">
            <PostImage url={postInfo.image} className="post-feature"></PostImage>
            <div className="post-info">
              <PostCategory className="mb-6" to={postInfo.category?.slug}>
                {postInfo.category?.name}
              </PostCategory>
              <h1 className="post-heading">{postInfo.title}</h1>
              <PostMeta
                date={
                  postInfo.createdAt
                    ? new Date(postInfo.createdAt.seconds * 1000).toLocaleDateString("vi-VN")
                    : "Không rõ ngày"
                }
                authorName={user?.fullname}
                to={user?.id}
              />
              {userInfo?.role === userRole.ADMIN && (
                <Link
                  to={`/manage/update-post?id=${postInfo.id}`}
                  className="inline-block px-4 py-2 mt-5 text-sm border border-gray-400 rounded-md"
                >
                  Edit post
                </Link>
              )}
            </div>
          </div>
          <div className="post-content">
            <div
              className="entry-content"
              dangerouslySetInnerHTML={{
                __html: postInfo.content || "",
              }}
            ></div>
          </div>
          <PostRelated
            categoryId={postInfo?.category?.id}
            currentPostId={postInfo?.id}
          />
        </div>
      </Layout>
    </PostDetailsPageStyles>
  );
};

export default PostDetailsPage;
