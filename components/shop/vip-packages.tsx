"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, Check, X } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface VipPackage {
  id: string
  name: string
  price_credits: number | null
  price_real_money: number | null
  features: {
    spawnMoney: number
    spawnArmor: number
    killHealth: number
    killArmor: number
    hitInfo: string
    doubleJumps: string
    killEffect: boolean
    killFeedRevenge: boolean
    killFeedWipe: boolean
    medkitPrice: number
    quicksellBonus: number
    marketTVA: number
    multiCaseOpening: string
  }
}

const vipPackages: VipPackage[] = [
  {
    id: "vip-starter",
    name: "VIP Starter",
    price_credits: 50000,
    price_real_money: 4.99,
    features: {
      spawnMoney: 2500,
      spawnArmor: 125,
      killHealth: 3,
      killArmor: 3,
      hitInfo: "No",
      doubleJumps: "No",
      killEffect: false,
      killFeedRevenge: false,
      killFeedWipe: false,
      medkitPrice: 20,
      quicksellBonus: 20,
      marketTVA: 30,
      multiCaseOpening: "No",
    },
  },
  {
    id: "vip-pro",
    name: "VIP Pro",
    price_credits: 100000,
    price_real_money: 9.99,
    features: {
      spawnMoney: 5000,
      spawnArmor: 150,
      killHealth: 5,
      killArmor: 5,
      hitInfo: "Damage",
      doubleJumps: "10 / round",
      killEffect: true,
      killFeedRevenge: true,
      killFeedWipe: false,
      medkitPrice: 15,
      quicksellBonus: 20,
      marketTVA: 30,
      multiCaseOpening: "No",
    },
  },
  {
    id: "vip-legend",
    name: "VIP Legend",
    price_credits: 200000,
    price_real_money: 19.99,
    features: {
      spawnMoney: 7500,
      spawnArmor: 200,
      killHealth: 10,
      killArmor: 10,
      hitInfo: "Damage / Health",
      doubleJumps: "15 / round",
      killEffect: true,
      killFeedRevenge: true,
      killFeedWipe: true,
      medkitPrice: 10,
      quicksellBonus: 30,
      marketTVA: 20,
      multiCaseOpening: "Yes (5)",
    },
  },
]

export function VipPackages() {
  const [selectedPackage, setSelectedPackage] = useState<VipPackage | null>(null)

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vipPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className="p-6 bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => setSelectedPackage(pkg)}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground">{pkg.name}</h3>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                -10%
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-foreground">{pkg.price_credits?.toLocaleString()}</span>
                <span className="text-sm text-muted-foreground">credits</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-chart-4">${pkg.price_real_money?.toFixed(2)}</span>
                <span className="text-sm text-muted-foreground">real money</span>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-chart-3" />
                <span className="text-muted-foreground">+{pkg.features.spawnMoney} spawn money</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-chart-3" />
                <span className="text-muted-foreground">{pkg.features.spawnArmor} spawn armor</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Check className="w-4 h-4 text-chart-3" />
                <span className="text-muted-foreground">+{pkg.features.killHealth} kill health</span>
              </div>
              {pkg.features.killEffect && (
                <div className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-chart-3" />
                  <span className="text-muted-foreground">Kill effects</span>
                </div>
              )}
            </div>

            <Button className="w-full bg-transparent" variant="outline">
              View Details
            </Button>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedPackage} onOpenChange={() => setSelectedPackage(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-primary" />
              {selectedPackage?.name}
            </DialogTitle>
            <DialogDescription>Complete feature list and benefits</DialogDescription>
          </DialogHeader>

          {selectedPackage && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent/50 rounded-lg">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Credits Price</p>
                  <p className="text-2xl font-bold text-foreground">
                    {selectedPackage.price_credits?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Real Money Price</p>
                  <p className="text-2xl font-bold text-chart-4">${selectedPackage.price_real_money?.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-semibold text-foreground">Features:</h4>
                <div className="grid grid-cols-2 gap-3">
                  <FeatureRow label="Spawn money" value={`+${selectedPackage.features.spawnMoney}`} />
                  <FeatureRow label="Spawn armor" value={selectedPackage.features.spawnArmor.toString()} />
                  <FeatureRow label="Kill health" value={selectedPackage.features.killHealth.toString()} />
                  <FeatureRow label="Kill armor" value={selectedPackage.features.killArmor.toString()} />
                  <FeatureRow label="Hit info" value={selectedPackage.features.hitInfo} />
                  <FeatureRow label="Double jumps" value={selectedPackage.features.doubleJumps} />
                  <FeatureRow
                    label="Kill effect"
                    value={selectedPackage.features.killEffect ? "Yes" : "No"}
                    isBoolean
                    boolValue={selectedPackage.features.killEffect}
                  />
                  <FeatureRow
                    label="Kill feed (revenge)"
                    value={selectedPackage.features.killFeedRevenge ? "Yes" : "No"}
                    isBoolean
                    boolValue={selectedPackage.features.killFeedRevenge}
                  />
                  <FeatureRow
                    label="Kill feed (wipe)"
                    value={selectedPackage.features.killFeedWipe ? "Yes" : "No"}
                    isBoolean
                    boolValue={selectedPackage.features.killFeedWipe}
                  />
                  <FeatureRow label="Medkit price" value={selectedPackage.features.medkitPrice.toString()} />
                  <FeatureRow label="Quicksell items" value={`${selectedPackage.features.quicksellBonus}%`} />
                  <FeatureRow label="Market TVA" value={`${selectedPackage.features.marketTVA}%`} />
                  <FeatureRow label="Multi case opening" value={selectedPackage.features.multiCaseOpening} />
                </div>
              </div>

              <Button className="w-full" size="lg">
                Purchase Package
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

function FeatureRow({
  label,
  value,
  isBoolean,
  boolValue,
}: {
  label: string
  value: string
  isBoolean?: boolean
  boolValue?: boolean
}) {
  return (
    <div className="flex items-center justify-between p-2 bg-card rounded border border-border">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        {isBoolean &&
          (boolValue ? <Check className="w-4 h-4 text-chart-3" /> : <X className="w-4 h-4 text-destructive" />)}
        <span className="text-sm font-medium text-foreground">{value}</span>
      </div>
    </div>
  )
}
