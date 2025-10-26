import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/auth-context";

// ✅ Import các trang
const HomePage = React.lazy(() => import("pages/HomePage"));
const BlogPage = React.lazy(() => import("pages/BlogPage")); 
const ContactPage = React.lazy(() => import("pages/ContactPage")); 
const CategoryPage = React.lazy(() => import("pages/CategoryPage"));
const DashboardPage = React.lazy(() => import("pages/DashboardPage"));
const SignInPage = React.lazy(() => import("pages/SignInPage"));
const PostDetailsPage = React.lazy(() => import("pages/PostDetailsPage"));
const PageNotFound = React.lazy(() => import("pages/PageNotFound"));
const UserUpdate = React.lazy(() => import("module/user/UserUpdate"));
const UserAddNew = React.lazy(() => import("module/user/UserAddNew"));
const UserManage = React.lazy(() => import("module/user/UserManage"));
const UserProfile = React.lazy(() => import("module/user/UserProfile"));
const PostAddNew = React.lazy(() => import("module/post/PostAddNew"));
const PostManage = React.lazy(() => import("module/post/PostManage"));
const PostUpdate = React.lazy(() => import("module/post/PostUpdate"));
const CategoryAddNew = React.lazy(() =>
  import("module/category/CategoryAddNew")
);
const CategoryManage = React.lazy(() =>
  import("module/category/CategoryManage")
);
const CategoryUpdate = React.lazy(() =>
  import("module/category/CategoryUpdate")
);
const DashboardLayout = React.lazy(() =>
  import("module/dashboard/DashboardLayout")
);
const SignUpPage = React.lazy(() => import("./pages/SignUpPage"));

function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            {/* Trang chính */}
            <Route path="/" element={<HomePage />} />
            <Route path="/blog" element={<BlogPage />} /> 
            <Route path="/contact" element={<ContactPage />} /> 
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="*" element={<PageNotFound />} />

            {/* Các route khác */}
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/:slug" element={<PostDetailsPage />} />

            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manage/posts" element={<PostManage />} />
              <Route path="/manage/add-post" element={<PostAddNew />} />
              <Route path="/manage/update-post" element={<PostUpdate />} />
              <Route path="/manage/category" element={<CategoryManage />} />
              <Route path="/manage/add-category" element={<CategoryAddNew />} />
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate />}
              />
              <Route path="/manage/user" element={<UserManage />} />
              <Route path="/manage/add-user" element={<UserAddNew />} />
              <Route path="/manage/update-user" element={<UserUpdate />} />
              <Route path="/profile" element={<UserProfile />} />
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
