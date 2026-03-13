import { VoucherData } from "@/lib/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#000",
  },

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
  logo: { width: 130, height: "auto" },

  voucherNo: {
    position: "absolute",
    top: 115,
    left: 0,
    right: 0,
    textAlign: "center",
    fontSize: 12,
    fontWeight: 700,
  },

  date: { position: "absolute", top: 145, left: 40 },

  hotelRow: { position: "absolute", top: 175, left: 40, flexDirection: "row" },
  roomRow: { position: "absolute", top: 200, left: 40, flexDirection: "row" },

  orangeBar: {
    position: "absolute",
    top: 235,
    left: 40,
    width: 515,
    height: 28,
    backgroundColor: "#ff7a00",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },

  adultsRow: {
    position: "absolute",
    top: 280,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  bookText: { position: "absolute", top: 330, left: 40, fontWeight: 700 },
  roomsSection: { position: "absolute", top: 330, left: 260 },

  checkinBlock: { position: "absolute", top: 430, left: 40 },
  remarksBlock: { position: "absolute", top: 520, left: 40, right: 40 },
  signatureBlock: { position: "absolute", top: 620, left: 40 },

  label: { fontWeight: 700 },
  value: { color: "#c00" },
});

interface Props {
  data: VoucherData;
}

export default function VoucherPDF({ data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Logos */}
        <View style={styles.header}>
          <Image style={styles.logo} src="/logos/left-logo.png" />
          <Image style={styles.logo} src="/logos/right-logo.png" />
        </View>

        {/* Voucher Number */}
        <Text style={styles.voucherNo}>Voucher No: {data.voucherNo}</Text>

        {/* Date */}
        <Text style={styles.date}>Date: {data.date}</Text>

        {/* Hotel Name */}
        <View style={styles.hotelRow}>
          <Text style={styles.label}>Hotel Name: </Text>
          <Text style={styles.value}>{data.hotelName}</Text>
        </View>

        {/* Room Type */}
        <View style={styles.roomRow}>
          <Text style={styles.label}>Room Type : </Text>
          <Text style={styles.value}>{data.roomType}</Text>
        </View>

        {/* Orange CLIENTS bar */}
        <View style={styles.orangeBar}>
          <Text style={{ fontWeight: 700, marginRight: 10 }}>CLIENTS:</Text>
          <Text>{data.clients}</Text>
        </View>

        {/* Adults & Children */}
        <View style={styles.adultsRow}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of Adults: </Text>
            <Text style={styles.value}>{data.adults}</Text>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.label}>No. of children under 12 years </Text>
            <Text style={styles.value}>{data.children}</Text>
          </View>
        </View>

        {/* Please Reserve BOOK + Room Breakdown (exact layout from your PDF) */}
        <Text style={styles.bookText}>Please Reserve BOOK</Text>

        <View style={styles.roomsSection}>
          <Text>
            TWINS: <Text style={styles.value}>{data.twins || ""}</Text>
          </Text>
          <Text>
            DOUBLES: <Text style={styles.value}>{data.doubles || ""}</Text>
          </Text>
          <Text>
            SINGLES: <Text style={styles.value}>{data.singles || ""}</Text>
          </Text>
          <Text>
            TRIPLES: <Text style={styles.value}>{data.triples || ""}</Text>
          </Text>
        </View>

        {/* Check-in / Check-out / Nights */}
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
          <Text style={styles.value}>{data.remarks}</Text>
        </View>

        {/* Signature */}
        <View style={styles.signatureBlock}>
          <Text>Signed</Text>
          <Text>For: {data.signedFor}</Text>
          <Text>Name: {data.signedName}</Text>
        </View>
      </Page>
    </Document>
  );
}