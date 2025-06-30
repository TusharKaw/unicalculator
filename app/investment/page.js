"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function InvestmentCalculator() {
  const [initialAmount, setInitialAmount] = useState("")
  const [monthlyContribution, setMonthlyContribution] = useState("")
  const [annualReturn, setAnnualReturn] = useState("")
  const [timeHorizon, setTimeHorizon] = useState("")
  const [compoundFrequency, setCompoundFrequency] = useState("12")
  const [contributionTiming, setContributionTiming] = useState("end")
  const [result, setResult] = useState(null)

  const calculateInvestment = () => {
    const principal = parseFloat(initialAmount) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const rate = parseFloat(annualReturn) / 100
    const years = parseFloat(timeHorizon)
    const frequency = parseFloat(compoundFrequency)

    if (years <= 0 || rate < 0) {
      setResult({ error: "Please enter valid positive numbers" })
      return
    }

    // Calculate compound interest on initial amount
    const initialGrowth = principal * Math.pow(1 + rate / frequency, frequency * years)

    // Calculate future value of monthly contributions
    let monthlyGrowth = 0
    if (monthly > 0) {
      const monthlyRate = rate / 12
      const totalMonths = years * 12
      
      if (monthlyRate === 0) {
        monthlyGrowth = monthly * totalMonths
      } else {
        // PMT formula for annuity
        const factor = contributionTiming === "beginning" ? (1 + monthlyRate) : 1
        monthlyGrowth = monthly * factor * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate)
      }
    }

    const totalFutureValue = initialGrowth + monthlyGrowth
    const totalContributions = principal + (monthly * 12 * years)
    const totalReturn = totalFutureValue - totalContributions

    // Calculate year-by-year breakdown
    const yearlyBreakdown = []
    let currentValue = principal
    let totalContributed = principal

    for (let year = 1; year <= Math.min(years, 30); year++) {
      // Add monthly contributions for the year
      const yearlyContributions = monthly * 12
      totalContributed += yearlyContributions
      
      // Calculate growth with contributions throughout the year
      let yearEndValue = currentValue
      for (let month = 1; month <= 12; month++) {
        yearEndValue = yearEndValue * (1 + rate / 12)
        if (contributionTiming === "beginning" || month < 12) {
          yearEndValue += monthly
        }
      }
      
      currentValue = yearEndValue
      const yearReturn = currentValue - totalContributed

      yearlyBreakdown.push({
        year,
        totalContributed: totalContributed.toFixed(2),
        totalValue: currentValue.toFixed(2),
        totalReturn: yearReturn.toFixed(2),
        yearlyGain: year === 1 ? yearReturn.toFixed(2) : (yearReturn - (year > 1 ? parseFloat(yearlyBreakdown[year-2].totalReturn) : 0)).toFixed(2)
      })
    }

    setResult({
      initialAmount: principal.toFixed(2),
      monthlyContribution: monthly.toFixed(2),
      totalContributions: totalContributions.toFixed(2),
      totalFutureValue: totalFutureValue.toFixed(2),
      totalReturn: totalReturn.toFixed(2),
      returnPercentage: totalContributions > 0 ? ((totalReturn / totalContributions) * 100).toFixed(2) : "0",
      averageAnnualReturn: ((Math.pow(totalFutureValue / totalContributions, 1 / years) - 1) * 100).toFixed(2),
      yearlyBreakdown,
      settings: {
        years,
        rate: annualReturn,
        frequency: compoundFrequency,
        timing: contributionTiming
      }
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Investment Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Initial Investment ($)</label>
                <input
                  type="number"
                  value={initialAmount}
                  onChange={(e) => setInitialAmount(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Starting amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Contribution ($)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Additional monthly investment"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={annualReturn}
                  onChange={(e) => setAnnualReturn(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Historical stock market average: 7-10%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Time Horizon (years)</label>
                <input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Investment period"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Compounding Frequency</label>
                <select
                  value={compoundFrequency}
                  onChange={(e) => setCompoundFrequency(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="1">Annually</option>
                  <option value="4">Quarterly</option>
                  <option value="12">Monthly</option>
                  <option value="365">Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Contribution Timing</label>
                <select
                  value={contributionTiming}
                  onChange={(e) => setContributionTiming(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="end">End of Period</option>
                  <option value="beginning">Beginning of Period</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateInvestment}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Investment Growth
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
                      <h3 className="text-xl font-bold mb-3">Investment Summary</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Total Contributions</p>
                          <p className="text-xl font-bold">${result.totalContributions}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Future Value</p>
                          <p className="text-xl font-bold text-green-600">${result.totalFutureValue}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Return</p>
                          <p className="text-xl font-bold text-blue-600">${result.totalReturn}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Return %</p>
                          <p className="text-xl font-bold text-purple-600">{result.returnPercentage}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-bold mb-2">Investment Details</h4>
                        <p>Initial Investment: <span className="font-bold">${result.initialAmount}</span></p>
                        <p>Monthly Contribution: <span className="font-bold">${result.monthlyContribution}</span></p>
                        <p>Time Horizon: <span className="font-bold">{result.settings.years} years</span></p>
                        <p>Expected Return: <span className="font-bold">{result.settings.rate}% annually</span></p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-bold mb-2">Performance Metrics</h4>
                        <p>Average Annual Return: <span className="font-bold">{result.averageAnnualReturn}%</span></p>
                        <p>Compounding: <span className="font-bold">{result.settings.frequency}x per year</span></p>
                        <p>Contribution Timing: <span className="font-bold">{result.settings.timing === 'beginning' ? 'Beginning' : 'End'} of period</span></p>
                      </div>
                    </div>

                    {/* Yearly Breakdown */}
                    {result.yearlyBreakdown.length > 0 && (
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-bold mb-3">Year-by-Year Growth</h3>
                        <div className="overflow-x-auto max-h-64">
                          <table className="w-full text-sm">
                            <thead className="bg-gray-200 sticky top-0">
                              <tr>
                                <th className="p-2 text-left">Year</th>
                                <th className="p-2 text-right">Contributed</th>
                                <th className="p-2 text-right">Total Value</th>
                                <th className="p-2 text-right">Total Return</th>
                                <th className="p-2 text-right">Yearly Gain</th>
                              </tr>
                            </thead>
                            <tbody>
                              {result.yearlyBreakdown.map((year, index) => (
                                <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                  <td className="p-2 font-bold">{year.year}</td>
                                  <td className="p-2 text-right">${year.totalContributed}</td>
                                  <td className="p-2 text-right font-bold text-green-600">${year.totalValue}</td>
                                  <td className="p-2 text-right text-blue-600">${year.totalReturn}</td>
                                  <td className="p-2 text-right text-purple-600">${year.yearlyGain}</td>
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
            <h3 className="text-lg font-bold mb-3">Investment Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-semibold mb-2">Key Principles:</h4>
                <ul className="space-y-1">
                  <li>• Start investing early to maximize compound growth</li>
                  <li>• Consistent monthly contributions matter</li>
                  <li>• Time in market beats timing the market</li>
                  <li>• Diversify your investment portfolio</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Historical Returns:</h4>
                <ul className="space-y-1">
                  <li>• S&P 500 long-term average: ~10%</li>
                  <li>• Conservative estimate: 6-7%</li>
                  <li>• Bonds typically: 3-5%</li>
                  <li>• Inflation averages: ~3%</li>
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