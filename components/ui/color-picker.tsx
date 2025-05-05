"use client"

import { useState, useEffect } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Check, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  className?: string
}

const predefinedColors = [
  { name: "Red", value: "#ef4444", class: "bg-red-500" },
  { name: "Orange", value: "#f97316", class: "bg-orange-500" },
  { name: "Amber", value: "#f59e0b", class: "bg-amber-500" },
  { name: "Yellow", value: "#eab308", class: "bg-yellow-500" },
  { name: "Lime", value: "#84cc16", class: "bg-lime-500" },
  { name: "Green", value: "#22c55e", class: "bg-green-500" },
  { name: "Emerald", value: "#10b981", class: "bg-emerald-500" },
  { name: "Teal", value: "#14b8a6", class: "bg-teal-500" },
  { name: "Cyan", value: "#06b6d4", class: "bg-cyan-500" },
  { name: "Sky", value: "#0ea5e9", class: "bg-sky-500" },
  { name: "Blue", value: "#3b82f6", class: "bg-blue-500" },
  { name: "Indigo", value: "#6366f1", class: "bg-indigo-500" },
  { name: "Violet", value: "#8b5cf6", class: "bg-violet-500" },
  { name: "Purple", value: "#a855f7", class: "bg-purple-500" },
  { name: "Fuchsia", value: "#d946ef", class: "bg-fuchsia-500" },
  { name: "Pink", value: "#ec4899", class: "bg-pink-500" },
  { name: "Rose", value: "#f43f5e", class: "bg-rose-500" },
  { name: "Gray", value: "#6b7280", class: "bg-gray-500" },
  { name: "Slate", value: "#64748b", class: "bg-slate-500" },
  { name: "Zinc", value: "#71717a", class: "bg-zinc-500" },
]

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [selectedColor, setSelectedColor] = useState(value)

  useEffect(() => {
    setSelectedColor(value)
  }, [value])

  const handleColorChange = (color: string) => {
    setSelectedColor(color)
    onChange(color)
  }

  const selectedColorObj = predefinedColors.find((c) => c.value === selectedColor) || predefinedColors[0]

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className={cn("w-full justify-between", className)}>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: selectedColor }} />
            <span>{selectedColorObj.name}</span>
          </div>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0">
        <div className="grid grid-cols-5 gap-1 p-2">
          {predefinedColors.map((color) => (
            <button
              key={color.value}
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center",
                color.class,
                "hover:scale-110 transition-transform",
              )}
              onClick={() => handleColorChange(color.value)}
              title={color.name}
            >
              {selectedColor === color.value && <Check className="h-4 w-4 text-white" />}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}
