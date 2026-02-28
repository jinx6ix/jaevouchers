import { VoucherData } from "@/lib/types";

const red = "#c00";
const orange = "#ff7a00";

interface Props {
  data: VoucherData;
}

export default function VoucherPreview({ data }: Props) {
  return (
    <div
      style={{
        width: "210mm",
        minHeight: "297mm",
        background: "white",
        padding: "36px",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: 14,
        lineHeight: 1.35,
        position: "relative",
        boxSizing: "border-box",
        color: "#000",
        margin: "0 auto",
      }}
    >
      <div style={{ position: "absolute", top: "80px", left: 0, right: 0, textAlign: "center" }}>
        Voucher No: {data.voucherNo}
      </div>

      <div style={{ position: "absolute", top: "115px", left: "40px" }}>
        Date: {data.date}
      </div>

      <div style={{ position: "absolute", top: "155px", left: "40px" }}>
        Hotel Name: <span style={{ color: red }}>{data.hotelName}</span>
      </div>

      <div style={{ position: "absolute", top: "180px", left: "40px" }}>
        Room Type : <span style={{ color: red }}>{data.roomType}</span>
      </div>

      <div
        style={{
          position: "absolute",
          top: "230px",
          left: "40px",
          width: "515px",
          height: "26px",
          backgroundColor: orange,
          display: "flex",
          alignItems: "center",
          paddingLeft: "8px",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        CLIENTS: <span style={{ fontWeight: "normal", marginLeft: "8px" }}>{data.clientNames}</span>
      </div>

      <div style={{ position: "absolute", top: "270px", left: "40px", right: "40px", display: "flex", justifyContent: "space-between" }}>
        <div>
          No. of Adults: <span style={{ color: red }}>{data.noOfAdults}</span>
        </div>
        <div>
          No. of children under 12 years <span style={{ color: red }}>{data.noOfChildren}</span>
        </div>
      </div>

      <div style={{ position: "absolute", top: "320px", left: "40px" }}>
        Please Reserve BOOK
      </div>

      <div style={{ position: "absolute", top: "320px", left: "300px" }}>
        <div>TWINS:</div>
        <div>DOUBLES: <span style={{ color: red }}>{data.doubles}</span></div>
        <div>SINGLES:</div>
        <div>TRIPLES:</div>
      </div>

      <div style={{ position: "absolute", top: "420px", left: "40px" }}>
        <div>Check in: <span style={{ color: red }}>{data.checkIn}</span></div>
        <div>Check out: <span style={{ color: red }}>{data.checkOut}</span></div>
        <div>Number of Nights: <span style={{ color: red }}>{data.noOfNights}</span></div>
      </div>

      <div style={{ position: "absolute", top: "510px", left: "40px", display: "flex" }}>
        Remarks: <span style={{ color: red, marginLeft: "8px" }}>{data.remarks}</span>
      </div>

      <div style={{ position: "absolute", top: "590px", left: "40px" }}>
        <div>Signed</div>
        <div>For: {data.signedFor}</div>
        <div>Name: {data.signedName}</div>
      </div>
    </div>
  );
}