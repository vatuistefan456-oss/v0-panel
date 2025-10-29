import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Plus, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function RecipesPage() {
  const recipes = [
    {
      id: 1,
      name: "Golden AK-47",
      ingredients: ["AK-47 Skin", "Gold Dust x5", "Crafting Token"],
      result: "Golden AK-47 Skin",
      rarity: "Legendary",
    },
    {
      id: 2,
      name: "Diamond AWP",
      ingredients: ["AWP Skin", "Diamond Fragment x3", "Crafting Token"],
      result: "Diamond AWP Skin",
      rarity: "Mythic",
    },
    {
      id: 3,
      name: "Elite Knife",
      ingredients: ["Basic Knife", "Elite Essence x10", "Crafting Token x2"],
      result: "Elite Knife Skin",
      rarity: "Legendary",
    },
  ]

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-foreground">Recipes</h1>
            <Badge variant="default" className="text-xs">
              NEW
            </Badge>
          </div>
          <p className="text-muted-foreground">Craft unique items using recipes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create Recipe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <Card key={recipe.id} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{recipe.name}</CardTitle>
                    <Badge variant="outline" className="mt-1">
                      {recipe.rarity}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-2">Ingredients:</p>
                  <ul className="space-y-1">
                    {recipe.ingredients.map((ingredient, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                        <Sparkles className="w-3 h-3 text-primary" />
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground mb-1">Result:</p>
                  <p className="text-sm font-bold text-primary">{recipe.result}</p>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  View Recipe
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
