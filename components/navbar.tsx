"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, User, Settings, Download, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut, isAdmin, isCreator } = useAuth()
  const pathname = usePathname()

  const navLinks = [
    { name: "Social", href: "#social" },
    { name: "Software", href: "/software" },
    { name: "AI Assistant", href: "#ai" },
  ]

  // Get initials for avatar fallback
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2)
    : "U"

  return (
    <header className="fixed w-full bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-purple-700">
              DaniDema
            </Link>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-foreground hover:text-purple-700 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/profile"
                className="text-foreground hover:text-purple-700 font-medium transition-colors flex items-center"
              >
                <Download className="mr-1 h-4 w-4" />
                My Downloads
              </Link>
            )}
            <Link
              href="/settings"
              className="text-foreground hover:text-purple-700 font-medium transition-colors flex items-center"
            >
              <Settings className="mr-1 h-4 w-4" />
              Settings
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-red-600 hover:text-red-800 font-medium transition-colors flex items-center"
              >
                <Shield className="mr-1 h-4 w-4" />
                Admin
              </Link>
            )}
            {isCreator && (
              <Link
                href="/creator"
                className={cn(
                  "flex items-center text-sm font-medium transition-colors hover:text-primary",
                  pathname === "/creator" ? "text-primary" : "text-muted-foreground",
                )}
              >
                Creator Dashboard
              </Link>
            )}
          </nav>

          {/* User menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar || "/default-avatar.png"} alt={user.name} />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/software" className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      <span>Software</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin" className="cursor-pointer text-red-600">
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer text-red-600 focus:text-red-600"
                    onClick={() => signOut()}
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/settings">
                    <Settings className="mr-1 h-4 w-4" />
                    Settings
                  </Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/auth/signin">Sign in</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-foreground hover:text-purple-700 font-medium text-lg py-2 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                {user && (
                  <Link
                    href="/profile"
                    className="text-foreground hover:text-purple-700 font-medium text-lg py-2 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Download className="mr-2 h-5 w-5" />
                    My Downloads
                  </Link>
                )}
                <Link
                  href="/settings"
                  className="text-foreground hover:text-purple-700 font-medium text-lg py-2 transition-colors flex items-center"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </Link>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-red-600 hover:text-red-800 font-medium text-lg py-2 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Admin Dashboard
                  </Link>
                )}
                <div className="pt-4 border-t">
                  {user ? (
                    <>
                      <Link
                        href="/profile"
                        className="flex items-center text-foreground hover:text-purple-700 font-medium text-lg py-2 transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        <User className="mr-2 h-5 w-5" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          signOut()
                          setIsOpen(false)
                        }}
                        className="flex items-center text-red-600 hover:text-red-800 font-medium text-lg py-2 transition-colors w-full text-left"
                      >
                        Sign out
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth/signin"
                      className="flex items-center text-purple-700 hover:text-purple-900 font-medium text-lg py-2 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign in
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
