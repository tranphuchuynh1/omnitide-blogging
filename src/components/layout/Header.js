import { Button } from "components/button";
import { useAuth } from "contexts/auth-context";
import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { db } from "firebase-app/firebase-config";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const menuLinks = [
  { url: "/", title: "Home" },
  { url: "/blog", title: "Blog" },
  { url: "/contact", title: "Contact" },
];

const HeaderStyles = styled.header`
  padding: 10px 0;
  position: relative;
  z-index: 100;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);

  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: relative;
  }

  .logo {
    display: block;
    height: 80px;
    width: auto;
    object-fit: contain;
    transition: transform 0.25s ease;
  }

  .logo:hover {
    transform: scale(1.05);
  }

  .menu {
    display: flex;
    align-items: center;
    gap: 25px;
    margin-left: 40px;
    list-style: none;
    font-weight: 500;
  }

  .menu-item .menu-link {
    color: #333;
    text-decoration: none;
    font-size: 18px;
    position: relative;
  }

  .menu-item .menu-link:hover {
    color: ${(props) => props.theme.primary};
  }

  .search {
    margin-left: auto;
    padding: 12px 20px;
    border: 1px solid #ccc;
    border-radius: 8px;
    width: 100%;
    max-width: 320px;
    display: flex;
    align-items: center;
    position: relative;
    margin-right: 20px;
    background: white;
  }

  .search-input {
    flex: 1;
    padding-right: 45px;
    font-weight: 500;
    border: none;
    outline: none;
    background: transparent;
  }

  .search-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }

  /* ✅ Kết quả tìm kiếm — FIX VỠ GIAO DIỆN */
  .search-results {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    width: 100%;
    background: white;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
    max-height: 300px;
    z-index: 999;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-5px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .search-result-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 15px;
    cursor: pointer;
    transition: background 0.2s ease;
  }

  .search-result-item:hover {
    background-color: #f7f7f7;
  }

  .search-result-img {
    width: 40px;
    height: 40px;
    object-fit: cover;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .search-result-title {
    font-size: 14px;
    color: #333;
    font-weight: 500;
    line-height: 1.4;
  }

  .header-auth {
    display: flex;
    align-items: center;
    gap: 20px;
  }

  @media screen and (max-width: 1023.98px) {
    .logo {
      height: 60px;
    }
    .menu,
    .search,
    .header-button,
    .header-auth {
      display: none;
    }
  }
`;

const Header = () => {
  const { userInfo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const isContactPage = location.pathname === "/contact";

  useEffect(() => {
    if (!keyword.trim()) {
      setResults([]);
      return;
    }

    const colRef = collection(db, "posts");
    const q = query(colRef, where("status", "==", 1));

    const unsub = onSnapshot(q, (snapshot) => {
      const allPosts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const filtered = allPosts.filter((post) =>
        post.title.toLowerCase().includes(keyword.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
    });

    return () => unsub();
  }, [keyword]);

  const handleSelectPost = (slug) => {
    setKeyword("");
    setResults([]);
    navigate(`/${slug}`);
  };

  return (
    <HeaderStyles>
      <div className="container">
        <div className="header-main">
          <NavLink to="/">
            <img srcSet="/logo.png 2x" alt="OB-blogging" className="logo" />
          </NavLink>

          <ul className="menu">
            {menuLinks.map((item) => (
              <li className="menu-item" key={item.title}>
                <NavLink to={item.url} className="menu-link">
                  {item.title}
                </NavLink>
              </li>
            ))}
          </ul>

          {!isContactPage && (
            <div className="search">
              <input
                type="text"
                className="search-input"
                placeholder="Search posts..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
              <span className="search-icon">
                <svg
                  width="18"
                  height="17"
                  viewBox="0 0 18 17"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <ellipse
                    cx="7.66669"
                    cy="7.05161"
                    rx="6.66669"
                    ry="6.05161"
                    stroke="#999999"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M17.0001 15.5237L15.2223 13.9099L14.3334 13.103L12.5557 11.4893"
                    stroke="#999999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M11.6665 12.2964C12.9671 12.1544 13.3706 11.8067 13.4443 10.6826"
                    stroke="#999999"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              {results.length > 0 && (
                <div className="search-results">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="search-result-item"
                      onClick={() => handleSelectPost(item.slug)}
                    >
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.title}
                          className="search-result-img"
                        />
                      )}
                      <p className="search-result-title">{item.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!userInfo ? (
            <Button
              type="button"
              height="56px"
              className="header-button"
              to="/sign-in"
            >
              Login
            </Button>
          ) : (
            <div className="header-auth">
              <Button
                type="button"
                height="56px"
                className="header-button"
                to="/dashboard"
              >
                Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </HeaderStyles>
  );
};

export default Header;
