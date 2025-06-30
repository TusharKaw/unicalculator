"use client"

import { useState } from "react"
import Header from "../components/Header"
import AdBanner from "../components/AdBanner"

export default function GPACalculator() {
  const [courses, setCourses] = useState([
    { name: "", grade: "", credits: "", points: 0 }
  ])
  const [gradeScale, setGradeScale] = useState("4.0")
  const [result, setResult] = useState(null)

  const gradeScales = {
    "4.0": {
      "A+": 4.0, "A": 4.0, "A-": 3.7,
      "B+": 3.3, "B": 3.0, "B-": 2.7,
      "C+": 2.3, "C": 2.0, "C-": 1.7,
      "D+": 1.3, "D": 1.0, "D-": 0.7,
      "F": 0.0
    },
    "5.0": {
      "A+": 5.0, "A": 4.5, "A-": 4.0,
      "B+": 3.5, "B": 3.0, "B-": 2.5,
      "C+": 2.0, "C": 1.5, "C-": 1.0,
      "D+": 0.5, "D": 0.0, "F": 0.0
    },
    "percentage": {
      // Will be calculated differently
    }
  }

  const addCourse = () => {
    setCourses([...courses, { name: "", grade: "", credits: "", points: 0 }])
  }

  const removeCourse = (index) => {
    if (courses.length > 1) {
      setCourses(courses.filter((_, i) => i !== index))
    }
  }

  const updateCourse = (index, field, value) => {
    const newCourses = [...courses]
    newCourses[index][field] = value
    
    // Calculate grade points when grade or credits change
    if (field === "grade" || field === "credits") {
      const credits = parseFloat(newCourses[index].credits) || 0
      let gradePoints = 0
      
      if (gradeScale === "percentage") {
        const percentage = parseFloat(newCourses[index].grade) || 0
        gradePoints = percentageToGPA(percentage) * credits
      } else {
        const gradeValue = gradeScales[gradeScale][newCourses[index].grade] || 0
        gradePoints = gradeValue * credits
      }
      
      newCourses[index].points = gradePoints
    }
    
    setCourses(newCourses)
  }

  const percentageToGPA = (percentage) => {
    if (gradeScale === "4.0") {
      if (percentage >= 97) return 4.0
      if (percentage >= 93) return 4.0
      if (percentage >= 90) return 3.7
      if (percentage >= 87) return 3.3
      if (percentage >= 83) return 3.0
      if (percentage >= 80) return 2.7
      if (percentage >= 77) return 2.3
      if (percentage >= 73) return 2.0
      if (percentage >= 70) return 1.7
      if (percentage >= 67) return 1.3
      if (percentage >= 65) return 1.0
      if (percentage >= 60) return 0.7
      return 0.0
    } else {
      // 5.0 scale
      if (percentage >= 97) return 5.0
      if (percentage >= 90) return 4.5
      if (percentage >= 87) return 4.0
      if (percentage >= 83) return 3.5
      if (percentage >= 80) return 3.0
      if (percentage >= 77) return 2.5
      if (percentage >= 73) return 2.0
      if (percentage >= 70) return 1.5
      if (percentage >= 67) return 1.0
      if (percentage >= 60) return 0.5
      return 0.0
    }
  }

  const calculateGPA = () => {
    let totalCredits = 0
    let totalGradePoints = 0
    let validCourses = []

    courses.forEach((course, index) => {
      const credits = parseFloat(course.credits) || 0
      let gradePoints = 0

      if (credits > 0 && course.grade) {
        if (gradeScale === "percentage") {
          const percentage = parseFloat(course.grade) || 0
          if (percentage >= 0 && percentage <= 100) {
            gradePoints = percentageToGPA(percentage) * credits
            validCourses.push({
              ...course,
              index: index + 1,
              gradeValue: percentageToGPA(percentage),
              gradePoints
            })
          }
        } else {
          const gradeValue = gradeScales[gradeScale][course.grade]
          if (gradeValue !== undefined) {
            gradePoints = gradeValue * credits
            validCourses.push({
              ...course,
              index: index + 1,
              gradeValue,
              gradePoints
            })
          }
        }
        
        totalCredits += credits
        totalGradePoints += gradePoints
      }
    })

    const gpa = totalCredits > 0 ? totalGradePoints / totalCredits : 0

    // Calculate letter grade equivalent
    let letterGrade = "F"
    if (gradeScale === "4.0") {
      if (gpa >= 3.7) letterGrade = "A-"
      else if (gpa >= 3.3) letterGrade = "B+"
      else if (gpa >= 3.0) letterGrade = "B"
      else if (gpa >= 2.7) letterGrade = "B-"
      else if (gpa >= 2.3) letterGrade = "C+"
      else if (gpa >= 2.0) letterGrade = "C"
      else if (gpa >= 1.7) letterGrade = "C-"
      else if (gpa >= 1.3) letterGrade = "D+"
      else if (gpa >= 1.0) letterGrade = "D"
    }

    setResult({
      gpa: gpa.toFixed(3),
      totalCredits,
      totalGradePoints: totalGradePoints.toFixed(2),
      letterGrade,
      validCourses,
      scale: gradeScale
    })
  }

  const getGradeOptions = () => {
    if (gradeScale === "percentage") {
      return null // Input field for percentage
    }
    return Object.keys(gradeScales[gradeScale]).map(grade => (
      <option key={grade} value={grade}>{grade}</option>
    ))
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <AdBanner position="top" />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">GPA Calculator</h1>

          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Grade Scale Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Grade Scale</label>
              <select
                value={gradeScale}
                onChange={(e) => setGradeScale(e.target.value)}
                className="w-full md:w-64 p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="4.0">4.0 Scale (Standard)</option>
                <option value="5.0">5.0 Scale (Weighted)</option>
                <option value="percentage">Percentage (0-100)</option>
              </select>
            </div>

            {/* Courses */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Courses</h2>
                <button
                  onClick={addCourse}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  + Add Course
                </button>
              </div>

              {/* Header */}
              <div className="hidden md:grid md:grid-cols-4 gap-4 text-sm font-semibold text-gray-600 border-b pb-2">
                <div>Course Name</div>
                <div>Grade</div>
                <div>Credits</div>
                <div>Actions</div>
              </div>

              {/* Course Entries */}
              {courses.map((course, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 md:p-0 md:border-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Course Name</label>
                      <input
                        type="text"
                        value={course.name}
                        onChange={(e) => updateCourse(index, 'name', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="e.g., Math 101"
                      />
                    </div>

                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Grade</label>
                      {gradeScale === "percentage" ? (
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={course.grade}
                          onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                          placeholder="0-100"
                        />
                      ) : (
                        <select
                          value={course.grade}
                          onChange={(e) => updateCourse(index, 'grade', e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        >
                          <option value="">Select Grade</option>
                          {getGradeOptions()}
                        </select>
                      )}
                    </div>

                    <div>
                      <label className="block md:hidden text-sm font-medium mb-1">Credits</label>
                      <input
                        type="number"
                        min="0"
                        step="0.5"
                        value={course.credits}
                        onChange={(e) => updateCourse(index, 'credits', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                        placeholder="Credits"
                      />
                    </div>

                    <div className="flex items-end">
                      {courses.length > 1 && (
                        <button
                          onClick={() => removeCourse(index)}
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

            <button
              onClick={calculateGPA}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded font-medium transition-colors text-lg"
            >
              Calculate GPA
            </button>

            {/* Results */}
            {result && (
              <div className="mt-6 space-y-4">
                {/* Summary */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-xl font-bold mb-3">GPA Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Current GPA</p>
                      <p className="text-2xl font-bold text-blue-600">{result.gpa}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Letter Grade</p>
                      <p className="text-2xl font-bold text-green-600">{result.letterGrade}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Total Credits</p>
                      <p className="text-2xl font-bold">{result.totalCredits}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-600">Grade Points</p>
                      <p className="text-2xl font-bold">{result.totalGradePoints}</p>
                    </div>
                  </div>
                </div>

                {/* Course Breakdown */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-lg font-bold mb-3">Course Breakdown</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Course</th>
                          <th className="text-center py-2">Grade</th>
                          <th className="text-center py-2">Credits</th>
                          <th className="text-center py-2">Grade Value</th>
                          <th className="text-center py-2">Grade Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {result.validCourses.map((course) => (
                          <tr key={course.index} className="border-b">
                            <td className="py-2">{course.name || `Course ${course.index}`}</td>
                            <td className="text-center py-2">{course.grade}</td>
                            <td className="text-center py-2">{course.credits}</td>
                            <td className="text-center py-2">{course.gradeValue.toFixed(2)}</td>
                            <td className="text-center py-2">{course.gradePoints.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Grade Scale Reference */}
          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-lg font-bold mb-3">Grade Scale Reference</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">4.0 Scale (Standard)</h4>
                <div className="text-sm space-y-1">
                  <p>A+, A = 4.0 | A- = 3.7</p>
                  <p>B+ = 3.3 | B = 3.0 | B- = 2.7</p>
                  <p>C+ = 2.3 | C = 2.0 | C- = 1.7</p>
                  <p>D+ = 1.3 | D = 1.0 | D- = 0.7</p>
                  <p>F = 0.0</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">GPA Interpretation</h4>
                <div className="text-sm space-y-1">
                  <p>3.7 - 4.0: Excellent (A)</p>
                  <p>3.0 - 3.6: Good (B)</p>
                  <p>2.0 - 2.9: Average (C)</p>
                  <p>1.0 - 1.9: Below Average (D)</p>
                  <p>0.0 - 0.9: Failing (F)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AdBanner position="bottom" />
    </div>
  )
}