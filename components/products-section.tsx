"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Sample product data - replace with your own
const sampleProducts = [
  {
    id: 1,
    name: "Product One",
    description: "This is a description for Product One. Replace with your actual product details.",
    image: "/placeholder.svg?height=200&width=300",
    price: "$99",
  },
  {
    id: 2,
    name: "Product Two",
    description: "This is a description for Product Two. Replace with your actual product details.",
    image: "/placeholder.svg?height=200&width=300",
    price: "$149",
  },
  {
    id: 3,
    name: "Product Three",
    description: "This is a description for Product Three. Replace with your actual product details.",
    image: "/placeholder.svg?height=200&width=300",
    price: "$199",
  },
]

export default function ProductsSection() {
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sampleProducts.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
          <div className="aspect-video w-full overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105"
            />
          </div>
          <CardHeader>
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.price}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{product.description}</p>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{product.name}</DialogTitle>
                  <DialogDescription>{product.price}</DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-md mb-4"
                  />
                  <p>{product.description}</p>
                </div>
                <Button className="w-full">Buy Now</Button>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
