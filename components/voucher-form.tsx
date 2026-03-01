import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { VoucherData } from '@/lib/types'   // ← make sure this path is correct

interface VoucherFormProps {
  data: VoucherData
  onChange: (field: keyof VoucherData, value: string) => void
  onReset: () => void
}

export default function VoucherForm({ data, onChange, onReset }: VoucherFormProps) {
  const handleDownload = async () => {
    try {
      const voucherDataForAPI = {
        voucherNo: data.voucherNo || `V-${Date.now().toString().slice(-6)}`,
        date: data.date || new Date().toLocaleDateString('en-GB'),
        hotelName: data.hotelName || '',
        roomType: data.roomType || '',
        clients: data.clients || '',
        adults: data.adults || '0',
        children: data.children || '0',
        doubles: data.doubles || '0',
        checkIn: data.checkIn || '',
        checkOut: data.checkOut || '',
        nights: data.nights || '',
        remarks: data.remarks || '',
        agentName: data.agentName || 'Antony Waititu',
      }

      console.log('Sending download request with:', voucherDataForAPI)

      const response = await fetch('/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voucherDataForAPI),
      })

      if (!response.ok) {
        let errorMessage = `Server error (${response.status})`
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {}
        throw new Error(errorMessage)
      }

      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/pdf')) {
        throw new Error('Server did not return a PDF file')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `voucher-${voucherDataForAPI.voucherNo}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      alert(
        error instanceof Error
          ? error.message
          : 'Failed to generate/download the PDF. Please check the form and try again.'
      )
    }
  }

  return (
    <form className="space-y-6">
      {/* Voucher Basics */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Voucher Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="voucherNo" className="text-red-600 font-semibold">
              Voucher No *
            </Label>
            <Input
              id="voucherNo"
              placeholder="e.g. V2025-078"
              value={data.voucherNo || ''}
              onChange={(e) => onChange('voucherNo', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="date" className="text-red-600 font-semibold">
              Date *
            </Label>
            <Input
              id="date"
              placeholder="e.g. 01 June 2025"
              value={data.date || ''}
              onChange={(e) => onChange('date', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Hotel */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Hotel Details</h3>
        <div>
          <Label htmlFor="hotelName" className="text-red-600 font-semibold">
            Hotel Name *
          </Label>
          <Input
            id="hotelName"
            placeholder="e.g. Golden Tulip"
            value={data.hotelName || ''}
            onChange={(e) => onChange('hotelName', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div>
          <Label htmlFor="roomType" className="text-red-600 font-semibold">
            Room Type *
          </Label>
          <Input
            id="roomType"
            placeholder="e.g. Standard Room Halfboard"
            value={data.roomType || ''}
            onChange={(e) => onChange('roomType', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Clients */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Client Information</h3>
        <div>
          <Label htmlFor="clients" className="text-red-600 font-semibold">
            Clients / Guest Names *
          </Label>
          <Input
            id="clients"
            placeholder="e.g. Niranjana Sundaram x2, Family Smith"
            value={data.clients || ''}
            onChange={(e) => onChange('clients', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="adults" className="text-red-600 font-semibold">
              No. of Adults
            </Label>
            <Input
              id="adults"
              placeholder="e.g. 2"
              value={data.adults || ''}
              onChange={(e) => onChange('adults', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="children" className="text-red-600 font-semibold">
              No. of Children (under 12)
            </Label>
            <Input
              id="children"
              placeholder="e.g. 1"
              value={data.children || ''}
              onChange={(e) => onChange('children', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
      </div>

      {/* Dates */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Travel Dates</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkIn" className="text-red-600 font-semibold">
              Check In *
            </Label>
            <Input
              id="checkIn"
              placeholder="e.g. 05 June 2026"
              value={data.checkIn || ''}
              onChange={(e) => onChange('checkIn', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
          <div>
            <Label htmlFor="checkOut" className="text-red-600 font-semibold">
              Check Out *
            </Label>
            <Input
              id="checkOut"
              placeholder="e.g. 08 June 2026"
              value={data.checkOut || ''}
              onChange={(e) => onChange('checkOut', e.target.value)}
              className="mt-1 border-red-300 focus:border-red-500"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="nights" className="text-red-600 font-semibold">
            Number of Nights *
          </Label>
          <Input
            id="nights"
            placeholder="e.g. 3 nights"
            value={data.nights || ''}
            onChange={(e) => onChange('nights', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Rooms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Room Configuration</h3>
        <div>
          <Label htmlFor="doubles" className="text-red-600 font-semibold">
            Number of Double Rooms
          </Label>
          <Input
            id="doubles"
            placeholder="e.g. 1"
            value={data.doubles || ''}
            onChange={(e) => onChange('doubles', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Remarks */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Additional Information</h3>
        <div>
          <Label htmlFor="remarks" className="text-red-600 font-semibold">
            Remarks / Special Requests
          </Label>
          <Textarea
            id="remarks"
            placeholder="e.g. PLEASE NOTE CLIENT DIETARY REQUEST VEGETARIAN"
            value={data.remarks || ''}
            onChange={(e) => onChange('remarks', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
            rows={3}
          />
        </div>
      </div>

      {/* Agent */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-red-600">Prepared By</h3>
        <div>
          <Label htmlFor="agentName" className="text-red-600 font-semibold">
            Agent Name
          </Label>
          <Input
            id="agentName"
            placeholder="e.g. Antony Waititu"
            value={data.agentName || ''}
            onChange={(e) => onChange('agentName', e.target.value)}
            className="mt-1 border-red-300 focus:border-red-500"
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={onReset}
          className="flex-1"
        >
          Reset Form
        </Button>
      </div>
    </form>
  )
}