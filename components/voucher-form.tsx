import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { VoucherData } from '@/app/page'

interface VoucherFormProps {
  data: VoucherData
  onInputChange: (field: keyof VoucherData, value: string) => void
  onReset: () => void
}

export default function VoucherForm({ data, onInputChange, onReset }: VoucherFormProps) {
  return (
    <form className="space-y-6">
      {/* Hotel Details */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Hotel Details</h3>
        <div>
          <Label htmlFor="hotelName" className="text-red-600 font-semibold">Hotel Name *</Label>
          <Input
            id="hotelName"
            placeholder="e.g., Golden Tulip"
            value={data.hotelName}
            onChange={(e) => onInputChange('hotelName', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div>
          <Label htmlFor="roomType" className="text-red-600 font-semibold">Room Type *</Label>
          <Input
            id="roomType"
            placeholder="e.g., Standard Room Halfboard"
            value={data.roomType}
            onChange={(e) => onInputChange('roomType', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Client Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Client Information</h3>
        <div>
          <Label htmlFor="clientNames" className="text-red-600 font-semibold">Client Names *</Label>
          <Input
            id="clientNames"
            placeholder="e.g., Niranjana Sundaram x2"
            value={data.clientNames}
            onChange={(e) => onInputChange('clientNames', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="noOfAdults" className="text-red-600 font-semibold">No. of Adults</Label>
            <Input
              id="noOfAdults"
              placeholder="e.g., 02"
              value={data.noOfAdults}
              onChange={(e) => onInputChange('noOfAdults', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="noOfChildren" className="text-red-600 font-semibold">No. of Children</Label>
            <Input
              id="noOfChildren"
              placeholder="Under 12 years"
              value={data.noOfChildren}
              onChange={(e) => onInputChange('noOfChildren', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="text-red-600 font-semibold">Check In *</Label>
            <Input
              id="checkIn"
              placeholder="e.g., 05th June 2026"
              value={data.checkIn}
              onChange={(e) => onInputChange('checkIn', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="checkOut" className="text-red-600 font-semibold">Check Out *</Label>
            <Input
              id="checkOut"
              placeholder="e.g., 06th June 2026"
              value={data.checkOut}
              onChange={(e) => onInputChange('checkOut', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="noOfNights" className="text-red-600 font-semibold">Number of Nights *</Label>
          <Input
            id="noOfNights"
            placeholder="e.g., 01 night"
            value={data.noOfNights}
            onChange={(e) => onInputChange('noOfNights', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Room Configuration */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Room Configuration</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="doubles" className="text-red-600 font-semibold">Doubles</Label>
            <Input
              id="doubles"
              placeholder="e.g., 01 room"
              value={data.doubles}
              onChange={(e) => onInputChange('doubles', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="twins" className="text-red-600 font-semibold">Twins</Label>
            <Input
              id="twins"
              placeholder="e.g., 01 room"
              value={data.twins}
              onChange={(e) => onInputChange('twins', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="singles" className="text-red-600 font-semibold">Singles</Label>
            <Input
              id="singles"
              placeholder="Number of rooms"
              value={data.singles}
              onChange={(e) => onInputChange('singles', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="triples" className="text-red-600 font-semibold">Triples</Label>
            <Input
              id="triples"
              placeholder="Number of rooms"
              value={data.triples}
              onChange={(e) => onInputChange('triples', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Additional Information</h3>
        <div>
          <Label htmlFor="remarks" className="text-red-600 font-semibold">Remarks</Label>
          <Textarea
            id="remarks"
            placeholder="e.g., PLEASE NOTE CLIENT DIETARY REQUEST VEGETARIAN"
            value={data.remarks}
            onChange={(e) => onInputChange('remarks', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
            rows={3}
          />
        </div>
      </div>

      {/* Signature Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Signature</h3>
        <div>
          <Label htmlFor="signedFor" className="text-red-600 font-semibold">Signed For</Label>
          <Input
            id="signedFor"
            placeholder="e.g., Jae Travel Expeditions"
            value={data.signedFor}
            onChange={(e) => onInputChange('signedFor', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div>
          <Label htmlFor="signedName" className="text-red-600 font-semibold">Name</Label>
          <Input
            id="signedName"
            placeholder="e.g., Antony Waititu"
            value={data.signedName}
            onChange={(e) => onInputChange('signedName', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={() => window.print()}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          Print Voucher
        </Button>
      </div>
    </form>
  )
}
