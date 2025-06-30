"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function MortgageCalculator() {
  const [homePrice, setHomePrice] = useState("")
  const [downPayment, setDownPayment] = useState("")
  const [loanTerm, setLoanTerm] = useState("30")
  const [interestRate, setInterestRate] = useState("")
  const [propertyTax, setPropertyTax] = useState("")
  const [insurance, setInsurance] = useState("")
  const [pmi, setPmi] = useState("")
  const [result, setResult] = useState(null)

  const calculateMortgage = () => {
    const price = parseFloat(homePrice)
    const down = parseFloat(downPayment)
    const principal = price - down
    const monthlyRate = parseFloat(interestRate) / 100 / 12
    const numberOfPayments = parseFloat(loanTerm) * 12
    const monthlyTax = parseFloat(propertyTax || 0) / 12
    const monthlyInsurance = parseFloat(insurance || 0) / 12
    const monthlyPmi = parseFloat(pmi || 0) / 12

    const monthlyPI = (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1)

    const totalMonthlyPayment = monthlyPI + monthlyTax + monthlyInsurance + monthlyPmi
    const totalPayment = monthlyPI * numberOfPayments
    const totalInterest = totalPayment - principal

    setResult({
      monthlyPI: monthlyPI.toFixed(2),
      monthlyTax: monthlyTax.toFixed(2),
      monthlyInsurance: monthlyInsurance.toFixed(2),
      monthlyPmi: monthlyPmi.toFixed(2),
      totalMonthlyPayment: totalMonthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      loanAmount: principal.toFixed(2)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Mortgage Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Home Price ($)</label>
                <input
                  type="number"
                  value={homePrice}
                  onChange={(e) => setHomePrice(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter home price"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Down Payment ($)</label>
                <input
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter down payment"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Loan Term (years)</label>
                <select
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="15">15 years</option>
                  <option value="20">20 years</option>
                  <option value="25">25 years</option>
                  <option value="30">30 years</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter interest rate"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Property Tax ($/year)</label>
                <input
                  type="number"
                  value={propertyTax}
                  onChange={(e) => setPropertyTax(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter annual property tax"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Home Insurance ($/year)</label>
                <input
                  type="number"
                  value={insurance}
                  onChange={(e) => setInsurance(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter annual insurance"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">PMI ($/month)</label>
              <input
                type="number"
                value={pmi}
                onChange={(e) => setPmi(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter monthly PMI"
              />
            </div>

            <button
              onClick={calculateMortgage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Mortgage
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Results:</h3>
                <div className="space-y-2">
                  <p>Loan Amount: <span className="font-bold">${result.loanAmount}</span></p>
                  <p>Monthly Principal & Interest: <span className="font-bold">${result.monthlyPI}</span></p>
                  <p>Monthly Property Tax: <span className="font-bold">${result.monthlyTax}</span></p>
                  <p>Monthly Insurance: <span className="font-bold">${result.monthlyInsurance}</span></p>
                  <p>Monthly PMI: <span className="font-bold">${result.monthlyPmi}</span></p>
                  <p className="text-lg border-t pt-2">
                    Total Monthly Payment: <span className="font-bold text-green-600">${result.totalMonthlyPayment}</span>
                  </p>
                  <p>Total Payment: <span className="font-bold">${result.totalPayment}</span></p>
                  <p>Total Interest: <span className="font-bold">${result.totalInterest}</span></p>
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