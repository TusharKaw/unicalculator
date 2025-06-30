"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function CalorieCalculator() {
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [activity, setActivity] = useState("sedentary")
  const [goal, setGoal] = useState("maintain")
  const [unit, setUnit] = useState("metric")
  const [result, setResult] = useState(null)

  const calculateCalories = () => {
    let heightInCm, weightInKg
    
    if (unit === "metric") {
      heightInCm = parseFloat(height)
      weightInKg = parseFloat(weight)
    } else {
      heightInCm = parseFloat(height) * 2.54
      weightInKg = parseFloat(weight) * 0.453592
    }

    const ageNum = parseFloat(age)

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr
    if (gender === "male") {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum + 5
    } else {
      bmr = 10 * weightInKg + 6.25 * heightInCm - 5 * ageNum - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }

    const maintenanceCalories = bmr * activityMultipliers[activity]

    // Goal adjustments
    let targetCalories = maintenanceCalories
    let weeklyChange = 0

    switch (goal) {
      case "lose_1":
        targetCalories = maintenanceCalories - 500
        weeklyChange = -1
        break
      case "lose_2":
        targetCalories = maintenanceCalories - 1000
        weeklyChange = -2
        break
      case "gain_1":
        targetCalories = maintenanceCalories + 500
        weeklyChange = 1
        break
      case "gain_2":
        targetCalories = maintenanceCalories + 1000
        weeklyChange = 2
        break
      default:
        targetCalories = maintenanceCalories
        weeklyChange = 0
    }

    setResult({
      bmr: Math.round(bmr),
      maintenance: Math.round(maintenanceCalories),
      target: Math.round(targetCalories),
      weeklyChange: weeklyChange
    })
  }

  const getActivityText = (activityLevel) => {
    switch (activityLevel) {
      case "sedentary": return "Sedentary (little/no exercise)"
      case "light": return "Light (light exercise 1-3 days/week)"
      case "moderate": return "Moderate (moderate exercise 3-5 days/week)"
      case "active": return "Active (hard exercise 6-7 days/week)"
      case "very_active": return "Very Active (very hard exercise, physical job)"
      default: return ""
    }
  }

  const getGoalText = (goalType) => {
    switch (goalType) {
      case "lose_2": return "Lose 2 lbs/week"
      case "lose_1": return "Lose 1 lb/week"
      case "maintain": return "Maintain weight"
      case "gain_1": return "Gain 1 lb/week"
      case "gain_2": return "Gain 2 lbs/week"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Calorie Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Unit System</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="metric">Metric (cm, kg)</option>
                  <option value="imperial">Imperial (inches, lbs)</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Age (years)</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder="Enter your age"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Height ({unit === "metric" ? "cm" : "inches"})</label>
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={`Enter height in ${unit === "metric" ? "cm" : "inches"}`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Weight ({unit === "metric" ? "kg" : "lbs"})</label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                  placeholder={`Enter weight in ${unit === "metric" ? "kg" : "lbs"}`}
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Activity Level</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Goal</label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="lose_2">Lose 2 lbs/week</option>
                <option value="lose_1">Lose 1 lb/week</option>
                <option value="maintain">Maintain weight</option>
                <option value="gain_1">Gain 1 lb/week</option>
                <option value="gain_2">Gain 2 lbs/week</option>
              </select>
            </div>

            <button
              onClick={calculateCalories}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-medium transition-colors"
            >
              Calculate Calories
            </button>

            {result && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h3 className="text-lg font-bold mb-2">Results:</h3>
                <div className="space-y-2">
                  <p>BMR (Basal Metabolic Rate): <span className="font-bold">{result.bmr} calories/day</span></p>
                  <p>Maintenance Calories: <span className="font-bold">{result.maintenance} calories/day</span></p>
                  <p>Activity Level: <span className="font-bold">{getActivityText(activity)}</span></p>
                  <p>Goal: <span className="font-bold">{getGoalText(goal)}</span></p>
                  <p className="text-lg border-t pt-2">
                    Target Calories: <span className="font-bold text-green-600">{result.target} calories/day</span>
                  </p>
                  {result.weeklyChange !== 0 && (
                    <p className="text-sm text-gray-600">
                      Expected weight change: {result.weeklyChange > 0 ? '+' : ''}{result.weeklyChange} lbs/week
                    </p>
                  )}
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