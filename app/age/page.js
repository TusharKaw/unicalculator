"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("")
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split("T")[0])
  const [result, setResult] = useState(null)

  const calculateAge = () => {
    const birth = new Date(birthDate)
    const target = new Date(targetDate)

    let years = target.getFullYear() - birth.getFullYear()
    let months = target.getMonth() - birth.getMonth()
    let days = target.getDate() - birth.getDate()

    if (days < 0) {
      months--
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0)
      days += lastMonth.getDate()
    }

    if (months < 0) {
      years--
      months += 12
    }

    const totalDays = Math.floor((target - birth) / (1000 * 60 * 60 * 24))
    const totalWeeks = Math.floor(totalDays / 7)
    const totalMonths = years * 12 + months

    setResult({
      years,
      months,
      days,
      totalDays,
      totalWeeks,
      totalMonths,
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Age Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Birth Date</label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculate Age On</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              onClick={calculateAge}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Age
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Age:</h3>
                <p className="text-xl mb-2">
                  <span className="font-bold">{result.years}</span> years,
                  <span className="font-bold"> {result.months}</span> months,
                  <span className="font-bold"> {result.days}</span> days
                </p>
                <div className="text-sm text-gray-600">
                  <p>Total Days: {result.totalDays}</p>
                  <p>Total Weeks: {result.totalWeeks}</p>
                  <p>Total Months: {result.totalMonths}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}
