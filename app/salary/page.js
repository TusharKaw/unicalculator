"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function SalaryCalculator() {
  const [salary, setSalary] = useState("")
  const [payPeriod, setPayPeriod] = useState("annual")
  const [hoursPerWeek, setHoursPerWeek] = useState("40")
  const [result, setResult] = useState(null)

  const calculateSalary = () => {
    const salaryAmount = Number.parseFloat(salary)
    const hours = Number.parseFloat(hoursPerWeek)

    let annual, monthly, biweekly, weekly, daily, hourly

    switch (payPeriod) {
      case "annual":
        annual = salaryAmount
        break
      case "monthly":
        annual = salaryAmount * 12
        break
      case "biweekly":
        annual = salaryAmount * 26
        break
      case "weekly":
        annual = salaryAmount * 52
        break
      case "daily":
        annual = salaryAmount * 260 // 52 weeks * 5 days
        break
      case "hourly":
        annual = salaryAmount * hours * 52
        break
      default:
        annual = salaryAmount
    }

    monthly = annual / 12
    biweekly = annual / 26
    weekly = annual / 52
    daily = annual / 260
    hourly = annual / (hours * 52)

    setResult({
      annual: annual.toFixed(2),
      monthly: monthly.toFixed(2),
      biweekly: biweekly.toFixed(2),
      weekly: weekly.toFixed(2),
      daily: daily.toFixed(2),
      hourly: hourly.toFixed(2),
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Salary Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Salary Amount</label>
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter salary amount"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Pay Period</label>
              <select
                value={payPeriod}
                onChange={(e) => setPayPeriod(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="annual">Annual</option>
                <option value="monthly">Monthly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="weekly">Weekly</option>
                <option value="daily">Daily</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Hours per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter hours per week"
              />
            </div>

            <button
              onClick={calculateSalary}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Salary
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Salary Breakdown:</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p>
                      Annual: <span className="font-bold">${result.annual}</span>
                    </p>
                    <p>
                      Monthly: <span className="font-bold">${result.monthly}</span>
                    </p>
                    <p>
                      Bi-weekly: <span className="font-bold">${result.biweekly}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Weekly: <span className="font-bold">${result.weekly}</span>
                    </p>
                    <p>
                      Daily: <span className="font-bold">${result.daily}</span>
                    </p>
                    <p>
                      Hourly: <span className="font-bold">${result.hourly}</span>
                    </p>
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
