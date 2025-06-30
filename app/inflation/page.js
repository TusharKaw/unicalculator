"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function InflationCalculator() {
  const [calculationType, setCalculationType] = useState("future_value")
  const [initialAmount, setInitialAmount] = useState("")
  const [finalAmount, setFinalAmount] = useState("")
  const [inflationRate, setInflationRate] = useState("3")
  const [years, setYears] = useState("")
  const [startYear, setStartYear] = useState("")
  const [endYear, setEndYear] = useState("")
  const [result, setResult] = useState(null)

  // Historical US inflation rates (approximate)
  const historicalRates = {
    2023: 3.2, 2022: 8.0, 2021: 4.7, 2020: 1.2, 2019: 1.8,
    2018: 2.4, 2017: 2.1, 2016: 1.3, 2015: 0.1, 2014: 1.6,
    2013: 1.5, 2012: 2.1, 2011: 3.1, 2010: 1.5, 2009: -0.4,
    2008: 3.8, 2007: 2.8, 2006: 3.2, 2005: 3.4, 2004: 2.7,
    2003: 2.3, 2002: 1.6, 2001: 2.8, 2000: 3.4
  }

  const calculateInflation = () => {
    const amount = parseFloat(initialAmount)
    const rate = parseFloat(inflationRate) / 100
    const period = parseFloat(years)

    if (calculationType === "future_value") {
      if (amount <= 0 || period <= 0) {
        setResult({ error: "Please enter valid positive numbers" })
        return
      }

      const futureValue = amount * Math.pow(1 + rate, period)
      const totalInflation = futureValue - amount
      const cumulativeInflation = ((futureValue / amount - 1) * 100)

      // Calculate year-by-year breakdown
      const yearlyBreakdown = []
      let currentValue = amount

      for (let year = 1; year <= Math.min(period, 50); year++) {
        currentValue = currentValue * (1 + rate)
        const inflationLoss = currentValue - amount
        const purchasingPowerLoss = ((currentValue / amount - 1) * 100)

        yearlyBreakdown.push({
          year,
          equivalentValue: currentValue.toFixed(2),
          inflationLoss: inflationLoss.toFixed(2),
          purchasingPowerLoss: purchasingPowerLoss.toFixed(2)
        })
      }

      setResult({
        type: "future_value",
        initialAmount: amount.toFixed(2),
        futureValue: futureValue.toFixed(2),
        totalInflation: totalInflation.toFixed(2),
        cumulativeInflation: cumulativeInflation.toFixed(2),
        purchasingPowerLoss: (100 - (amount / futureValue * 100)).toFixed(2),
        yearlyBreakdown
      })

    } else if (calculationType === "past_value") {
      const finalAmt = parseFloat(finalAmount)
      if (finalAmt <= 0 || period <= 0) {
        setResult({ error: "Please enter valid positive numbers" })
        return
      }

      const pastValue = finalAmt / Math.pow(1 + rate, period)
      const inflationIncrease = finalAmt - pastValue
      const cumulativeInflation = ((finalAmt / pastValue - 1) * 100)

      setResult({
        type: "past_value",
        finalAmount: finalAmt.toFixed(2),
        pastValue: pastValue.toFixed(2),
        inflationIncrease: inflationIncrease.toFixed(2),
        cumulativeInflation: cumulativeInflation.toFixed(2),
        period
      })

    } else if (calculationType === "historical") {
      const start = parseInt(startYear)
      const end = parseInt(endYear)
      
      if (start >= end || !historicalRates[start] || !historicalRates[end]) {
        setResult({ error: "Please enter valid years with available data (2000-2023)" })
        return
      }

      // Calculate using historical rates
      let cumulativeRate = 1
      const yearlyData = []
      
      for (let year = start; year < end; year++) {
        const yearRate = historicalRates[year] || 3 // Default if missing
        cumulativeRate *= (1 + yearRate / 100)
        yearlyData.push({
          year,
          rate: yearRate.toFixed(1),
          cumulativeInflation: ((cumulativeRate - 1) * 100).toFixed(2)
        })
      }

      const finalValue = amount * cumulativeRate
      const totalInflation = finalValue - amount

      setResult({
        type: "historical",
        initialAmount: amount.toFixed(2),
        finalValue: finalValue.toFixed(2),
        totalInflation: totalInflation.toFixed(2),
        cumulativeInflation: ((cumulativeRate - 1) * 100).toFixed(2),
        startYear: start,
        endYear: end,
        yearlyData
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Inflation Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calculation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">What do you want to calculate?</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="future_value"
                    checked={calculationType === "future_value"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Future Value</div>
                    <div className="text-sm text-gray-600">What will money be worth?</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="past_value"
                    checked={calculationType === "past_value"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Past Value</div>
                    <div className="text-sm text-gray-600">What was money worth before?</div>
                  </div>
                </label>
                
                <label className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    value="historical"
                    checked={calculationType === "historical"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-3"
                  />
                  <div>
                    <div className="font-semibold">Historical Rates</div>
                    <div className="text-sm text-gray-600">Use actual US inflation data</div>
                  </div>
                </label>
              </div>
            </div>

            {/* Input Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {calculationType === "future_value" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Amount ($)</label>
                    <input
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Enter current amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inflation Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Annual inflation rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Time Period (years)</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Number of years"
                    />
                  </div>
                </>
              )}

              {calculationType === "past_value" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Amount ($)</label>
                    <input
                      type="number"
                      value={finalAmount}
                      onChange={(e) => setFinalAmount(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Current amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Inflation Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Annual inflation rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Years Ago</label>
                    <input
                      type="number"
                      value={years}
                      onChange={(e) => setYears(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Years in the past"
                    />
                  </div>
                </>
              )}

              {calculationType === "historical" && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-2">Amount ($)</label>
                    <input
                      type="number"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="Enter amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Start Year</label>
                    <input
                      type="number"
                      min="2000"
                      max="2023"
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="2000-2023"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">End Year</label>
                    <input
                      type="number"
                      min="2000"
                      max="2023"
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                      placeholder="2000-2023"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              onClick={calculateInflation}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Inflation Impact
            </button>

            {result && (
              <div className="mt-6">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Results Summary */}
                    {result.type === "future_value" && (
                      <div className="p-4 bg-red-50 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Future Value Impact</h3>
                        <p className="text-sm mb-2">${result.initialAmount} today will need to be:</p>
                        <p className="text-3xl font-bold text-red-600">${result.futureValue}</p>
                        <p className="text-sm text-gray-600">in {years} years to have the same purchasing power</p>
                        <p className="mt-2">Purchasing Power Loss: <span className="font-bold">{result.purchasingPowerLoss}%</span></p>
                      </div>
                    )}

                    {result.type === "past_value" && (
                      <div className="p-4 bg-blue-50 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Past Value Equivalent</h3>
                        <p className="text-sm mb-2">${result.finalAmount} today had the purchasing power of:</p>
                        <p className="text-3xl font-bold text-blue-600">${result.pastValue}</p>
                        <p className="text-sm text-gray-600">{years} years ago</p>
                        <p className="mt-2">Cumulative Inflation: <span className="font-bold">{result.cumulativeInflation}%</span></p>
                      </div>
                    )}

                    {result.type === "historical" && (
                      <div className="p-4 bg-green-50 rounded-lg text-center">
                        <h3 className="text-xl font-bold mb-2">Historical Inflation Impact</h3>
                        <p className="text-sm mb-2">${result.initialAmount} in {result.startYear} equals:</p>
                        <p className="text-3xl font-bold text-green-600">${result.finalValue}</p>
                        <p className="text-sm text-gray-600">in {result.endYear} (using actual inflation rates)</p>
                        <p className="mt-2">Total Inflation: <span className="font-bold">{result.cumulativeInflation}%</span></p>
                      </div>
                    )}

                    {/* Detailed Breakdown */}
                    {result.yearlyBreakdown && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Year-by-Year Impact</h3>
                        <div className="overflow-x-auto max-h-64">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-200 sticky top-0">
                              <tr>
                                <th className="p-2 text-left">Year</th>
                                <th className="p-2 text-right">Equivalent Value</th>
                                <th className="p-2 text-right">Inflation Loss</th>
                                <th className="p-2 text-right">Power Loss %</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.yearlyBreakdown.map((year, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="p-2 font-bold">{year.year}</td>
                                  <td className="p-2 text-right">${year.equivalentValue}</td>
                                  <td className="p-2 text-right text-red-600">${year.inflationLoss}</td>
                                  <td className="p-2 text-right text-red-600">{year.purchasingPowerLoss}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {result.yearlyData && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Historical Inflation Rates</h3>
                        <div className="overflow-x-auto max-h-64">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-200 sticky top-0">
                              <tr>
                                <th className="p-2 text-left">Year</th>
                                <th className="p-2 text-right">Inflation Rate</th>
                                <th className="p-2 text-right">Cumulative</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.yearlyData.map((year, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="p-2 font-bold">{year.year}</td>
                                  <td className="p-2 text-right">{year.rate}%</td>
                                  <td className="p-2 text-right">{year.cumulativeInflation}%</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Understanding Inflation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">What is inflation?</h4>
                <ul className="space-y-1">
                  <li>• General increase in prices over time</li>
                  <li>• Reduces purchasing power of money</li>
                  <li>• US target rate is typically 2%</li>
                  <li>• Compound effect over long periods</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Protection strategies:</h4>
                <ul className="space-y-1">
                  <li>• Invest in assets that grow with inflation</li>
                  <li>• Consider TIPS (Treasury Inflation-Protected Securities)</li>
                  <li>• Real estate often hedges against inflation</li>
                  <li>• Stocks historically outpace inflation long-term</li>
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