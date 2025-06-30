"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function SalesTaxCalculator() {
  const [calculationType, setCalculationType] = useState("add_tax")
  const [amount, setAmount] = useState("")
  const [taxRate, setTaxRate] = useState("")
  const [totalWithTax, setTotalWithTax] = useState("")
  const [result, setResult] = useState(null)

  // Common tax rates by state (sample data)
  const commonTaxRates = {
    "Alabama": 4.00,
    "Alaska": 0.00,
    "Arizona": 5.60,
    "Arkansas": 6.50,
    "California": 7.25,
    "Colorado": 2.90,
    "Connecticut": 6.35,
    "Delaware": 0.00,
    "Florida": 6.00,
    "Georgia": 4.00,
    "Hawaii": 4.17,
    "Idaho": 6.00,
    "Illinois": 6.25,
    "Indiana": 7.00,
    "Iowa": 6.00,
    "Kansas": 6.50,
    "Kentucky": 6.00,
    "Louisiana": 4.45,
    "Maine": 5.50,
    "Maryland": 6.00,
    "Massachusetts": 6.25,
    "Michigan": 6.00,
    "Minnesota": 6.88,
    "Mississippi": 7.07,
    "Missouri": 4.23,
    "Montana": 0.00,
    "Nebraska": 5.50,
    "Nevada": 6.85,
    "New Hampshire": 0.00,
    "New Jersey": 6.63,
    "New Mexico": 5.13,
    "New York": 8.00,
    "North Carolina": 4.75,
    "North Dakota": 5.00,
    "Ohio": 5.75,
    "Oklahoma": 4.50,
    "Oregon": 0.00,
    "Pennsylvania": 6.00,
    "Rhode Island": 7.00,
    "South Carolina": 6.00,
    "South Dakota": 4.50,
    "Tennessee": 7.00,
    "Texas": 6.25,
    "Utah": 5.95,
    "Vermont": 6.00,
    "Virginia": 5.30,
    "Washington": 6.50,
    "West Virginia": 6.00,
    "Wisconsin": 5.00,
    "Wyoming": 4.00
  }

  const calculateSalesTax = () => {
    if (calculationType === "add_tax") {
      // Add tax to amount
      const baseAmount = parseFloat(amount)
      const rate = parseFloat(taxRate) / 100
      const taxAmount = baseAmount * rate
      const total = baseAmount + taxAmount
      
      setResult({
        type: "Add Sales Tax",
        baseAmount: baseAmount.toFixed(2),
        taxRate: parseFloat(taxRate).toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        total: total.toFixed(2)
      })
    } else if (calculationType === "remove_tax") {
      // Remove tax from total
      const totalAmount = parseFloat(totalWithTax)
      const rate = parseFloat(taxRate) / 100
      const baseAmount = totalAmount / (1 + rate)
      const taxAmount = totalAmount - baseAmount
      
      setResult({
        type: "Remove Sales Tax",
        totalAmount: totalAmount.toFixed(2),
        taxRate: parseFloat(taxRate).toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        baseAmount: baseAmount.toFixed(2)
      })
    } else {
      // Calculate tax rate
      const baseAmount = parseFloat(amount)
      const totalAmount = parseFloat(totalWithTax)
      const taxAmount = totalAmount - baseAmount
      const rate = (taxAmount / baseAmount) * 100
      
      setResult({
        type: "Calculate Tax Rate",
        baseAmount: baseAmount.toFixed(2),
        totalAmount: totalAmount.toFixed(2),
        taxAmount: taxAmount.toFixed(2),
        taxRate: rate.toFixed(2)
      })
    }
  }

  const setStateRate = (state) => {
    setTaxRate(commonTaxRates[state].toString())
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Sales Tax Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculation Type</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="add_tax">Add sales tax to amount</option>
                <option value="remove_tax">Remove sales tax from total</option>
                <option value="calculate_rate">Calculate tax rate</option>
              </select>
            </div>

            {calculationType === "add_tax" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (before tax)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount before tax"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter tax rate"
                  />
                </div>
              </div>
            )}

            {calculationType === "remove_tax" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Total Amount (with tax)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalWithTax}
                    onChange={(e) => setTotalWithTax(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter total amount with tax"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={taxRate}
                    onChange={(e) => setTaxRate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter tax rate"
                  />
                </div>
              </div>
            )}

            {calculationType === "calculate_rate" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Amount (before tax)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter amount before tax"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Total Amount (with tax)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={totalWithTax}
                    onChange={(e) => setTotalWithTax(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="Enter total amount with tax"
                  />
                </div>
              </div>
            )}

            {(calculationType === "add_tax" || calculationType === "remove_tax") && (
              <div className="mt-4">
                <label className="block text-sm font-medium mb-2">Quick Select - US State Tax Rates</label>
                <select
                  onChange={(e) => e.target.value && setStateRate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  defaultValue=""
                >
                  <option value="">Select a state...</option>
                  {Object.entries(commonTaxRates).map(([state, rate]) => (
                    <option key={state} value={state}>
                      {state} - {rate}%
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-600 mt-1">
                  Note: Rates shown are base state rates. Local taxes may apply.
                </p>
              </div>
            )}

            <button
              onClick={calculateSalesTax}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{result.type}</h3>
                
                {result.type === "Add Sales Tax" && (
                  <div className="space-y-2">
                    <p>Amount (before tax): <span className="font-bold">${result.baseAmount}</span></p>
                    <p>Tax Rate: <span className="font-bold">{result.taxRate}%</span></p>
                    <p>Tax Amount: <span className="font-bold text-red-600">${result.taxAmount}</span></p>
                    <p className="text-lg border-t pt-2">
                      Total (with tax): <span className="font-bold text-green-600">${result.total}</span>
                    </p>
                  </div>
                )}
                
                {result.type === "Remove Sales Tax" && (
                  <div className="space-y-2">
                    <p>Total (with tax): <span className="font-bold">${result.totalAmount}</span></p>
                    <p>Tax Rate: <span className="font-bold">{result.taxRate}%</span></p>
                    <p>Tax Amount: <span className="font-bold text-red-600">${result.taxAmount}</span></p>
                    <p className="text-lg border-t pt-2">
                      Amount (before tax): <span className="font-bold text-green-600">${result.baseAmount}</span>
                    </p>
                  </div>
                )}
                
                {result.type === "Calculate Tax Rate" && (
                  <div className="space-y-2">
                    <p>Amount (before tax): <span className="font-bold">${result.baseAmount}</span></p>
                    <p>Total (with tax): <span className="font-bold">${result.totalAmount}</span></p>
                    <p>Tax Amount: <span className="font-bold text-red-600">${result.taxAmount}</span></p>
                    <p className="text-lg border-t pt-2">
                      Tax Rate: <span className="font-bold text-blue-600">{result.taxRate}%</span>
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="mt-6 p-4 bg-yellow-50 rounded-lg text-sm">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="space-y-1 text-gray-700">
                <li>• Tax rates shown are base state rates only</li>
                <li>• Local taxes (city, county) may apply in addition</li>
                <li>• Some items may be tax-exempt or have different rates</li>
                <li>• Always verify current tax rates with local authorities</li>
                <li>• This calculator is for estimation purposes only</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}