"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function LoanCalculator() {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [result, setResult] = useState(null)

  const calculateLoan = () => {
    const principal = Number.parseFloat(loanAmount)
    const monthlyRate = Number.parseFloat(interestRate) / 100 / 12
    const numberOfPayments = Number.parseFloat(loanTerm) * 12

    const monthlyPayment =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalPayment = monthlyPayment * numberOfPayments
    const totalInterest = totalPayment - principal

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Loan Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Loan Amount ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter loan amount"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.01"
                value={interestRate}
                onChange={(e) => setInterestRate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter interest rate"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Loan Term (years)</label>
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter loan term in years"
              />
            </div>

            <button
              onClick={calculateLoan}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Loan
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Results:</h3>
                <p className="mb-1">
                  Monthly Payment: <span className="font-bold">${result.monthlyPayment}</span>
                </p>
                <p className="mb-1">
                  Total Payment: <span className="font-bold">${result.totalPayment}</span>
                </p>
                <p>
                  Total Interest: <span className="font-bold">${result.totalInterest}</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}
