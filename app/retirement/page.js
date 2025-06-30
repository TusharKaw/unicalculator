"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function RetirementCalculator() {
  const [currentAge, setCurrentAge] = useState("")
  const [retirementAge, setRetirementAge] = useState("65")
  const [currentSavings, setCurrentSavings] = useState("")
  const [monthlyContribution, setMonthlyContribution] = useState("")
  const [expectedReturn, setExpectedReturn] = useState("7")
  const [retirementGoal, setRetirementGoal] = useState("")
  const [inflationRate, setInflationRate] = useState("3")
  const [result, setResult] = useState(null)

  const calculateRetirement = () => {
    const age = parseFloat(currentAge)
    const retAge = parseFloat(retirementAge)
    const savings = parseFloat(currentSavings) || 0
    const monthly = parseFloat(monthlyContribution) || 0
    const annualReturn = parseFloat(expectedReturn) / 100
    const goal = parseFloat(retirementGoal) || 0
    const inflation = parseFloat(inflationRate) / 100

    if (age >= retAge) {
      setResult({ error: "Retirement age must be greater than current age" })
      return
    }

    const yearsToRetirement = retAge - age
    const monthlyReturn = annualReturn / 12
    const totalMonths = yearsToRetirement * 12

    // Future value of current savings
    const currentSavingsFV = savings * Math.pow(1 + annualReturn, yearsToRetirement)

    // Future value of monthly contributions (annuity)
    let monthlyContributionsFV = 0
    if (monthly > 0 && monthlyReturn > 0) {
      monthlyContributionsFV = monthly * ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn)
    } else if (monthly > 0) {
      monthlyContributionsFV = monthly * totalMonths
    }

    const totalAtRetirement = currentSavingsFV + monthlyContributionsFV

    // Adjust for inflation
    const inflationAdjustedGoal = goal * Math.pow(1 + inflation, yearsToRetirement)
    const shortfall = inflationAdjustedGoal - totalAtRetirement

    // Calculate required monthly contribution to meet goal
    let requiredMonthly = 0
    if (goal > 0 && shortfall > 0) {
      const remainingNeeded = inflationAdjustedGoal - currentSavingsFV
      if (monthlyReturn > 0) {
        requiredMonthly = remainingNeeded / ((Math.pow(1 + monthlyReturn, totalMonths) - 1) / monthlyReturn)
      } else {
        requiredMonthly = remainingNeeded / totalMonths
      }
    }

    // Calculate what the savings will buy in today's purchasing power
    const inflationAdjustedValue = totalAtRetirement / Math.pow(1 + inflation, yearsToRetirement)

    setResult({
      yearsToRetirement,
      currentSavingsFV: currentSavingsFV.toFixed(2),
      monthlyContributionsFV: monthlyContributionsFV.toFixed(2),
      totalAtRetirement: totalAtRetirement.toFixed(2),
      inflationAdjustedValue: inflationAdjustedValue.toFixed(2),
      inflationAdjustedGoal: inflationAdjustedGoal.toFixed(2),
      shortfall: shortfall > 0 ? shortfall.toFixed(2) : 0,
      surplus: shortfall < 0 ? Math.abs(shortfall).toFixed(2) : 0,
      requiredMonthly: requiredMonthly > 0 ? requiredMonthly.toFixed(2) : 0,
      monthlyContribution: monthly.toFixed(2)
    })
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Retirement Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Current Age</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter your current age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Retirement Age</label>
                <input
                  type="number"
                  value={retirementAge}
                  onChange={(e) => setRetirementAge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="When do you plan to retire?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Current Retirement Savings ($)</label>
                <input
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Current 401k, IRA, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monthly Contribution ($)</label>
                <input
                  type="number"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="How much will you save monthly?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Expected Annual Return (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={expectedReturn}
                  onChange={(e) => setExpectedReturn(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Historical average is 7-10%"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Retirement Goal ($)</label>
                <input
                  type="number"
                  value={retirementGoal}
                  onChange={(e) => setRetirementGoal(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="How much do you need?"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Expected Inflation Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={inflationRate}
                onChange={(e) => setInflationRate(e.target.value)}
                className="w-full md:w-32 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                placeholder="3%"
              />
            </div>

            <button
              onClick={calculateRetirement}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Retirement Plan
            </button>

            {result && (
              <div className="mt-6 space-y-4">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <h3 className="text-xl font-bold mb-2">Projected Retirement Savings</h3>
                      <p className="text-3xl font-bold text-blue-600">${result.totalAtRetirement}</p>
                      <p className="text-sm text-gray-600">In {result.yearsToRetirement} years</p>
                      <p className="text-lg mt-2">Today's Purchasing Power: <span className="font-bold">${result.inflationAdjustedValue}</span></p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-bold mb-2">Savings Breakdown</h4>
                        <p>Current Savings Growth: <span className="font-bold">${result.currentSavingsFV}</span></p>
                        <p>Future Contributions: <span className="font-bold">${result.monthlyContributionsFV}</span></p>
                        <p>Monthly Contribution: <span className="font-bold">${result.monthlyContribution}</span></p>
                      </div>

                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <h4 className="font-bold mb-2">Goal Analysis</h4>
                        {result.shortfall > 0 ? (
                          <>
                            <p className="text-red-600">Shortfall: <span className="font-bold">${result.shortfall}</span></p>
                            <p className="text-sm">Required Monthly: <span className="font-bold">${result.requiredMonthly}</span></p>
                          </>
                        ) : result.surplus > 0 ? (
                          <p className="text-green-600">Surplus: <span className="font-bold">${result.surplus}</span></p>
                        ) : (
                          <p>Set a retirement goal to see analysis</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Retirement Planning Tips</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-2">General Guidelines:</h4>
                <ul className="space-y-1">
                  <li>• Save 10-15% of income for retirement</li>
                  <li>• Start as early as possible for compound growth</li>
                  <li>• Consider employer 401(k) matching</li>
                  <li>• Diversify investments across asset classes</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rule of Thumb:</h4>
                <ul className="space-y-1">
                  <li>• Need 70-90% of pre-retirement income</li>
                  <li>• 4% withdrawal rule for retirement</li>
                  <li>• Consider healthcare costs in retirement</li>
                  <li>• Account for inflation over time</li>
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