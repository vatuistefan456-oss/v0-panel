"use client"

import { useState } from "react"
import { Coins } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

type ShopCategory = "all" | "credits" | "cases" | "vip" | "shards"

const VIP_PACKAGES = [
  {
    id: "vip-starter",
    name: "VIP Starter",
    credits: 50000,
    price: 4.99,
    discount: -10,
    benefits: ["+2500 spawn money", "125 spawn armor", "+3 kill health"],
  },
  {
    id: "vip-pro",
    name: "VIP Pro",
    credits: 100000,
    price: 9.99,
    discount: -10,
    benefits: ["+5000 spawn money", "150 spawn armor", "+5 kill health", "Kill effects"],
  },
  {
    id: "vip-legend",
    name: "VIP Legend",
    credits: 200000,
    price: 19.99,
    discount: -10,
    benefits: ["+7500 spawn money", "200 spawn armor", "+10 kill health", "Kill effects"],
  },
]

export function ShopPageContent({ user, shopItems }: { user: any; shopItems: any[] }) {
  const [activeCategory, setActiveCategory] = useState<ShopCategory>("all")

  const displayUser = user || {
    credits: 1500,
    real_money_balance: 25.5,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Page Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Coins className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">CS2 Shop</h1>
            <p className="text-sm text-muted-foreground">Purchase credits, cases, and VIP packages</p>
          </div>
        </div>

        {/* Demo Mode Warning */}
        {!user && (
          <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
            <p className="text-sm text-amber-500">
              You are viewing in demo mode.{" "}
              <Link href="/login" className="underline font-medium">
                Login
              </Link>{" "}
              to make purchases.
            </p>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex items-center gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className={activeCategory === "all" ? "bg-primary text-primary-foreground" : ""}
          >
            All Items
          </Button>
          <Button
            variant={activeCategory === "credits" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("credits")}
            className={activeCategory === "credits" ? "bg-primary text-primary-foreground" : ""}
          >
            Credits
          </Button>
          <Button
            variant={activeCategory === "cases" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("cases")}
            className={activeCategory === "cases" ? "bg-primary text-primary-foreground" : ""}
          >
            Cases
          </Button>
          <Button
            variant={activeCategory === "vip" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("vip")}
            className={activeCategory === "vip" ? "bg-primary text-primary-foreground" : ""}
          >
            VIP
          </Button>
          <Button
            variant={activeCategory === "shards" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveCategory("shards")}
            className={activeCategory === "shards" ? "bg-primary text-primary-foreground" : ""}
          >
            Shards
          </Button>
        </div>

        {/* VIP Packages Section */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-foreground">VIP Packages</h2>
            <span className="text-sm text-muted-foreground">Unlock exclusive benefits</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VIP_PACKAGES.map((pkg) => (
              <div key={pkg.id} className="relative rounded-lg border border-border bg-card p-6">
                {/* Discount Badge */}
                <Badge variant="destructive" className="absolute top-4 right-4 text-xs">
                  {pkg.discount}%
                </Badge>

                {/* Package Name */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-3xl font-bold text-foreground">{pkg.credits.toLocaleString()}</span>
                    <span className="text-sm text-muted-foreground">credits</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-foreground">${pkg.price}</span>
                    <span className="text-sm text-muted-foreground">real money</span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  {pkg.benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {benefit}
                    </div>
                  ))}
                </div>

                {/* View Details Button */}
                <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground">View Details</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
