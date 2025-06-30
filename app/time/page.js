"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function TimeCalculator() {
  const [calculationType, setCalculationType] = useState("add_subtract")
  
  // Add/Subtract time
  const [time1Hours, setTime1Hours] = useState("")
  const [time1Minutes, setTime1Minutes] = useState("")
  const [time1Seconds, setTime1Seconds] = useState("")
  const [time2Hours, setTime2Hours] = useState("")
  const [time2Minutes, setTime2Minutes] = useState("")
  const [time2Seconds, setTime2Seconds] = useState("")
  const [operation, setOperation] = useState("add")
  
  // Time difference
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  
  const [result, setResult] = useState(null)

  const timeToSeconds = (hours, minutes, seconds) => {
    return (parseInt(hours || 0) * 3600) + (parseInt(minutes || 0) * 60) + parseInt(seconds || 0)
  }

  const secondsToTime = (totalSeconds) => {
    const hours = Math.floor(Math.abs(totalSeconds) / 3600)
    const minutes = Math.floor((Math.abs(totalSeconds) % 3600) / 60)
    const seconds = Math.abs(totalSeconds) % 60
    const sign = totalSeconds < 0 ? '-' : ''
    
    return {
      formatted: `${sign}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      hours,
      minutes,
      seconds,
      totalSeconds: Math.abs(totalSeconds),
      isNegative: totalSeconds < 0
    }
  }

  const calculateTime = () => {
    if (calculationType === "add_subtract") {
      const seconds1 = timeToSeconds(time1Hours, time1Minutes, time1Seconds)
      const seconds2 = timeToSeconds(time2Hours, time2Minutes, time2Seconds)
      
      let resultSeconds
      if (operation === "add") {
        resultSeconds = seconds1 + seconds2
      } else {
        resultSeconds = seconds1 - seconds2
      }
      
      const timeResult = secondsToTime(resultSeconds)
      const time1Formatted = secondsToTime(seconds1)
      const time2Formatted = secondsToTime(seconds2)
      
      setResult({
        type: "Time Arithmetic",
        operation: operation === "add" ? "Addition" : "Subtraction",
        time1: time1Formatted.formatted,
        time2: time2Formatted.formatted,
        result: timeResult.formatted,
        resultBreakdown: timeResult,
        totalSeconds: resultSeconds
      })
    } else {
      // Time difference calculation
      let start, end
      
      if (startDate && endDate) {
        start = new Date(`${startDate}T${startTime || '00:00:00'}`)
        end = new Date(`${endDate}T${endTime || '00:00:00'}`)
      } else {
        // Same day calculation
        const today = new Date().toISOString().split('T')[0]
        start = new Date(`${today}T${startTime}`)
        end = new Date(`${today}T${endTime}`)
        
        // Handle overnight calculation
        if (end < start) {
          end.setDate(end.getDate() + 1)
        }
      }
      
      const diffInMs = end - start
      const diffInSeconds = Math.floor(diffInMs / 1000)
      const diffInMinutes = Math.floor(diffInSeconds / 60)
      const diffInHours = Math.floor(diffInMinutes / 60)
      const diffInDays = Math.floor(diffInHours / 24)
      
      const timeResult = secondsToTime(diffInSeconds)
      
      setResult({
        type: "Time Difference",
        startDateTime: start.toLocaleString(),
        endDateTime: end.toLocaleString(),
        result: timeResult.formatted,
        resultBreakdown: timeResult,
        totalDays: diffInDays,
        totalHours: diffInHours,
        totalMinutes: diffInMinutes,
        totalSeconds: diffInSeconds
      })
    }
  }

  const getCurrentTime = () => {
    const now = new Date()
    return now.toTimeString().slice(0, 8)
  }

  const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Time Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculation Type</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="add_subtract">Add or Subtract Time</option>
                <option value="difference">Time Difference</option>
              </select>
            </div>

            {calculationType === "add_subtract" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Operation</label>
                  <select
                    value={operation}
                    onChange={(e) => setOperation(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  >
                    <option value="add">Add (+)</option>
                    <option value="subtract">Subtract (-)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">First Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={time1Hours}
                      onChange={(e) => setTime1Hours(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Hours"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={time1Minutes}
                      onChange={(e) => setTime1Minutes(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Minutes"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={time1Seconds}
                      onChange={(e) => setTime1Seconds(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Seconds"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Second Time</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="number"
                      min="0"
                      value={time2Hours}
                      onChange={(e) => setTime2Hours(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Hours"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={time2Minutes}
                      onChange={(e) => setTime2Minutes(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Minutes"
                    />
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={time2Seconds}
                      onChange={(e) => setTime2Seconds(e.target.value)}
                      className="p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Seconds"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date (optional)</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Time</label>
                    <input
                      type="time"
                      step="1"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">End Date (optional)</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Time</label>
                    <input
                      type="time"
                      step="1"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      setStartTime(getCurrentTime())
                      setStartDate(getCurrentDate())
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Set Start to Now
                  </button>
                  <button
                    onClick={() => {
                      setEndTime(getCurrentTime())
                      setEndDate(getCurrentDate())
                    }}
                    className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
                  >
                    Set End to Now
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={calculateTime}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Time
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{result.type}</h3>
                
                {result.type === "Time Arithmetic" ? (
                  <div className="space-y-2">
                    <p>Operation: <span className="font-bold">{result.operation}</span></p>
                    <p>First Time: <span className="font-bold">{result.time1}</span></p>
                    <p>Second Time: <span className="font-bold">{result.time2}</span></p>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xl">
                        Result: <span className={`font-bold ${result.resultBreakdown.isNegative ? 'text-red-600' : 'text-green-600'}`}>
                          {result.result}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600">
                        ({result.resultBreakdown.hours} hours, {result.resultBreakdown.minutes} minutes, {result.resultBreakdown.seconds} seconds)
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p>Start: <span className="font-bold">{result.startDateTime}</span></p>
                    <p>End: <span className="font-bold">{result.endDateTime}</span></p>
                    <div className="border-t pt-2 mt-2">
                      <p className="text-xl">
                        Difference: <span className="font-bold text-blue-600">{result.result}</span>
                      </p>
                    </div>
                    <div className="mt-3 text-sm space-y-1">
                      <p>Total Days: <span className="font-bold">{result.totalDays.toLocaleString()}</span></p>
                      <p>Total Hours: <span className="font-bold">{result.totalHours.toLocaleString()}</span></p>
                      <p>Total Minutes: <span className="font-bold">{result.totalMinutes.toLocaleString()}</span></p>
                      <p>Total Seconds: <span className="font-bold">{result.totalSeconds.toLocaleString()}</span></p>
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