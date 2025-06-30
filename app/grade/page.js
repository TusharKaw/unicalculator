"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function GradeCalculator() {
  const [calculationType, setCalculationType] = useState("weighted")
  const [assignments, setAssignments] = useState([
    { name: "", score: "", maxScore: "", weight: "" }
  ])
  const [targetGrade, setTargetGrade] = useState("")
  const [finalExamWeight, setFinalExamWeight] = useState("")
  const [result, setResult] = useState(null)

  const addAssignment = () => {
    setAssignments([...assignments, { name: "", score: "", maxScore: "", weight: "" }])
  }

  const removeAssignment = (index) => {
    if (assignments.length > 1) {
      setAssignments(assignments.filter((_, i) => i !== index))
    }
  }

  const updateAssignment = (index, field, value) => {
    const newAssignments = [...assignments]
    newAssignments[index][field] = value
    setAssignments(newAssignments)
  }

  const calculateGrade = () => {
    let totalWeightedScore = 0
    let totalWeight = 0
    let validAssignments = []

    assignments.forEach((assignment, index) => {
      const score = parseFloat(assignment.score)
      const maxScore = parseFloat(assignment.maxScore)
      const weight = calculationType === "weighted" ? parseFloat(assignment.weight) : 1

      if (!isNaN(score) && !isNaN(maxScore) && maxScore > 0 && !isNaN(weight) && weight > 0) {
        const percentage = (score / maxScore) * 100
        const weightedScore = percentage * weight
        
        totalWeightedScore += weightedScore
        totalWeight += weight
        
        validAssignments.push({
          ...assignment,
          index: index + 1,
          percentage: percentage.toFixed(2),
          weightedScore: weightedScore.toFixed(2)
        })
      }
    })

    if (totalWeight === 0) {
      setResult({ error: "Please enter valid assignments with scores and weights." })
      return
    }

    const currentGrade = totalWeightedScore / totalWeight
    const letterGrade = getLetterGrade(currentGrade)
    
    // Calculate what's needed for target grade
    let targetAnalysis = null
    if (targetGrade && finalExamWeight) {
      const target = parseFloat(targetGrade)
      const examWeight = parseFloat(finalExamWeight)
      
      if (!isNaN(target) && !isNaN(examWeight) && examWeight > 0) {
        const currentWeight = totalWeight
        const totalPossibleWeight = currentWeight + examWeight
        
        // Calculate required exam score
        const requiredTotalScore = target * totalPossibleWeight
        const currentTotalScore = currentGrade * currentWeight
        const requiredExamScore = (requiredTotalScore - currentTotalScore) / examWeight
        
        targetAnalysis = {
          target,
          currentGrade: currentGrade.toFixed(2),
          requiredExamScore: requiredExamScore.toFixed(2),
          examWeight,
          isAchievable: requiredExamScore <= 100,
          difficulty: getDifficulty(requiredExamScore)
        }
      }
    }

    setResult({
      currentGrade: currentGrade.toFixed(2),
      letterGrade,
      totalWeightedScore: totalWeightedScore.toFixed(2),
      totalWeight: totalWeight.toFixed(2),
      validAssignments,
      targetAnalysis,
      calculationType
    })
  }

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+"
    if (percentage >= 93) return "A"
    if (percentage >= 90) return "A-"
    if (percentage >= 87) return "B+"
    if (percentage >= 83) return "B"
    if (percentage >= 80) return "B-"
    if (percentage >= 77) return "C+"
    if (percentage >= 73) return "C"
    if (percentage >= 70) return "C-"
    if (percentage >= 67) return "D+"
    if (percentage >= 65) return "D"
    if (percentage >= 60) return "D-"
    return "F"
  }

  const getDifficulty = (score) => {
    if (score > 100) return "Impossible"
    if (score > 95) return "Very Hard"
    if (score > 85) return "Hard"
    if (score > 70) return "Moderate"
    if (score > 50) return "Easy"
    return "Very Easy"
  }

  const getGradeColor = (grade) => {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    if (grade >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const quickPresets = [
    { name: "Equal Weight", assignments: [
      { name: "Assignment 1", score: "", maxScore: "100", weight: "1" },
      { name: "Assignment 2", score: "", maxScore: "100", weight: "1" },
      { name: "Assignment 3", score: "", maxScore: "100", weight: "1" }
    ]},
    { name: "Standard Course", assignments: [
      { name: "Homework", score: "", maxScore: "100", weight: "20" },
      { name: "Quizzes", score: "", maxScore: "100", weight: "20" },
      { name: "Midterm", score: "", maxScore: "100", weight: "25" },
      { name: "Final", score: "", maxScore: "100", weight: "35" }
    ]}
  ]

  const loadPreset = (preset) => {
    setAssignments([...preset.assignments])
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Grade Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calculation Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Calculation Type</label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="weighted"
                    checked={calculationType === "weighted"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-2"
                  />
                  Weighted Average (Different weights for each assignment)
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="simple"
                    checked={calculationType === "simple"}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="mr-2"
                  />
                  Simple Average (All assignments equal weight)
                </label>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Quick Setup</label>
              <div className="flex flex-wrap gap-2">
                {quickPresets.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => loadPreset(preset)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm"
                  >
                    {preset.name}
                  </button>
                ))}
                <button
                  onClick={() => setAssignments([{ name: "", score: "", maxScore: "", weight: "" }])}
                  className="bg-red-200 hover:bg-red-300 text-red-700 px-3 py-1 rounded text-sm"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Assignments */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Assignments</h2>
                <button
                  onClick={addAssignment}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  + Add Assignment
                </button>
              </div>

              {/* Header */}
              <div className="hidden md:grid grid-cols-5 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                <div>Assignment Name</div>
                <div>Score Earned</div>
                <div>Max Score</div>
                {calculationType === "weighted" && <div>Weight (%)</div>}
                <div>Actions</div>
              </div>

              {/* Assignment Entries */}
              {assignments.map((assignment, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 md:p-0 md:border-0">
                  <div className={`grid grid-cols-1 md:grid-cols-${calculationType === "weighted" ? "5" : "4"} gap-4`}>
                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Assignment Name</label>
                      <input
                        type="text"
                        value={assignment.name}
                        onChange={(e) => updateAssignment(index, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Quiz 1, Midterm"
                      />
                    </div>

                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Score Earned</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={assignment.score}
                        onChange={(e) => updateAssignment(index, 'score', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Points earned"
                      />
                    </div>

                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Max Score</label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={assignment.maxScore}
                        onChange={(e) => updateAssignment(index, 'maxScore', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Total points"
                      />
                    </div>

                    {calculationType === "weighted" && (
                      <div>
                        <label className="block md:hidden text-sm font-medium mb-1">Weight (%)</label>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={assignment.weight}
                          onChange={(e) => updateAssignment(index, 'weight', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="Weight %"
                        />
                      </div>
                    )}

                    <div className="flex items-end">
                      {assignments.length > 1 && (
                        <button
                          onClick={() => removeAssignment(index)}
                          className="w-full md:w-auto bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Target Grade Analysis */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Target Grade Analysis (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Target Grade (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={targetGrade}
                    onChange={(e) => setTargetGrade(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Final Exam Weight (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={finalExamWeight}
                    onChange={(e) => setFinalExamWeight(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                    placeholder="e.g., 30"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={calculateGrade}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate Grade
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4">
                {result.error ? (
                  <div className="p-4 bg-red-50 rounded-lg">
                    <p className="text-red-600 font-bold">{result.error}</p>
                  </div>
                ) : (
                  <>
                    {/* Current Grade */}
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h3 className="text-xl font-bold mb-3">Current Grade</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Percentage</p>
                          <p className={`text-3xl font-bold ${getGradeColor(parseFloat(result.currentGrade))}`}>
                            {result.currentGrade}%
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Letter Grade</p>
                          <p className={`text-3xl font-bold ${getGradeColor(parseFloat(result.currentGrade))}`}>
                            {result.letterGrade}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Weight</p>
                          <p className="text-3xl font-bold">{result.totalWeight}%</p>
                        </div>
                      </div>
                    </div>

                    {/* Target Analysis */}
                    {result.targetAnalysis && (
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h3 className="text-xl font-bold mb-3">Target Grade Analysis</h3>
                        <div className="space-y-2">
                          <p>To achieve <span className="font-bold">{result.targetAnalysis.target}%</span> overall:</p>
                          <p>You need to score <span className={`font-bold text-xl ${result.targetAnalysis.isAchievable ? 'text-green-600' : 'text-red-600'}`}>
                            {result.targetAnalysis.requiredExamScore}%
                          </span> on your final exam</p>
                          <p>Difficulty: <span className="font-bold">{result.targetAnalysis.difficulty}</span></p>
                          {!result.targetAnalysis.isAchievable && (
                            <p className="text-red-600 font-bold">⚠️ This target may not be achievable with a perfect score (100%)</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Assignment Breakdown */}
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="text-lg font-bold mb-3">Assignment Breakdown</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b">
                              <th className="text-left py-2">Assignment</th>
                              <th className="text-center py-2">Score</th>
                              <th className="text-center py-2">Percentage</th>
                              {result.calculationType === "weighted" && <th className="text-center py-2">Weight</th>}
                              {result.calculationType === "weighted" && <th className="text-center py-2">Weighted Score</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {result.validAssignments.map((assignment) => (
                              <tr key={assignment.index} className="border-b">
                                <td className="py-2">{assignment.name || `Assignment ${assignment.index}`}</td>
                                <td className="text-center py-2">{assignment.score}/{assignment.maxScore}</td>
                                <td className="text-center py-2">{assignment.percentage}%</td>
                                {result.calculationType === "weighted" && (
                                  <td className="text-center py-2">{assignment.weight}%</td>
                                )}
                                {result.calculationType === "weighted" && (
                                  <td className="text-center py-2">{assignment.weightedScore}</td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Grade Scale Reference */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Standard Grade Scale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              <div>A+: 97-100%</div>
              <div>A: 93-96%</div>
              <div>A-: 90-92%</div>
              <div>B+: 87-89%</div>
              <div>B: 83-86%</div>
              <div>B-: 80-82%</div>
              <div>C+: 77-79%</div>
              <div>C: 73-76%</div>
              <div>C-: 70-72%</div>
              <div>D+: 67-69%</div>
              <div>D: 65-66%</div>
              <div>F: Below 65%</div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}