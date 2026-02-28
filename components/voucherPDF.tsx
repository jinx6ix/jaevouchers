import { VoucherData } from "@/lib/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
  Image,
} from "@react-pdf/renderer";

// Optional: register a custom font if you want better matching (Helvetica is usually fine)
// Font.register({ family: "Helvetica", fonts: [...] });

const styles = StyleSheet.create({
  page: {
    padding: 40,          // matches your original pdfkit margin=40
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#000",
  },

  // ── Header with logos ──
  header: {
    position: "absolute",
    top: 25,
    left: 40,
    right: 40,
    height: 80,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    width: 130,
    height: "auto",     // preserves aspect ratio
  },

  voucherNo: {
    position: "absolute",
    top: 110,           // shifted down to avoid overlapping logos
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 11,
  },
  date: {
    position: "absolute",
    top: 145,
    left: 40,
  },
  hotelRow: {
    position: "absolute",
    top: 175,
    left: 40,
    flexDirection: "row",
  },
  roomRow: {
    position: "absolute",
    top: 200,
    left: 40,
    flexDirection: "row",
  },
  orangeBar: {
    position: "absolute",
    top: 245,
    left: 40,
    width: 515,
    height: 25,
    backgroundColor: "#ff7a00",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
  },
  adultsRow: {
    position: "absolute",
    top: 290,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  bookText: {
    position: "absolute",
    top: 335,
    left: 40,
  },
  roomsLeft: {
    position: "absolute",
    top: 335,
    left: 300,
  },
  checkinBlock: {
    position: "absolute",
    top: 455,
    left: 40,
  },
  remarksBlock: {
    position: "absolute",
    top: 545,
    left: 40,
    flexDirection: "row",
  },
  signatureBlock: {
    position: "absolute",
    top: 620,
    left: 40,
  },

  label: {
    color: "#000",
  },
  value: {
    color: "#c00", // vivid red – matches your original .fillColor("red")
  },
});

interface Props {
  data: VoucherData;
}

export default function VoucherPDF({ data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logos – top left & top right */}
        <View style={styles.header}>
          <Image
            style={styles.logo}
            src="/logos/left-logo.png"     // public/logos/left-logo.png
          />
          <Image
            style={styles.logo}
            src="/logos/right-logo.png"    // public/logos/right-logo.png
          />
        </View>

        {/* Voucher No – centered */}
        <Text style={styles.voucherNo}>Voucher No: {data.voucherNo}</Text>

        {/* Date */}
        <Text style={styles.date}>Date: {data.date}</Text>

        {/* Hotel & Room Type */}
        <View style={styles.hotelRow}>
          <Text style={styles.label}>Hotel Name: </Text>
          <Text style={styles.value}>{data.hotelName}</Text>
        </View>

        <View style={styles.roomRow}>
          <Text style={styles.label}>Room Type : </Text>
          <Text style={styles.value}>{data.roomType}</Text>
        </View>

        {/* Clients – orange bar */}
        <View style={styles.orangeBar}>
          <Text style={{ fontWeight: 700, marginRight: 10 }}>CLIENTS:</Text>
          <Text>{data.clients}</Text>           {/* adjusted field name */}
        </View>

        {/* Guest counts */}
        <View style={styles.adultsRow}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of Adults: </Text>
            <Text style={styles.value}>{data.adults}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of children under 12 years </Text>
            <Text style={styles.value}>{data.children || ""}</Text>
          </View>
        </View>

        {/* Booking & Room types */}
        <Text style={styles.bookText}>Please Reserve BOOK</Text>

        <View style={styles.roomsLeft}>
          <Text>TWINS:</Text>
          <Text>
            DOUBLES: <Text style={styles.value}>{data.doubles}</Text>
          </Text>
          <Text>SINGLES:</Text>
          <Text>TRIPLES:</Text>
        </View>

        {/* Check-in / out / nights */}
        <View style={styles.checkinBlock}>
          <Text>
            Check in: <Text style={styles.value}>{data.checkIn}</Text>
          </Text>
          <Text>
            Check out: <Text style={styles.value}>{data.checkOut}</Text>
          </Text>
          <Text>
            Number of Nights: <Text style={styles.value}>{data.nights}</Text>
          </Text>
        </View>

        {/* Remarks */}
        <View style={styles.remarksBlock}>
          <Text style={styles.label}>Remarks: </Text>
          <Text style={styles.value}>
            {data.remarks || "PLEASE NOTE CLIENT DIETARY REQUEST VEGETERIAN"}
          </Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Text>Signed</Text>
          <Text>For: Jae Travel Expeditions</Text>
          <Text>Name: {data.agentName || "Antony Waititu"}</Text>
        </View>
      </Page>
    </Document>
  );
}