"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface ItemPrice {
  id: string
  weaponName: string
  skinName: string
  rarity: string
  normalMin: number
  normalMax: number
  stattrakMin: number
  stattrakMax: number
  souvenirMin: number
  souvenirMax: number
  paintIndex: string
  createdAt: string
  updatedAt: string
}

export async function getItemPrice(weaponName: string, skinName: string) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("item_prices")
      .select("*")
      .eq("weapon_name", weaponName)
      .eq("skin_name", skinName)
      .maybeSingle()

    if (error) {
      console.error("[v0] Error fetching item price:", error)
      return { success: true, price: null }
    }

    if (!data) {
      console.log("[v0] No price found for:", weaponName, skinName)
      return { success: true, price: null }
    }

    const price: ItemPrice = {
      id: data.id,
      weaponName: data.weapon_name,
      skinName: data.skin_name,
      rarity: data.rarity,
      normalMin: data.normal_min,
      normalMax: data.normal_max,
      stattrakMin: data.stattrak_min,
      stattrakMax: data.stattrak_max,
      souvenirMin: data.souvenir_min,
      souvenirMax: data.souvenir_max,
      paintIndex: data.paint_index,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    }

    return { success: true, price }
  } catch (error) {
    console.error("[v0] Error in getItemPrice:", error)
    return { success: true, price: null }
  }
}

export async function upsertItemPrice(
  weaponName: string,
  skinName: string,
  rarity: string,
  normalMin: number,
  normalMax: number,
  stattrakMin: number,
  stattrakMax: number,
  souvenirMin: number,
  souvenirMax: number,
  paintIndex?: string,
) {
  try {
    const supabase = await getSupabaseServerClient()

    const { data, error } = await supabase
      .from("item_prices")
      .upsert(
        {
          weapon_name: weaponName,
          skin_name: skinName,
          rarity,
          normal_min: normalMin,
          normal_max: normalMax,
          stattrak_min: stattrakMin,
          stattrak_max: stattrakMax,
          souvenir_min: souvenirMin,
          souvenir_max: souvenirMax,
          paint_index: paintIndex || "",
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "weapon_name,skin_name",
        },
      )
      .select()
      .single()

    if (error) {
      console.error("[v0] Error upserting item price:", error)
      return { success: false, error: error.message }
    }

    return { success: true, data }
  } catch (error) {
    console.error("[v0] Error in upsertItemPrice:", error)
    return { success: false, error: String(error) }
  }
}

export function generatePricesByRarity(rarity: string): {
  normalMin: number
  normalMax: number
  stattrakMin: number
  stattrakMax: number
  souvenirMin: number
  souvenirMax: number
} {
  // Base prices by rarity (in credits)
  const rarityPrices: Record<string, number> = {
    "Consumer Grade": 50,
    "Industrial Grade": 100,
    "Mil-Spec Grade": 500,
    "Mil-Spec": 500,
    Restricted: 2000,
    Classified: 8000,
    Covert: 30000,
    Contraband: 100000,
    Extraordinary: 150000,
  }

  const basePrice = rarityPrices[rarity] || 100

  return {
    normalMin: basePrice,
    normalMax: Math.floor(basePrice * 2.7),
    stattrakMin: Math.floor(basePrice * 1.5),
    stattrakMax: Math.floor(basePrice * 4),
    souvenirMin: Math.floor(basePrice * 1.7),
    souvenirMax: Math.floor(basePrice * 4.7),
  }
}
