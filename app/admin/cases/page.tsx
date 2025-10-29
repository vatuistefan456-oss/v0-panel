"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import casesConfig from "@/CS2Plugin/cases-config.json"

export default function CasesManagementPage() {
  const [cases, setCases] = useState(casesConfig.cases)
  const [editingCase, setEditingCase] = useState<any>(null)

  const handlePriceChange = (caseId: string, newPrice: number) => {
    setCases(cases.map((c) => (c.id === caseId ? { ...c, price: newPrice } : c)))
  }

  const saveChanges = async () => {
    const response = await fetch("/api/admin/cases/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cases }),
    })

    if (response.ok) {
      alert("Configurația a fost salvată!")
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Gestionare Cutii CS2</h1>
        <p className="text-muted-foreground">Configurează prețurile și conținutul cutiilor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {cases.map((caseItem) => (
          <Card key={caseItem.id} className="p-4">
            <h3 className="font-bold text-lg mb-2">{caseItem.name}</h3>
            <div className="space-y-2">
              <div>
                <Label>Preț Cutie (Credite)</Label>
                <Input
                  type="number"
                  value={caseItem.price}
                  onChange={(e) => handlePriceChange(caseItem.id, Number.parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label>Preț Cheie (Credite)</Label>
                <Input
                  type="number"
                  value={caseItem.keyPrice}
                  onChange={(e) =>
                    setCases(
                      cases.map((c) =>
                        c.id === caseItem.id ? { ...c, keyPrice: Number.parseInt(e.target.value) } : c,
                      ),
                    )
                  }
                />
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Mil-Spec: {caseItem.contents.milSpec.length} items</p>
                <p>Restricted: {caseItem.contents.restricted.length} items</p>
                <p>Classified: {caseItem.contents.classified.length} items</p>
                <p>Covert: {caseItem.contents.covert.length} items</p>
                <p>Rare: {caseItem.contents.rare.length} items</p>
              </div>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setEditingCase(caseItem)}>
                Editează Conținut
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={saveChanges} className="w-full md:w-auto">
          Salvează Modificările
        </Button>
      </div>

      <Card className="mt-6 p-4">
        <h3 className="font-bold mb-2">Drop Rates (Procente Oficiale CS2)</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div>
            <p className="font-semibold text-blue-500">Mil-Spec</p>
            <p>{casesConfig.dropRates.milSpec}%</p>
          </div>
          <div>
            <p className="font-semibold text-purple-500">Restricted</p>
            <p>{casesConfig.dropRates.restricted}%</p>
          </div>
          <div>
            <p className="font-semibold text-pink-500">Classified</p>
            <p>{casesConfig.dropRates.classified}%</p>
          </div>
          <div>
            <p className="font-semibold text-red-500">Covert</p>
            <p>{casesConfig.dropRates.covert}%</p>
          </div>
          <div>
            <p className="font-semibold text-yellow-500">Rare (Knife)</p>
            <p>{casesConfig.dropRates.rare}%</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">StatTrak Chance: {casesConfig.dropRates.statTrakChance}%</p>
      </Card>
    </div>
  )
}
