"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function HoursCalculator() {
  const [calculationType, setCalculationType] = useState("timesheet")
  const [entries, setEntries] = useState([
    { startTime: "", endTime: "", breakTime: "" }
  ])
  const [hourlyRate, setHourlyRate] = useState("")
  const [result, setResult] = useState(null)

  const addEntry = () => {
    setEntries([...entries, { startTime: "", endTime: "", breakTime: "" }])
  }

  const removeEntry = (index) => {
    if (entries.length > 1) {
      setEntries(entries.filter((_, i) => i !== index))
    }
  }

  const updateEntry = (index, field, value) => {
    const newEntries = [...entries]
    newEntries[index][field] = value
    setEntries(newEntries)
  }

  const timeToMinutes = (timeString) => {
    if (!timeString) return 0
    const [hours, minutes] = timeString.split(':').map(Number)
    return hours * 60 + minutes
  }

  const minutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}:${mins.toString().padStart(2, '0')}`
  }

  const calculateHours = () => {
    let totalMinutes = 0
    let dailyBreakdown = []

    entries.forEach((entry, index) => {
      if (entry.startTime && entry.endTime) {
        const startMinutes = timeToMinutes(entry.startTime)
        const endMinutes = timeToMinutes(entry.endTime)
        const breakMinutes = parseFloat(entry.breakTime || 0) * 60
        
        let workedMinutes = endMinutes - startMinutes
        
        // Handle overnight shifts
        if (workedMinutes < 0) {
          workedMinutes += 24 * 60 // Add 24 hours
        }
        
        workedMinutes -= breakMinutes
        totalMinutes += Math.max(0, workedMinutes)

        dailyBreakdown.push({
          day: index + 1,
          start: entry.startTime,
          end: entry.endTime,
          break: entry.breakTime || 0,
          workedHours: (workedMinutes / 60).toFixed(2),
          workedTime: minutesToTime(Math.max(0, workedMinutes))
        })
      }
    })

    const totalHours = totalMinutes / 60
    const regularHours = Math.min(totalHours, 40) // Assuming 40 hours is regular
    const overtimeHours = Math.max(0, totalHours - 40)
    
    const rate = parseFloat(hourlyRate || 0)
    const regularPay = regularHours * rate
    const overtimePay = overtimeHours * rate * 1.5 // 1.5x overtime rate
    const totalPay = regularPay + overtimePay

    setResult({
      totalMinutes,
      totalHours: totalHours.toFixed(2),
      totalTime: minutesToTime(totalMinutes),
      regularHours: regularHours.toFixed(2),
      overtimeHours: overtimeHours.toFixed(2),
      regularPay: regularPay.toFixed(2),
      overtimePay: overtimePay.toFixed(2),
      totalPay: totalPay.toFixed(2),
      averagePerDay: entries.length > 0 ? (totalHours / entries.length).toFixed(2) : 0,
      dailyBreakdown
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Hours Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Hourly Rate ($ - optional)</label>
              <input
                type="number"
                step="0.01"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(e.target.value)}
                className="w-full md:w-48 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter hourly rate"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Time Entries</h3>
              
              {entries.map((entry, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Day {index + 1}</h4>
                    {entries.length > 1 && (
                      <button
                        onClick={() => removeEntry(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Start Time</label>
                      <input
                        type="time"
                        value={entry.startTime}
                        onChange={(e) => updateEntry(index, 'startTime', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">End Time</label>
                      <input
                        type="time"
                        value={entry.endTime}
                        onChange={(e) => updateEntry(index, 'endTime', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">Break (hours)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={entry.breakTime}
                        onChange={(e) => updateEntry(index, 'breakTime', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                    
                    <div className="flex items-end">
                      {entry.startTime && entry.endTime && (
                        <div className="text-sm text-gray-600">
                          Worked: {((timeToMinutes(entry.endTime) - timeToMinutes(entry.startTime) - (parseFloat(entry.breakTime || 0) * 60)) / 60).toFixed(2)}h
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <button
                onClick={addEntry}
                className="w-full md:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded font-medium transition-colors"
              >
                + Add Another Day
              </button>
            </div>

            <button
              onClick={calculateHours}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Total Hours
            </button>

            {result && (
              <div className="mt-6 space-y-4">
                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p>Total Hours: <span className="font-bold text-blue-600">{result.totalHours}</span></p>
                      <p>Total Time: <span className="font-bold">{result.totalTime}</span></p>
                      <p>Average per Day: <span className="font-bold">{result.averagePerDay} hours</span></p>
                    </div>
                    <div>
                      <p>Regular Hours (≤40): <span className="font-bold">{result.regularHours}</span></p>
                      <p>Overtime Hours (>40): <span className="font-bold text-orange-600">{result.overtimeHours}</span></p>
                    </div>
                  </div>
                </div>

                {/* Pay Calculation */}
                {hourlyRate && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h3 className="text-lg font-bold mb-2">Pay Calculation</h3>
                    <div className="space-y-1">
                      <p>Regular Pay ({result.regularHours}h × ${hourlyRate}): <span className="font-bold">${result.regularPay}</span></p>
                      {parseFloat(result.overtimeHours) > 0 && (
                        <p>Overtime Pay ({result.overtimeHours}h × ${hourlyRate} × 1.5): <span className="font-bold">${result.overtimePay}</span></p>
                      )}
                      <p className="text-lg border-t pt-2">
                        Total Pay: <span className="font-bold text-green-600">${result.totalPay}</span>
                      </p>
                    </div>
                  </div>
                )}

                {/* Daily Breakdown */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-bold mb-2">Daily Breakdown</h3>
                  <div className="space-y-2">
                    {result.dailyBreakdown.map((day, index) => (
                      <div key={index} className="flex justify-between items-center py-1 border-b border-gray-200 last:border-b-0">
                        <span>Day {day.day}: {day.start} - {day.end}</span>
                        <div className="text-right">
                          <span className="font-bold">{day.workedTime}</span>
                          {day.break > 0 && <span className="text-sm text-gray-600 ml-2">(Break: {day.break}h)</span>}
                        </div>
                      </div>
                    ))}
                  </div>
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