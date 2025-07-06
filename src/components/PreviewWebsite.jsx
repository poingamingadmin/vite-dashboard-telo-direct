import React from "react";

import theme_0 from "../assets/preview/desktop/theme-0.png";
import theme_1 from "../assets/preview/desktop/theme-1.png";
import theme_2 from "../assets/preview/desktop/theme-2.png";
import theme_3 from "../assets/preview/desktop/theme-3.png";
import theme_4 from "../assets/preview/desktop/theme-4.png";
import theme_5 from "../assets/preview/desktop/theme-5.png";
import theme_6 from "../assets/preview/desktop/theme-6.png";
import theme_7 from "../assets/preview/desktop/theme-7.png";
import theme_8 from "../assets/preview/desktop/theme-8.png";
import theme_9 from "../assets/preview/desktop/theme-9.png";
import theme_10 from "../assets/preview/desktop/theme-10.png";
import theme_11 from "../assets/preview/desktop/theme-11.png";
import theme_12 from "../assets/preview/desktop/theme-12.png";
import theme_13 from "../assets/preview/desktop/theme-13.png";
import theme_14 from "../assets/preview/desktop/theme-14.png";
import theme_15 from "../assets/preview/desktop/theme-15.png";
import theme_16 from "../assets/preview/desktop/theme-16.png";
import theme_20 from "../assets/preview/desktop/theme-20.png";
import theme_21 from "../assets/preview/desktop/theme-21.png";
import theme_22 from "../assets/preview/desktop/theme-22.png";
import theme_23 from "../assets/preview/desktop/theme-23.png";
import theme_24 from "../assets/preview/desktop/theme-24.png";
import theme_25 from "../assets/preview/desktop/theme-25.png";
import theme_26 from "../assets/preview/desktop/theme-26.png";
import theme_27 from "../assets/preview/desktop/theme-27.png";
import theme_28 from "../assets/preview/desktop/theme-28.png";
import theme_29 from "../assets/preview/desktop/theme-29.png";
import theme_30 from "../assets/preview/desktop/theme-30.png";
import theme_31 from "../assets/preview/desktop/theme-31.png";

const themesImage = {
  theme_0,
  theme_1,
  theme_2,
  theme_3,
  theme_4,
  theme_5,
  theme_6,
  theme_7,
  theme_8,
  theme_9,
  theme_10,
  theme_11,
  theme_12,
  theme_13,
  theme_14,
  theme_15,
  theme_16,
  theme_20,
  theme_21,
  theme_22,
  theme_23,
  theme_24,
  theme_25,
  theme_26,
  theme_27,
  theme_28,
  theme_29,
  theme_30,
  theme_31,
};

const PreviewWebsite = ({ themes }) => {
  const image = themesImage[themes];

  return (
    <img src={image} alt="Theme Preview" className="rounded-2 img-fluid" />
  );
};

export default PreviewWebsite;
