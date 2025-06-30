"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function PercentageCalculator() {
  const [calculationType, setCalculationType] = useState("basic")
  const [value1, setValue1] = useState("")
  const [value2, setValue2] = useState("")
  const [result, setResult] = useState(null)

  const calculatePercentage = () => {
    const num1 = parseFloat(value1)
    const num2 = parseFloat(value2)
    
    let calculationResult = null

    switch (calculationType) {
      case "basic":
        // What is X% of Y?
        calculationResult = {
          type: "Basic Percentage",
          question: `What is ${num1}% of ${num2}?`,
          answer: ((num1 / 100) * num2).toFixed(2),
          formula: `(${num1} ÷ 100) × ${num2} = ${((num1 / 100) * num2).toFixed(2)}`
        }
        break
      
      case "is_what_percent":
        // X is what percent of Y?
        calculationResult = {
          type: "Percentage of Total",
          question: `${num1} is what percent of ${num2}?`,
          answer: ((num1 / num2) * 100).toFixed(2) + "%",
          formula: `(${num1} ÷ ${num2}) × 100 = ${((num1 / num2) * 100).toFixed(2)}%`
        }
        break
      
      case "percent_change":
        // Percent change from X to Y
        const change = ((num2 - num1) / num1) * 100
        calculationResult = {
          type: "Percentage Change",
          question: `What is the percentage change from ${num1} to ${num2}?`,
          answer: (change >= 0 ? "+" : "") + change.toFixed(2) + "%",
          formula: `((${num2} - ${num1}) ÷ ${num1}) × 100 = ${change.toFixed(2)}%`,
          isIncrease: change >= 0
        }
        break
      
      case "percent_off":
        // X% off of Y
        const discount = (num1 / 100) * num2
        const finalPrice = num2 - discount
        calculationResult = {
          type: "Percentage Discount",
          question: `What is ${num1}% off of ${num2}?`,
          answer: finalPrice.toFixed(2),
          formula: `${num2} - (${num1}% × ${num2}) = ${num2} - ${discount.toFixed(2)} = ${finalPrice.toFixed(2)}`,
          discount: discount.toFixed(2),
          originalPrice: num2.toFixed(2)
        }
        break
      
      case "markup":
        // Add X% to Y
        const markup = (num1 / 100) * num2
        const finalPriceMarkup = num2 + markup
        calculationResult = {
          type: "Percentage Markup",
          question: `What is ${num2} with ${num1}% markup?`,
          answer: finalPriceMarkup.toFixed(2),
          formula: `${num2} + (${num1}% × ${num2}) = ${num2} + ${markup.toFixed(2)} = ${finalPriceMarkup.toFixed(2)}`,
          markup: markup.toFixed(2),
          originalPrice: num2.toFixed(2)
        }
        break
    }

    setResult(calculationResult)
  }

  const getInputLabels = () => {
    switch (calculationType) {
      case "basic":
        return { label1: "Percentage (%)", label2: "Value", placeholder1: "Enter percentage", placeholder2: "Enter value" }
      case "is_what_percent":
        return { label1: "Value", label2: "Total", placeholder1: "Enter value", placeholder2: "Enter total" }
      case "percent_change":
        return { label1: "Original Value", label2: "New Value", placeholder1: "Enter original value", placeholder2: "Enter new value" }
      case "percent_off":
        return { label1: "Discount (%)", label2: "Original Price", placeholder1: "Enter discount percentage", placeholder2: "Enter original price" }
      case "markup":
        return { label1: "Markup (%)", label2: "Original Price", placeholder1: "Enter markup percentage", placeholder2: "Enter original price" }
      default:
        return { label1: "Value 1", label2: "Value 2", placeholder1: "Enter first value", placeholder2: "Enter second value" }
    }
  }

  const labels = getInputLabels()

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Percentage Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculation Type</label>
              <select
                value={calculationType}
                onChange={(e) => setCalculationType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="basic">What is X% of Y?</option>
                <option value="is_what_percent">X is what percent of Y?</option>
                <option value="percent_change">Percentage change from X to Y</option>
                <option value="percent_off">X% off of Y</option>
                <option value="markup">Add X% markup to Y</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">{labels.label1}</label>
                <input
                  type="number"
                  value={value1}
                  onChange={(e) => setValue1(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={labels.placeholder1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">{labels.label2}</label>
                <input
                  type="number"
                  value={value2}
                  onChange={(e) => setValue2(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={labels.placeholder2}
                />
              </div>
            </div>

            <button
              onClick={calculatePercentage}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">{result.type}</h3>
                <div className="space-y-2">
                  <p className="text-gray-700">{result.question}</p>
                  <p className="text-2xl font-bold">
                    Answer: <span className={`${result.type === "Percentage Change" && result.isIncrease ? "text-green-600" : result.type === "Percentage Change" && !result.isIncrease ? "text-red-600" : "text-blue-600"}`}>
                      {result.answer}
                    </span>
                  </p>
                  
                  {result.type === "Percentage Discount" && (
                    <div className="mt-3 space-y-1">
                      <p>Original Price: <span className="font-bold">${result.originalPrice}</span></p>
                      <p>Discount Amount: <span className="font-bold text-red-600">-${result.discount}</span></p>
                      <p>Final Price: <span className="font-bold text-green-600">${result.answer}</span></p>
                    </div>
                  )}
                  
                  {result.type === "Percentage Markup" && (
                    <div className="mt-3 space-y-1">
                      <p>Original Price: <span className="font-bold">${result.originalPrice}</span></p>
                      <p>Markup Amount: <span className="font-bold text-green-600">+${result.markup}</span></p>
                      <p>Final Price: <span className="font-bold text-blue-600">${result.answer}</span></p>
                    </div>
                  )}
                  
                  <div className="mt-3 p-2 bg-gray-100 rounded text-sm">
                    <p><strong>Formula:</strong> {result.formula}</p>
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