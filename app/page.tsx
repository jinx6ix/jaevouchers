'use client'

import { useState } from 'react'
import VoucherForm from '@/components/voucher-form'
import VoucherPreview from '@/components/voucher-preview'
import { Card } from '@/components/ui/card'

export interface VoucherData {
  // Default fields (black)
  companyName: string
  voucherNo: string
  date: string

  // User input fields (red)
  hotelName: string
  roomType: string
  clientNames: string
  noOfAdults: string
  noOfChildren: string
  checkIn: string
  checkOut: string
  noOfNights: string
  doubles: string
  twins: string
  singles: string
  triples: string
  remarks: string
  signedFor: string
  signedName: string
}

const defaultVoucherData: VoucherData = {
  companyName: 'Jae Travel Expeditions',
  voucherNo: 'JTE1050626',
  date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
  hotelName: '',
  roomType: '',
  clientNames: '',
  noOfAdults: '',
  noOfChildren: '',
  checkIn: '',
  checkOut: '',
  noOfNights: '',
  doubles: '',
  twins: '',
  singles: '',
  triples: '',
  remarks: '',
  signedFor: '',
  signedName: '',
}

export default function Home() {
  const [voucherData, setVoucherData] = useState<VoucherData>(defaultVoucherData)

  const handleInputChange = (field: keyof VoucherData, value: string) => {
    setVoucherData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleReset = () => {
    setVoucherData(defaultVoucherData)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Travel Voucher Generator</h1>
          <p className="text-slate-600">Fill in the red fields below to generate your travel voucher</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Enter Voucher Details</h2>
            <VoucherForm
              data={voucherData}
              onInputChange={handleInputChange}
              onReset={handleReset}
            />
          </Card>

          {/* Preview Section */}
          <div className="h-full">
            <h2 className="text-2xl font-semibold text-slate-900 mb-6">Voucher Preview</h2>
            <div className="bg-white rounded-lg shadow-lg overflow-auto max-h-[calc(100vh-200px)]">
              <VoucherPreview data={voucherData} />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
