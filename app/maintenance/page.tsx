import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default async function MaintenancePage() {
  // Fetch the maintenance message from the API
  let maintenanceMessage = "We're currently performing maintenance. Please check back later."

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/api/admin/site-settings`,
    )

    if (response.ok) {
      const settings = await response.json()
      maintenanceMessage = settings.maintenanceMessage || maintenanceMessage
    }
  } catch (error) {
    console.error("Error fetching maintenance message:", error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Site Maintenance</CardTitle>
          <CardDescription className="text-center">We'll be back soon!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-amber-500"
              >
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
            </div>
          </div>
          <p className="text-center mb-6">{maintenanceMessage}</p>
          <div className="text-center text-sm text-muted-foreground">
            <p>Our team is working hard to improve the site for you.</p>
            <p>Thank you for your patience.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="mailto:support@danidema.xyz">Contact Support</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
