"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function InterestCalculator() {
  const [principal, setPrincipal] = useState("")
  const [rate, setRate] = useState("")
  const [time, setTime] = useState("")
  const [compoundFrequency, setCompoundFrequency] = useState("1")
  const [interestType, setInterestType] = useState("simple")
  const [result, setResult] = useState(null)

  const calculateInterest = () => {
    const p = parseFloat(principal)
    const r = parseFloat(rate) / 100
    const t = parseFloat(time)

    if (interestType === "simple") {
      const interest = p * r * t
      const amount = p + interest
      setResult({
        interest: interest.toFixed(2),
        amount: amount.toFixed(2),
        type: "Simple Interest"
      })
    } else {
      const n = parseFloat(compoundFrequency)
      const amount = p * Math.pow((1 + r / n), n * t)
      const interest = amount - p
      setResult({
        interest: interest.toFixed(2),
        amount: amount.toFixed(2),
        type: "Compound Interest"
      })
    }
  }

  const getFrequencyText = (freq) => {
    switch (freq) {
      case "1": return "Annually"
      case "2": return "Semi-annually"
      case "4": return "Quarterly"
      case "12": return "Monthly"
      case "52": return "Weekly"
      case "365": return "Daily"
      default: return "Annually"
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Interest Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Interest Type</label>
              <select
                value={interestType}
                onChange={(e) => setInterestType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="simple">Simple Interest</option>
                <option value="compound">Compound Interest</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Principal Amount ($)</label>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter principal amount"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter interest rate"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Time Period (years)</label>
              <input
                type="number"
                step="0.1"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter time period"
              />
            </div>

            {interestType === "compound" && (
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="1">Annually</option>
                  <option value="2">Semi-annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="52">Weekly</option>
                  <option value="365">Daily</option>
                </select>
              </div>
            )}

            <button
              onClick={calculateInterest}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Interest
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Results ({result.type}):</h3>
                <p className="mb-1">
                  Principal: <span className="font-bold">${principal}</span>
                </p>
                <p className="mb-1">
                  Interest Rate: <span className="font-bold">{rate}%</span>
                </p>
                <p className="mb-1">
                  Time Period: <span className="font-bold">{time} years</span>
                </p>
                {interestType === "compound" && (
                  <p className="mb-1">
                    Compounding: <span className="font-bold">{getFrequencyText(compoundFrequency)}</span>
                  </p>
                )}
                <div className="border-t pt-2 mt-2">
                  <p className="mb-1">
                    Interest Earned: <span className="font-bold text-green-600">${result.interest}</span>
                  </p>
                  <p>
                    Total Amount: <span className="font-bold text-blue-600">${result.amount}</span>
                  </p>
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