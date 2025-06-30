import Link from "next/link"
import Image from "next/image"

export default function CategoriesSection() {
  const categories = [
    {
      title: "Financial Calculators",
      icon: "/placeholder.svg?height=80&width=80",
      calculators: [
        { name: "Mortgage Calculator", href: "/mortgage" },
        { name: "Loan Calculator", href: "/loan" },
        { name: "Auto Loan Calculator", href: "/auto-loan" },
        { name: "Interest Calculator", href: "/interest" },
        { name: "Payment Calculator", href: "/payment" },
        { name: "Retirement Calculator", href: "/retirement" },
        { name: "Amortization Calculator", href: "/amortization" },
        { name: "Investment Calculator", href: "/investment" },
        { name: "Inflation Calculator", href: "/inflation" },
        { name: "Finance Calculator", href: "/finance" },
        { name: "Income Tax Calculator", href: "/income-tax" },
        { name: "Compound Interest Calculator", href: "/compound-interest" },
        { name: "Salary Calculator", href: "/salary" },
        { name: "Interest Rate Calculator", href: "/interest-rate" },
        { name: "Sales Tax Calculator", href: "/sales-tax" },
      ],
    },
    {
      title: "Fitness & Health Calculators",
      icon: "/placeholder.svg?height=80&width=80",
      calculators: [
        { name: "BMI Calculator", href: "/bmi" },
        { name: "Calorie Calculator", href: "/calorie" },
        { name: "Body Fat Calculator", href: "/body-fat" },
        { name: "BMR Calculator", href: "/bmr" },
        { name: "Ideal Weight Calculator", href: "/ideal-weight" },
        { name: "Pace Calculator", href: "/pace" },
        { name: "Pregnancy Calculator", href: "/pregnancy" },
        { name: "Pregnancy Conception Calculator", href: "/pregnancy-conception" },
        { name: "Due Date Calculator", href: "/due-date" },
      ],
    },
    {
      title: "Math Calculators",
      icon: "/placeholder.svg?height=80&width=80",
      calculators: [
        { name: "Scientific Calculator", href: "/scientific" },
        { name: "Fraction Calculator", href: "/fraction" },
        { name: "Percentage Calculator", href: "/percentage" },
        { name: "Random Number Generator", href: "/random-number" },
        { name: "Triangle Calculator", href: "/triangle" },
        { name: "Standard Deviation Calculator", href: "/standard-deviation" },
      ],
    },
    {
      title: "Other Calculators",
      icon: "/placeholder.svg?height=80&width=80",
      calculators: [
        { name: "Age Calculator", href: "/age" },
        { name: "Date Calculator", href: "/date" },
        { name: "Time Calculator", href: "/time" },
        { name: "Hours Calculator", href: "/hours" },
        { name: "GPA Calculator", href: "/gpa" },
        { name: "Grade Calculator", href: "/grade" },
        { name: "Concrete Calculator", href: "/concrete" },
        { name: "Subnet Calculator", href: "/subnet" },
        { name: "Password Generator", href: "/password" },
        { name: "Conversion Calculator", href: "/conversion" },
      ],
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {categories.map((category, index) => (
        <div key={index} className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-4">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gray-100 flex items-center justify-center">
              <Image
                src={category.icon || "/placeholder.svg"}
                alt={category.title}
                width={60}
                height={60}
                className="rounded-full"
              />
            </div>
            <h3 className="text-lg font-bold text-green-700">{category.title}</h3>
          </div>
          <ul className="space-y-1">
            {category.calculators.map((calc, calcIndex) => (
              <li key={calcIndex}>
                <Link href={calc.href} className="text-blue-600 hover:text-blue-800 hover:underline text-sm">
                  {calc.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
