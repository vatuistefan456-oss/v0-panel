"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { DollarSign, Coins, Package, User } from "lucide-react"

export function AdminShopManagement() {
  const [steamId, setSteamId] = useState("")
  const [realMoney, setRealMoney] = useState("")
  const [credits, setCredits] = useState("")
  const [reason, setReason] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [itemType, setItemType] = useState("case")
  const [itemId, setItemId] = useState("")
  const [quantity, setQuantity] = useState("1")

  const handleAddBalance = async () => {
    if (!steamId) {
      setMessage("Steam ID is required")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/add-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steamId,
          realMoney: realMoney ? Number.parseFloat(realMoney) : null,
          credits: credits ? Number.parseInt(credits) : null,
          reason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage("Balance added successfully!")
        setRealMoney("")
        setCredits("")
        setReason("")
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to add balance")
    } finally {
      setLoading(false)
    }
  }

  const handleAddItems = async () => {
    if (!steamId || !itemId) {
      setMessage("Steam ID and Item ID are required")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const response = await fetch("/api/admin/add-items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          steamId,
          itemType,
          itemId: Number.parseInt(itemId),
          quantity: Number.parseInt(quantity),
          reason,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        setItemId("")
        setQuantity("1")
        setReason("")
      } else {
        setMessage(`Error: ${data.error}`)
      }
    } catch (error) {
      setMessage("Failed to add items")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Player Search */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-5 h-5" />
          <h2 className="text-xl font-semibold">Player Lookup</h2>
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="steamId">Steam ID</Label>
            <Input
              id="steamId"
              placeholder="Enter Steam ID (e.g., 76561198012345678)"
              value={steamId}
              onChange={(e) => setSteamId(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Tabs for different actions */}
      <Tabs defaultValue="balance" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="balance">Add Balance</TabsTrigger>
          <TabsTrigger value="items">Add Items</TabsTrigger>
        </TabsList>

        <TabsContent value="balance">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="realMoney" className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Real Money (USD)
                  </Label>
                  <Input
                    id="realMoney"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={realMoney}
                    onChange={(e) => setRealMoney(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="credits" className="flex items-center gap-2">
                    <Coins className="w-4 h-4" />
                    Credits
                  </Label>
                  <Input
                    id="credits"
                    type="number"
                    placeholder="0"
                    value={credits}
                    onChange={(e) => setCredits(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="reason">Reason (Optional)</Label>
                <Textarea
                  id="reason"
                  placeholder="e.g., PayPal donation, compensation, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button onClick={handleAddBalance} disabled={loading || !steamId} className="w-full">
                {loading ? "Adding..." : "Add Balance"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="items">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="itemType" className="flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Item Type
                  </Label>
                  <Select value={itemType} onValueChange={setItemType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="case">Case</SelectItem>
                      <SelectItem value="skin">Skin</SelectItem>
                      <SelectItem value="agent">Agent</SelectItem>
                      <SelectItem value="charm">Charm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="itemId">Item ID</Label>
                  <Input
                    id="itemId"
                    type="number"
                    placeholder="Enter item ID"
                    value={itemId}
                    onChange={(e) => setItemId(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="itemReason">Reason (Optional)</Label>
                <Textarea
                  id="itemReason"
                  placeholder="e.g., Compensation, event reward, etc."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <Button onClick={handleAddItems} disabled={loading || !steamId || !itemId} className="w-full">
                {loading ? "Adding..." : "Add Items"}
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Display */}
      {message && (
        <Card className={`p-4 ${message.includes("Error") ? "border-red-500" : "border-green-500"}`}>
          <p className={message.includes("Error") ? "text-red-500" : "text-green-500"}>{message}</p>
        </Card>
      )}
    </div>
  )
}
