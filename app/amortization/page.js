"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function AmortizationCalculator() {
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [startDate, setStartDate] = useState("")
  const [result, setResult] = useState(null)

  const calculateAmortization = () => {
    const principal = parseFloat(loanAmount)
    const annualRate = parseFloat(interestRate) / 100
    const years = parseFloat(loanTerm)
    const monthlyRate = annualRate / 12
    const numberOfPayments = years * 12

    if (principal <= 0 || annualRate < 0 || years <= 0) {
      setResult({ error: "Please enter valid positive numbers" })
      return
    }

    // Calculate monthly payment
    let monthlyPayment
    if (monthlyRate === 0) {
      monthlyPayment = principal / numberOfPayments
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                     (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    }

    // Generate amortization schedule
    let balance = principal
    const schedule = []
    let totalInterest = 0
    let totalPrincipal = 0

    const startMonth = startDate ? new Date(startDate) : new Date()

    for (let month = 1; month <= numberOfPayments; month++) {
      const interestPayment = balance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment
      balance = Math.max(0, balance - principalPayment)

      totalInterest += interestPayment
      totalPrincipal += principalPayment

      const paymentDate = new Date(startMonth)
      paymentDate.setMonth(paymentDate.getMonth() + month - 1)

      schedule.push({
        payment: month,
        date: paymentDate.toLocaleDateString(),
        monthlyPayment: monthlyPayment.toFixed(2),
        principal: principalPayment.toFixed(2),
        interest: interestPayment.toFixed(2),
        balance: balance.toFixed(2),
        cumulativeInterest: totalInterest.toFixed(2),
        cumulativePrincipal: totalPrincipal.toFixed(2)
      })

      if (balance <= 0.01) break
    }

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: (monthlyPayment * numberOfPayments).toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalPrincipal: totalPrincipal.toFixed(2),
      schedule,
      summary: {
        loanAmount: principal.toFixed(2),
        interestRate: annualRate.toFixed(3),
        loanTerm: years,
        numberOfPayments: numberOfPayments
      }
    })
  }

  const exportSchedule = () => {
    if (!result || !result.schedule) return

    const headers = "Payment,Date,Payment Amount,Principal,Interest,Balance,Cumulative Interest,Cumulative Principal\n"
    const csvContent = headers + result.schedule.map(row => 
      `${row.payment},${row.date},${row.monthlyPayment},${row.principal},${row.interest},${row.balance},${row.cumulativeInterest},${row.cumulativePrincipal}`
    ).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'amortization_schedule.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Amortization Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Loan Amount ($)</label>
                <input
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter loan amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
                <input
                  type="number"
                  step="0.001"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter interest rate"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Loan Term (years)</label>
                <input
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter loan term"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date (optional)</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <button
              onClick={calculateAmortization}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Generate Amortization Schedule
            </button>

            {result && (
              <div className="mt-6">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Summary */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Loan Summary</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Monthly Payment</p>
                          <p className="text-xl font-bold text-blue-600">${result.monthlyPayment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Payment</p>
                          <p className="text-xl font-bold">${result.totalPayment}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Interest</p>
                          <p className="text-xl font-bold text-red-600">${result.totalInterest}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Principal</p>
                          <p className="text-xl font-bold text-green-600">${result.totalPrincipal}</p>
                        </div>
                      </div>
                    </div>

                    {/* Export Button */}
                    <div className="flex justify-end">
                      <button
                        onClick={exportSchedule}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                      >
                        Export to CSV
                      </button>
                    </div>

                    {/* Amortization Schedule */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Amortization Schedule</h3>
                      <div className="overflow-x-auto max-h-96">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-200 sticky top-0">
                            <tr>
                              <th className="p-2 text-left">#</th>
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-right">Payment</th>
                              <th className="p-2 text-right">Principal</th>
                              <th className="p-2 text-right">Interest</th>
                              <th className="p-2 text-right">Balance</th>
                              <th className="p-2 text-right">Cum. Interest</th>
                            </tr>
                          </thead>
                          <tbody>
                            {result.schedule.map((payment, index) => (
                              <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="p-2">{payment.payment}</td>
                                <td className="p-2">{payment.date}</td>
                                <td className="p-2 text-right">${payment.monthlyPayment}</td>
                                <td className="p-2 text-right text-green-600">${payment.principal}</td>
                                <td className="p-2 text-right text-red-600">${payment.interest}</td>
                                <td className="p-2 text-right font-mono">${payment.balance}</td>
                                <td className="p-2 text-right">${payment.cumulativeInterest}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Understanding Amortization</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ul className="space-y-1">
                  <li>• Early payments have more interest, less principal</li>
                  <li>• Later payments have more principal, less interest</li>
                  <li>• Total payment amount stays the same</li>
                  <li>• Balance decreases over time</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Benefits:</h4>
                <ul className="space-y-1">
                  <li>• See exact payment breakdown</li>
                  <li>• Plan for extra principal payments</li>
                  <li>• Track remaining balance</li>
                  <li>• Understand total interest cost</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}