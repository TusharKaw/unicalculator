"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function PaymentCalculator() {
  const [calculationType, setCalculationType] = useState("loan_payment")
  const [loanAmount, setLoanAmount] = useState("")
  const [interestRate, setInterestRate] = useState("")
  const [loanTerm, setLoanTerm] = useState("")
  const [payment, setPayment] = useState("")
  const [presentValue, setPresentValue] = useState("")
  const [futureValue, setFutureValue] = useState("")
  const [periods, setPeriods] = useState("")
  const [paymentFrequency, setPaymentFrequency] = useState("monthly")
  const [result, setResult] = useState(null)

  const getPeriodsPerYear = (frequency) => {
    switch (frequency) {
      case "weekly": return 52
      case "biweekly": return 26
      case "monthly": return 12
      case "quarterly": return 4
      case "annually": return 1
      default: return 12
    }
  }

  const calculateLoanPayment = () => {
    const principal = parseFloat(loanAmount)
    const annualRate = parseFloat(interestRate) / 100
    const years = parseFloat(loanTerm)
    const periodsPerYear = getPeriodsPerYear(paymentFrequency)
    
    const monthlyRate = annualRate / periodsPerYear
    const totalPayments = years * periodsPerYear
    
    let monthlyPayment
    if (monthlyRate === 0) {
      monthlyPayment = principal / totalPayments
    } else {
      monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) / 
                     (Math.pow(1 + monthlyRate, totalPayments) - 1)
    }
    
    const totalPaid = monthlyPayment * totalPayments
    const totalInterest = totalPaid - principal
    
    return {
      payment: monthlyPayment.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      principal: principal.toFixed(2),
      frequency: paymentFrequency,
      periodsPerYear,
      totalPayments
    }
  }

  const calculateLoanAmount = () => {
    const monthlyPayment = parseFloat(payment)
    const annualRate = parseFloat(interestRate) / 100
    const years = parseFloat(loanTerm)
    const periodsPerYear = getPeriodsPerYear(paymentFrequency)
    
    const monthlyRate = annualRate / periodsPerYear
    const totalPayments = years * periodsPerYear
    
    let principal
    if (monthlyRate === 0) {
      principal = monthlyPayment * totalPayments
    } else {
      principal = monthlyPayment * (Math.pow(1 + monthlyRate, totalPayments) - 1) / 
                 (monthlyRate * Math.pow(1 + monthlyRate, totalPayments))
    }
    
    const totalPaid = monthlyPayment * totalPayments
    const totalInterest = totalPaid - principal
    
    return {
      loanAmount: principal.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      payment: monthlyPayment.toFixed(2),
      frequency: paymentFrequency,
      periodsPerYear,
      totalPayments
    }
  }

  const calculateAnnuityPayment = () => {
    const pv = parseFloat(presentValue)
    const fv = parseFloat(futureValue) || 0
    const annualRate = parseFloat(interestRate) / 100
    const periodsPerYear = getPeriodsPerYear(paymentFrequency)
    const rate = annualRate / periodsPerYear
    const nper = parseFloat(periods)
    
    let payment
    if (rate === 0) {
      payment = (fv - pv) / nper
    } else {
      payment = (pv * rate - fv * rate / (Math.pow(1 + rate, nper) - 1)) / 
                (1 - 1 / Math.pow(1 + rate, nper))
    }
    
    const totalPaid = Math.abs(payment) * nper
    const netCost = totalPaid - Math.abs(fv - pv)
    
    return {
      payment: payment.toFixed(2),
      totalPaid: totalPaid.toFixed(2),
      netCost: netCost.toFixed(2),
      presentValue: pv.toFixed(2),
      futureValue: fv.toFixed(2),
      periods: nper,
      frequency: paymentFrequency
    }
  }

  const calculate = () => {
    try {
      let calculationResult
      
      switch (calculationType) {
        case "loan_payment":
          calculationResult = calculateLoanPayment()
          break
        case "loan_amount":
          calculationResult = calculateLoanAmount()
          break
        case "annuity":
          calculationResult = calculateAnnuityPayment()
          break
        default:
          throw new Error("Invalid calculation type")
      }
      
      setResult({ ...calculationResult, type: calculationType })
    } catch (error) {
      setResult({ error: "Please check your input values and try again." })
    }
  }

  const getInputFields = () => {
    switch (calculationType) {
      case "loan_payment":
        return (
          <>
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
                step="0.01"
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
          </>
        )
      
      case "loan_amount":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Payment Amount ($)</label>
              <input
                type="number"
                value={payment}
                onChange={(e) => setPayment(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Enter payment amount"
              />
            </div>
            <div>
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
          </>
        )
      
      case "annuity":
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Present Value ($)</label>
              <input
                type="number"
                value={presentValue}
                onChange={(e) => setPresentValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Current value"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Future Value ($)</label>
              <input
                type="number"
                value={futureValue}
                onChange={(e) => setFutureValue(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Target value (optional)"
              />
            </div>
            <div>
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
            <div>
              <label className="block text-sm font-medium mb-2">Number of Payments</label>
              <input
                type="number"
                value={periods}
                onChange={(e) => setPeriods(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="Total number of payments"
              />
            </div>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Payment Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calculation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What do you want to calculate?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="loan_payment"
                    checked={calculationType === "loan_payment"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Payment Amount</div>
                    <div className="text-sm text-gray-600">Calculate monthly payment</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="loan_amount"
                    checked={calculationType === "loan_amount"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Loan Amount</div>
                    <div className="text-sm text-gray-600">Calculate borrowing capacity</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="annuity"
                    checked={calculationType === "annuity"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Annuity Payment</div>
                    <div className="text-sm text-gray-600">Calculate annuity payments</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Frequency */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Payment Frequency</label>
              <select
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
                className="w-full md:w-48 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="annually">Annually</option>
              </select>
            </div>

            {/* Input Fields */}
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getInputFields()}
              </div>
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Payment
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Main Result */}
                    {result.type === "loan_payment" && (
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h3 className="text-lg font-bold mb-2">Required Payment</h3>
                        <p className="text-3xl font-bold text-blue-600">
                          ${result.payment}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          per {result.frequency.replace('ly', '')} payment
                        </p>
                      </div>
                    )}

                    {result.type === "loan_amount" && (
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <h3 className="text-lg font-bold mb-2">Maximum Loan Amount</h3>
                        <p className="text-3xl font-bold text-green-600">
                          ${result.loanAmount}
                        </p>
                        <p className="text-sm text-gray-600">
                          With ${result.payment} {result.frequency} payments
                        </p>
                      </div>
                    )}

                    {result.type === "annuity" && (
                      <div className="p-4 bg-purple-50 rounded-lg text-center">
                        <h3 className="text-lg font-bold mb-2">Required Payment</h3>
                        <p className="text-3xl font-bold text-purple-600">
                          ${Math.abs(parseFloat(result.payment)).toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-600 capitalize">
                          per {result.frequency.replace('ly', '')} payment
                        </p>
                      </div>
                    )}

                    {/* Details */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-bold mb-3">Payment Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {result.type === "loan_payment" && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Loan Amount</p>
                              <p className="font-bold">${result.principal}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Payments</p>
                              <p className="font-bold">{result.totalPayments}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="font-bold">${result.totalPaid}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Interest</p>
                              <p className="font-bold text-red-600">${result.totalInterest}</p>
                            </div>
                          </>
                        )}

                        {result.type === "loan_amount" && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Payment Amount</p>
                              <p className="font-bold">${result.payment}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Payments</p>
                              <p className="font-bold">{result.totalPayments}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="font-bold">${result.totalPaid}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Interest</p>
                              <p className="font-bold text-red-600">${result.totalInterest}</p>
                            </div>
                          </>
                        )}

                        {result.type === "annuity" && (
                          <>
                            <div>
                              <p className="text-sm text-gray-600">Present Value</p>
                              <p className="font-bold">${result.presentValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Future Value</p>
                              <p className="font-bold">${result.futureValue}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Payments</p>
                              <p className="font-bold">{result.periods}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600">Total Paid</p>
                              <p className="font-bold">${result.totalPaid}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Information */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Payment Calculator Types</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Loan Payment:</h4>
                <ul className="space-y-1">
                  <li>• Calculate monthly payment amount</li>
                  <li>• Based on loan amount, rate, and term</li>
                  <li>• Useful for budgeting</li>
                  <li>• Shows total interest cost</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Loan Amount:</h4>
                <ul className="space-y-1">
                  <li>• Calculate maximum borrowing capacity</li>
                  <li>• Based on affordable payment</li>
                  <li>• Helps determine budget</li>
                  <li>• Useful for pre-approval estimates</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Annuity Payment:</h4>
                <ul className="space-y-1">
                  <li>• Calculate required periodic payments</li>
                  <li>• For savings or investment goals</li>
                  <li>• Retirement planning</li>
                  <li>• Present/future value calculations</li>
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