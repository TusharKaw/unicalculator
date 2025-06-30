"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function DateCalculator() {
  const [calculationType, setCalculationType] = useState("difference")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [baseDate, setBaseDate] = useState("")
  const [years, setYears] = useState("")
  const [months, setMonths] = useState("")
  const [days, setDays] = useState("")
  const [result, setResult] = useState(null)

  const calculateDate = () => {
    if (calculationType === "difference") {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      const timeDifference = Math.abs(end - start)
      const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
      const weeksDifference = Math.floor(daysDifference / 7)
      const monthsDifference = Math.abs((end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()))
      const yearsDifference = Math.abs(end.getFullYear() - start.getFullYear())

      // Calculate exact years, months, days
      let exactYears = end.getFullYear() - start.getFullYear()
      let exactMonths = end.getMonth() - start.getMonth()
      let exactDays = end.getDate() - start.getDate()

      if (exactDays < 0) {
        exactMonths--
        const lastMonth = new Date(end.getFullYear(), end.getMonth(), 0)
        exactDays += lastMonth.getDate()
      }

      if (exactMonths < 0) {
        exactYears--
        exactMonths += 12
      }

      setResult({
        type: "Date Difference",
        days: daysDifference,
        weeks: weeksDifference,
        months: monthsDifference,
        years: yearsDifference,
        exactYears: Math.abs(exactYears),
        exactMonths: Math.abs(exactMonths),
        exactDays: Math.abs(exactDays),
        startFormatted: start.toLocaleDateString(),
        endFormatted: end.toLocaleDateString()
      })
    } else {
      const base = new Date(baseDate)
      const yearsToAdd = parseInt(years || 0)
      const monthsToAdd = parseInt(months || 0)
      const daysToAdd = parseInt(days || 0)

      const newDate = new Date(base)
      newDate.setFullYear(newDate.getFullYear() + yearsToAdd)
      newDate.setMonth(newDate.getMonth() + monthsToAdd)
      newDate.setDate(newDate.getDate() + daysToAdd)

      setResult({
        type: "Date Addition",
        baseDate: base.toLocaleDateString(),
        resultDate: newDate.toLocaleDateString(),
        addedYears: yearsToAdd,
        addedMonths: monthsToAdd,
        addedDays: daysToAdd,
        dayOfWeek: newDate.toLocaleDateString('en-US', { weekday: 'long' })
      })
    }
  }

  const getTodayDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Date Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculation Type</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="difference">Calculate difference between two dates</option>
                <option value="addition">Add time to a date</option>
              </select>
            </div>

            {calculationType === "difference" ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setStartDate(getTodayDate())}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Set Start to Today
                  </button>
                  <button
                    onClick={() => setEndDate(getTodayDate())}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Set End to Today
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Base Date</label>
                  <input
                    type="date"
                    value={baseDate}
                    onChange={(e) => setBaseDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setBaseDate(getTodayDate())}
                    className="mt-1 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Set to Today
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Years to Add</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Months to Add</label>
                    <input
                      type="number"
                      value={months}
                      onChange={(e) => setMonths(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Days to Add</label>
                    <input
                      type="number"
                      value={days}
                      onChange={(e) => setDays(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={calculateDate}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{result.type}</h3>
                
                {result.type === "Date Difference" ? (
                  <div className="space-y-2">
                    <p>From: <span className="font-bold">{result.startFormatted}</span></p>
                    <p>To: <span className="font-bold">{result.endFormatted}</span></p>
                    
                    <div className="border-t pt-2 mt-3">
                      <p className="text-lg font-bold text-blue-600">
                        Exact Difference: {result.exactYears} years, {result.exactMonths} months, {result.exactDays} days
                      </p>
                    </div>
                    
                    <div className="mt-3 space-y-1">
                      <p>Total Days: <span className="font-bold">{result.days.toLocaleString()}</span></p>
                      <p>Total Weeks: <span className="font-bold">{result.weeks.toLocaleString()}</span></p>
                      <p>Total Months: <span className="font-bold">{result.months}</span></p>
                      <p>Total Years: <span className="font-bold">{result.years}</span></p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Base Date: <span className="font-bold">{result.baseDate}</span></p>
                    
                    {(result.addedYears !== 0 || result.addedMonths !== 0 || result.addedDays !== 0) && (
                      <div className="mt-2">
                        <p>Added:</p>
                        <ul className="ml-4 space-y-1">
                          {result.addedYears !== 0 && <li>Years: <span className="font-bold">{result.addedYears}</span></li>}
                          {result.addedMonths !== 0 && <li>Months: <span className="font-bold">{result.addedMonths}</span></li>}
                          {result.addedDays !== 0 && <li>Days: <span className="font-bold">{result.addedDays}</span></li>}
                        </ul>
                      </div>
                    )}
                    
                    <div className="border-t pt-2 mt-3">
                      <p className="text-lg font-bold text-green-600">
                        Result Date: {result.resultDate}
                      </p>
                      <p>Day of Week: <span className="font-bold">{result.dayOfWeek}</span></p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}