"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Purchase = {
  id: string
  name: string
  date: string
  amount: string
  status: "completed" | "pending" | "refunded"
  type: "software" | "subscription"
}

// Sample purchase data - in a real app, this would come from an API
const samplePurchases: Purchase[] = [
  {
    id: "INV-001",
    name: "Software One Pro License",
    date: "2023-04-15",
    amount: "$99.00",
    status: "completed",
    type: "software",
  },
  {
    id: "INV-002",
    name: "Software Two Premium",
    date: "2023-05-22",
    amount: "$149.00",
    status: "completed",
    type: "software",
  },
  {
    id: "INV-003",
    name: "Monthly Subscription",
    date: "2023-06-01",
    amount: "$19.99",
    status: "pending",
    type: "subscription",
  },
  {
    id: "INV-004",
    name: "Software Three Enterprise",
    date: "2023-03-10",
    amount: "$299.00",
    status: "refunded",
    type: "software",
  },
]

export default function PurchaseHistory() {
  const [purchases] = useState<Purchase[]>(samplePurchases)

  const getStatusColor = (status: Purchase["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "pending":
        return "bg-yellow-500"
      case "refunded":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase History</CardTitle>
        <CardDescription>View your past purchases and subscriptions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="software">Software</TabsTrigger>
            <TabsTrigger value="subscription">Subscriptions</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-4">
              {purchases.map((purchase) => (
                <PurchaseItem
                  key={purchase.id}
                  purchase={purchase}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="software">
            <div className="space-y-4">
              {purchases
                .filter((p) => p.type === "software")
                .map((purchase) => (
                  <PurchaseItem
                    key={purchase.id}
                    purchase={purchase}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="subscription">
            <div className="space-y-4">
              {purchases
                .filter((p) => p.type === "subscription")
                .map((purchase) => (
                  <PurchaseItem
                    key={purchase.id}
                    purchase={purchase}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function PurchaseItem({
  purchase,
  formatDate,
  getStatusColor,
}: {
  purchase: Purchase
  formatDate: (date: string) => string
  getStatusColor: (status: Purchase["status"]) => string
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border rounded-lg">
      <div className="space-y-1 mb-2 md:mb-0">
        <div className="flex items-center">
          <h4 className="font-medium">{purchase.name}</h4>
          <Badge className={`ml-2 ${getStatusColor(purchase.status)}`} variant="outline">
            {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {purchase.id} • {formatDate(purchase.date)}
        </p>
      </div>
      <div className="font-medium">{purchase.amount}</div>
    </div>
  )
}
