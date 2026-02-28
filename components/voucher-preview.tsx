import { VoucherData } from '@/app/page'
import Image from 'next/image'

interface VoucherPreviewProps {
  data: VoucherData
}

export default function VoucherPreview({ data }: VoucherPreviewProps) {
  return (
    <div className="w-full bg-white p-8 font-sans print:p-0">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Logos and Details */}
        <div className="flex justify-between items-center gap-8">
          {/* LEFT: Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/unnamed.png"
              alt="Jae Travel Expeditions Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

          {/* CENTER: Company Info and Voucher Details */}
          <div className="flex-1 text-center">
            <div className="text-xl font-bold text-black mb-1">Jae Travel</div>
            <div className="text-sm text-gray-700 italic mb-4">Expeditions</div>
            <div className="space-y-1">
              <div className="text-black font-semibold">
                Voucher No: <span className="font-normal">{data.voucherNo}</span>
              </div>
              <div className="text-black">
                Date: <span className="font-normal">{data.date}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Logo */}
          <div className="flex-shrink-0">
            <Image
              src="/unnamed.png"
              alt="Jae Travel Expeditions Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Divider line */}
        <div className="border-b-2 border-gray-400"></div>

        {/* Hotel and Room Information */}
        <div className="space-y-3">
          <div className="flex">
            <span className="w-32 text-black font-semibold">Hotel Name:</span>
            <span className="text-red-600 font-semibold">{data.hotelName}</span>
          </div>
          <div className="flex">
            <span className="w-32 text-black font-semibold">Room Type :</span>
            <span className="text-red-600 font-semibold">{data.roomType}</span>
          </div>
        </div>

        {/* Clients Section */}
        {data.clientNames && (
          <div className="bg-orange-400 text-black font-bold py-2 px-4">
            CLIENTS: {data.clientNames}
          </div>
        )}

        {/* Guest Information */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <div className="flex">
              <span className="text-black font-semibold">No. of Adults:</span>
              <span className="ml-2 text-red-600 font-semibold">{data.noOfAdults}</span>
            </div>
            <div className="flex">
              <span className="text-black font-semibold">No. of children under 12 years</span>
              <span className="ml-2 text-red-600 font-semibold">{data.noOfChildren}</span>
            </div>
          </div>
        </div>

        {/* Please Reserve Book Section */}
        <div className="space-y-4 mt-6">
          <div className="text-black font-bold">Please Reserve BOOK</div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex">
                <span className="text-black font-semibold">TWINS:</span>
                <span className="ml-2 text-red-600 font-semibold">{data.twins}</span>
              </div>
              <div className="flex">
                <span className="text-black font-semibold">DOUBLES:</span>
                <span className="ml-2 text-red-600 font-semibold">{data.doubles}</span>
              </div>
              <div className="flex">
                <span className="text-black font-semibold">SINGLES:</span>
                <span className="ml-2 text-red-600 font-semibold">{data.singles}</span>
              </div>
              <div className="flex">
                <span className="text-black font-semibold">TRIPLES:</span>
                <span className="ml-2 text-red-600 font-semibold">{data.triples}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dates Section */}
        <div className="space-y-2 mt-8 border-t-2 border-gray-300 pt-6">
          <div className="flex">
            <span className="text-black font-semibold">Check in:</span>
            <span className="ml-2 text-red-600 font-semibold">{data.checkIn}</span>
          </div>
          <div className="flex">
            <span className="text-black font-semibold">Check out:</span>
            <span className="ml-2 text-red-600 font-semibold">{data.checkOut}</span>
          </div>
          <div className="flex">
            <span className="text-black font-semibold">Number of Nights:</span>
            <span className="ml-2 text-red-600 font-semibold">{data.noOfNights}</span>
          </div>
        </div>

        {/* Remarks */}
        {data.remarks && (
          <div className="space-y-2 border-t-2 border-gray-300 pt-6 mt-8">
            <div className="flex">
              <span className="text-black font-semibold">Remarks:</span>
              <span className="ml-2 text-red-600 font-semibold">{data.remarks}</span>
            </div>
          </div>
        )}

        {/* Signature Section */}
        <div className="space-y-4 border-t-2 border-gray-300 pt-6 mt-12">
          <div className="text-black font-bold text-lg">Signed</div>
          <div className="space-y-1 ml-2">
            <div className="flex">
              <span className="text-black font-semibold">For:</span>
              <span className="ml-2 text-black italic">{data.signedFor || 'Jae Travel Expeditions'}</span>
            </div>
            <div className="flex">
              <span className="text-black font-semibold">Name:</span>
              <span className="ml-2 text-black italic">{data.signedName || 'Antony Waititu'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
