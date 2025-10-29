"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, Trash2, Save } from "lucide-react"

interface Mission {
  id: string
  name: string
  description: string
  type: string
  weapon?: string
  target: number
  credits_reward: number
  xp_reward: number
  enabled: boolean
}

interface Config {
  Missions: {
    Daily: Mission[]
    Weekly: Mission[]
    Monthly: Mission[]
  }
  Clans: {
    MaxMembers: number
    CreateCost: number
    SkillUpgradeCosts: Record<string, number>
    MaxSkillLevel: number
    SkillBonusPerLevel: Record<string, number>
  }
  Credits: {
    KillReward: number
    HeadshotReward: number
    WinReward: number
    MVPReward: number
    DeathPenalty: number
    SuicidePenalty: number
  }
}

export default function ConfigPage() {
  const [config, setConfig] = useState<Config | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadConfig()
  }, [])

  const loadConfig = async () => {
    try {
      const response = await fetch("/api/admin/config")
      const data = await response.json()

      if (data.success) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error("[v0] Error loading config:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut încărca configurația",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const saveConfig = async () => {
    if (!config) return

    setSaving(true)
    try {
      const response = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Succes",
          description: "Configurația a fost salvată",
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      console.error("[v0] Error saving config:", error)
      toast({
        title: "Eroare",
        description: "Nu s-a putut salva configurația",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addMission = (period: "Daily" | "Weekly" | "Monthly") => {
    if (!config) return

    const newMission: Mission = {
      id: `${period.toLowerCase()}_${Date.now()}`,
      name: "Misiune Nouă",
      description: "Descriere misiune",
      type: "weapon_kills",
      target: 10,
      credits_reward: 500,
      xp_reward: 100,
      enabled: true,
    }

    setConfig({
      ...config,
      Missions: {
        ...config.Missions,
        [period]: [...config.Missions[period], newMission],
      },
    })
  }

  const updateMission = (period: "Daily" | "Weekly" | "Monthly", index: number, field: keyof Mission, value: any) => {
    if (!config) return

    const updatedMissions = [...config.Missions[period]]
    updatedMissions[index] = {
      ...updatedMissions[index],
      [field]: value,
    }

    setConfig({
      ...config,
      Missions: {
        ...config.Missions,
        [period]: updatedMissions,
      },
    })
  }

  const deleteMission = (period: "Daily" | "Weekly" | "Monthly", index: number) => {
    if (!config) return

    setConfig({
      ...config,
      Missions: {
        ...config.Missions,
        [period]: config.Missions[period].filter((_, i) => i !== index),
      },
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card>
          <CardHeader>
            <CardTitle>Eroare</CardTitle>
            <CardDescription>Nu s-a putut încărca configurația</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Configurare Server</h1>
          <p className="text-sm md:text-base text-muted-foreground">Gestionează misiuni, clan-uri și recompense</p>
        </div>
        <Button onClick={saveConfig} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvare...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Salvează Config
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="missions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missions">Misiuni</TabsTrigger>
          <TabsTrigger value="clans">Clan-uri</TabsTrigger>
          <TabsTrigger value="credits">Credite</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          <Tabs defaultValue="daily">
            <TabsList>
              <TabsTrigger value="daily">Daily ({config.Missions.Daily.length})</TabsTrigger>
              <TabsTrigger value="weekly">Weekly ({config.Missions.Weekly.length})</TabsTrigger>
              <TabsTrigger value="monthly">Monthly ({config.Missions.Monthly.length})</TabsTrigger>
            </TabsList>

            {(["daily", "weekly", "monthly"] as const).map((period) => (
              <TabsContent key={period} value={period} className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold capitalize">Misiuni {period}</h3>
                  <Button onClick={() => addMission((period.charAt(0).toUpperCase() + period.slice(1)) as any)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Adaugă Misiune
                  </Button>
                </div>

                <div className="grid gap-4">
                  {config.Missions[
                    (period.charAt(0).toUpperCase() + period.slice(1)) as "Daily" | "Weekly" | "Monthly"
                  ].map((mission, index) => (
                    <Card key={mission.id}>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <div className="space-y-1 flex-1">
                            <Input
                              value={mission.name}
                              onChange={(e) =>
                                updateMission(
                                  (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="font-semibold text-lg"
                            />
                            <Textarea
                              value={mission.description}
                              onChange={(e) =>
                                updateMission(
                                  (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                  index,
                                  "description",
                                  e.target.value,
                                )
                              }
                              className="text-sm"
                              rows={2}
                            />
                          </div>
                          <div className="flex items-center gap-2 ml-4">
                            <Switch
                              checked={mission.enabled}
                              onCheckedChange={(checked) =>
                                updateMission(
                                  (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                  index,
                                  "enabled",
                                  checked,
                                )
                              }
                            />
                            <Button
                              variant="destructive"
                              size="icon"
                              onClick={() =>
                                deleteMission((period.charAt(0).toUpperCase() + period.slice(1)) as any, index)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Tip</Label>
                          <Input
                            value={mission.type}
                            onChange={(e) =>
                              updateMission(
                                (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                index,
                                "type",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                        {mission.weapon && (
                          <div className="space-y-2">
                            <Label>Armă</Label>
                            <Input
                              value={mission.weapon}
                              onChange={(e) =>
                                updateMission(
                                  (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                  index,
                                  "weapon",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label>Target</Label>
                          <Input
                            type="number"
                            value={mission.target}
                            onChange={(e) =>
                              updateMission(
                                (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                index,
                                "target",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Credite Recompensă</Label>
                          <Input
                            type="number"
                            value={mission.credits_reward}
                            onChange={(e) =>
                              updateMission(
                                (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                index,
                                "credits_reward",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>XP Recompensă</Label>
                          <Input
                            type="number"
                            value={mission.xp_reward}
                            onChange={(e) =>
                              updateMission(
                                (period.charAt(0).toUpperCase() + period.slice(1)) as any,
                                index,
                                "xp_reward",
                                Number.parseInt(e.target.value),
                              )
                            }
                          />
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </TabsContent>

        <TabsContent value="clans" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Setări Clan-uri</CardTitle>
              <CardDescription>Configurează costurile și bonusurile pentru clan-uri</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Membri Maximi</Label>
                  <Input
                    type="number"
                    value={config.Clans.MaxMembers}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        Clans: { ...config.Clans, MaxMembers: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cost Creare Clan</Label>
                  <Input
                    type="number"
                    value={config.Clans.CreateCost}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        Clans: { ...config.Clans, CreateCost: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nivel Maxim Skill</Label>
                  <Input
                    type="number"
                    value={config.Clans.MaxSkillLevel}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        Clans: { ...config.Clans, MaxSkillLevel: Number.parseInt(e.target.value) },
                      })
                    }
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Costuri Upgrade Skill-uri</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(config.Clans.SkillUpgradeCosts).map(([skill, cost]) => (
                    <div key={skill} className="space-y-2">
                      <Label className="capitalize">{skill}</Label>
                      <Input
                        type="number"
                        value={cost}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            Clans: {
                              ...config.Clans,
                              SkillUpgradeCosts: {
                                ...config.Clans.SkillUpgradeCosts,
                                [skill]: Number.parseInt(e.target.value),
                              },
                            },
                          })
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sistem Credite</CardTitle>
              <CardDescription>Configurează recompensele și penalitățile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(config.Credits).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</Label>
                    <Input
                      type="number"
                      value={value}
                      onChange={(e) =>
                        setConfig({
                          ...config,
                          Credits: {
                            ...config.Credits,
                            [key]: Number.parseInt(e.target.value),
                          },
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
