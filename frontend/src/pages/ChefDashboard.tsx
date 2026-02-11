import { useState } from "react";
import { motion } from "framer-motion";
import { ChefHat, Users, Calculator, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecipes } from "@/services/api";

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

interface Recipe {
  _id: string;
  name: string;
  baseServings: number;
  ingredients: Ingredient[];
}

const ChefDashboard = () => {
  const [selectedDish, setSelectedDish] = useState("");
  const [servings, setServings] = useState("");
  const [calculatedIngredients, setCalculatedIngredients] = useState<Ingredient[] | null>(null);

  // Fetch recipes from API
  const { data: recipes = [], isLoading, error } = useQuery<Recipe[]>({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  });

  const handleCalculate = () => {
    const recipe = recipes.find((r) => r.name === selectedDish);
    if (!recipe || !servings || Number(servings) <= 0) return;

    const multiplier = Number(servings) / recipe.baseServings;
    const scaled = recipe.ingredients.map((ing) => ({
      ...ing,
      quantity: (parseFloat(ing.quantity) * multiplier).toFixed(1).replace(/\.0$/, ""),
    }));
    setCalculatedIngredients(scaled);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading recipes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-destructive font-semibold mb-2">Error loading recipes</p>
              <p className="text-sm text-muted-foreground">
                Please make sure the backend server is running on http://localhost:5000
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <ChefHat className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Chef Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Select a dish and number of servings to get precise ingredient quantities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-display">
                <Calculator className="h-5 w-5 text-primary" />
                Ingredient Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Select Dish</Label>
                  <Select value={selectedDish} onValueChange={setSelectedDish}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a dish..." />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes.map((r) => (
                        <SelectItem key={r.name} value={r.name}>
                          {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Number of Servings</Label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 50"
                        value={servings}
                        onChange={(e) => setServings(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={handleCalculate} className="gradient-primary border-0">
                      Calculate
                    </Button>
                  </div>
                </div>
              </div>

              {calculatedIngredients && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="rounded-xl border border-border bg-muted/50 p-6"
                >
                  <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                    Ingredients for {servings} servings of {selectedDish}
                  </h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {calculatedIngredients.map((ing) => (
                      <div
                        key={ing.name}
                        className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
                      >
                        <span className="font-medium text-foreground">{ing.name}</span>
                        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                          {ing.quantity} {ing.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ChefDashboard;
