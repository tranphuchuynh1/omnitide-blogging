import { Button } from "components/button";
import React from "react";
import styled from "styled-components";
import { useAuth } from "contexts/auth-context"; // ✅ thêm dòng này

const HomeBannerStyles = styled.div`
  min-height: 520px;
  padding: 40px 0;
  background-image: linear-gradient(
    to right bottom,
    ${(props) => props.theme.primary},
    ${(props) => props.theme.secondary}
  );
  margin-bottom: 60px;
  .banner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-content {
      max-width: 600px;
      color: white;
    }
    &-heading {
      font-size: 36px;
      margin-bottom: 20px;
      font-weight: bold;
    }
    &-desc {
      line-height: 1.75;
      margin-bottom: 40px;
    }
  }
  @media screen and (max-width: 1023.98px) {
    .banner {
      flex-direction: column;
      min-height: unset;
      &-heading {
        font-size: 30px;
        margin-bottom: 10px;
      }
      &-desc {
        font-size: 14px;
        margin-bottom: 20px;
      }
      &-image {
        margin-top: 25px;
      }
      &-button {
        font-size: 14px;
        height: auto;
        padding: 15px;
      }
    }
  }
`;

const HomeBanner = () => {
  const { userInfo } = useAuth(); // ✅ lấy thông tin người dùng

  return (
    <HomeBannerStyles>
      <div className="container">
        <div className="banner">
          <div className="banner-content">
            <h1 className="banner-heading">Omnitide Blogging</h1>
            <p className="banner-desc">
              Nơi kết nối những câu chuyện, xu hướng và tri thức từ mọi lĩnh vực của cuộc sống — 
              từ công nghệ, thể thao, y tế, động vật đến chính trị và văn hóa. 
              Tại đây, mỗi bài viết không chỉ là thông tin, mà còn là góc nhìn, 
              là trải nghiệm và cảm xúc được chia sẻ chân thành. 
              Chúng tôi mang đến cho bạn những điều mới mẻ, đa chiều và gần gũi nhất, 
              để cùng nhau khám phá, thấu hiểu và truyền cảm hứng 
              cho một thế giới đang không ngừng chuyển động.
            </p>

            {/* ✅ Nếu chưa đăng nhập thì mới hiển thị nút */}
            {!userInfo && (
              <Button to="/sign-up" kind="secondary" className="banner-button">
                Get started
              </Button>
            )}
          </div>
          <div className="banner-image">
            <img src="/img-banner.png" alt="banner" />
          </div>
        </div>
      </div>
    </HomeBannerStyles>
  );
};

export default HomeBanner;
