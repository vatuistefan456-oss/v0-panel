"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, Coins } from "lucide-react"
import Image from "next/image"

interface Case {
  id: number
  case_key: string
  case_name: string
  case_image_url: string
  price_real_money: number
  price_credits: number
  rarity: string
  description: string
}

export function ShopCases() {
  const [cases, setCases] = useState<Case[]>([])
  const [loading, setLoading] = useState(true)
  const [purchasing, setPurchasing] = useState<number | null>(null)

  useEffect(() => {
    fetchCases()
  }, [])

  const fetchCases = async () => {
    try {
      const response = await fetch("/api/shop/cases")
      if (response.ok) {
        const data = await response.json()
        setCases(data)
      }
    } catch (error) {
      console.error("[v0] Failed to fetch cases:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePurchase = async (caseId: number, paymentMethod: "real_money" | "credits") => {
    setPurchasing(caseId)
    try {
      const response = await fetch("/api/shop/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, paymentMethod }),
      })

      if (response.ok) {
        alert("Purchase successful!")
      } else {
        const data = await response.json()
        alert(`Error: ${data.error}`)
      }
    } catch (error) {
      alert("Failed to purchase case")
    } finally {
      setPurchasing(null)
    }
  }

  const groupedCases = {
    prime: cases.filter((c) => c.rarity === "Prime"),
    armory: cases.filter((c) => c.rarity === "Armory"),
    rare: cases.filter((c) => c.rarity === "Rare"),
    operation: cases.filter((c) => c.rarity === "Operation"),
    classic: cases.filter((c) => c.rarity === "Classic"),
  }

  if (loading) {
    return <div className="text-center py-12">Loading cases...</div>
  }

  return (
    <Tabs defaultValue="prime" className="w-full">
      <TabsList className="grid w-full grid-cols-5">
        <TabsTrigger value="prime">Prime ({groupedCases.prime.length})</TabsTrigger>
        <TabsTrigger value="armory">Armory ({groupedCases.armory.length})</TabsTrigger>
        <TabsTrigger value="rare">Rare ({groupedCases.rare.length})</TabsTrigger>
        <TabsTrigger value="operation">Operation ({groupedCases.operation.length})</TabsTrigger>
        <TabsTrigger value="classic">Classic ({groupedCases.classic.length})</TabsTrigger>
      </TabsList>

      {Object.entries(groupedCases).map(([key, casesInCategory]) => (
        <TabsContent key={key} value={key}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {casesInCategory.map((caseItem) => (
              <Card key={caseItem.id} className="p-4">
                <div className="aspect-square relative mb-4 bg-muted rounded-lg overflow-hidden">
                  <Image
                    src={caseItem.case_image_url || "/placeholder.svg"}
                    alt={caseItem.case_name}
                    fill
                    className="object-contain"
                  />
                </div>

                <h3 className="font-semibold mb-2">{caseItem.case_name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{caseItem.description}</p>

                <div className="space-y-2">
                  <Button
                    onClick={() => handlePurchase(caseItem.id, "real_money")}
                    disabled={purchasing === caseItem.id}
                    className="w-full"
                    variant="default"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />${caseItem.price_real_money.toFixed(2)}
                  </Button>

                  <Button
                    onClick={() => handlePurchase(caseItem.id, "credits")}
                    disabled={purchasing === caseItem.id}
                    className="w-full"
                    variant="outline"
                  >
                    <Coins className="w-4 h-4 mr-2" />
                    {caseItem.price_credits.toLocaleString()} Credits
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  )
}
