import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const AuthenticationPageStyles = styled.div`
  min-height: 100vh;
  padding: -40px 20px;

  .logo {
    margin: 0 auto -10px; /* Đưa logo gần chữ hơn */
    display: block;
    height: 220px; /* Giảm chiều cao để không chiếm nhiều chỗ */
    width: auto;
    object-fit: contain;
  }

  .heading {
    text-align: center;
    color: ${(props) => props.theme.primary};
    font-weight: bold;
    font-size: 36px;
    margin-bottom: 10px; /* giảm khoảng cách với form */
    margin-top: -10px; /* chèn sát lên logo */
  }

  .form {
    max-width: 600px;
    margin: 0 auto;
  }

  .have-account {
    margin-bottom: 20px;
    font-size: 14px;
    text-align: center;
    a {
      display: inline-block;
      color: ${(props) => props.theme.primary};
      font-weight: 500;
    }
  }

  @media screen and (max-width: 768px) {
    .logo {
      height: 60px;
    }
    .heading {
      font-size: 30px;
      margin-bottom: 30px;
    }
  }
`;


const AuthenticationPage = ({ children }) => {
  return (
    <AuthenticationPageStyles>
      <div className="container">
        <div className="text-center">
          <NavLink to="/" className="inline-block">
            <img srcSet="/logo.png 2x" alt="OB-blogging" className="logo" />
          </NavLink>
        </div>
        <h1 className="heading">Omnitide Blogging</h1>
        {children}
      </div>
    </AuthenticationPageStyles>
  );
};

export default AuthenticationPage;
