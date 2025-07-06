import React from "react";
import BANKJAGO from "../assets/BankLogo/BANKJAGO.png";
import BCA from "../assets/BankLogo/BCA.png";
import BNI from "../assets/BankLogo/BNI.png";
import BRI from "../assets/BankLogo/BRI.png";
import BSI from "../assets/BankLogo/BSI.png";
import CIMB from "../assets/BankLogo/CIMB.png";
import DANA from "../assets/BankLogo/DANA.png";
import GOPAY from "../assets/BankLogo/GOPAY.png";
import LINKAJA from "../assets/BankLogo/LINKAJA.png";
import MANDIRI from "../assets/BankLogo/MANDIRI.png";
import OVO from "../assets/BankLogo/OVO.png";
import PERMATA from "../assets/BankLogo/PERMATA.png";
import QRIS from "../assets/BankLogo/QRIS.png";
import SEABANK from "../assets/BankLogo/SEABANK.png";
import SHOPEEPAY from "../assets/BankLogo/SHOPEEPAY.png";
import TELKOMSEL from "../assets/BankLogo/TELKOMSEL.png";
import XL from "../assets/BankLogo/XL.png";
import { CiBank } from "react-icons/ci";

const bankLogos = {
  BANKJAGO,
  BCA,
  BNI,
  BRI,
  BSI,
  CIMB,
  DANA,
  GOPAY,
  LINKAJA,
  MANDIRI,
  OVO,
  PERMATA,
  QRIS,
  SEABANK,
  SHOPEEPAY,
  TELKOMSEL,
  XL,
};

const BankLogo = ({ bankName }) => {
  const logo = bankLogos[bankName];

  if (!logo) {
    return (
      <>
        <CiBank size={24} className="ms-2" /> Other Bank
      </>
    );
  }

  return <img src={logo} alt={bankName} className="bank-logo" />;
};

export default BankLogo;
