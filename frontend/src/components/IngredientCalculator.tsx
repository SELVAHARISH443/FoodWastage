import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Search, Loader2, Users, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRecipeByName, getRecipes } from "@/services/api";

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

const IngredientCalculator = () => {
    const [dishName, setDishName] = useState("");
    const [servings, setServings] = useState("");
    const [calculatedIngredients, setCalculatedIngredients] = useState<Ingredient[] | null>(null);
    const [fetchedRecipe, setFetchedRecipe] = useState<Recipe | null>(null);
    const [isLoadingRecipe, setIsLoadingRecipe] = useState(false);
    const [recipeError, setRecipeError] = useState<string | null>(null);

    const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const suggestionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchAllRecipes = async () => {
            try {
                const data = await getRecipes();
                setAllRecipes(data.data || data);
            } catch (err) {
                console.error("Failed to fetch recipes for autocomplete", err);
            }
        };
        fetchAllRecipes();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredSuggestions = allRecipes.filter((r) =>
        r.name.toLowerCase().includes(dishName.toLowerCase())
    );

    const handleFetchRecipe = async (nameToFetch?: string) => {
        const targetName = nameToFetch || dishName.trim();
        if (!targetName) return;
        setIsLoadingRecipe(true);
        setRecipeError(null);
        setShowSuggestions(false);
        try {
            const recipe = await getRecipeByName(targetName);
            setFetchedRecipe(recipe);
            setCalculatedIngredients(null);
            setDishName(recipe.name);
        } catch (error: any) {
            setRecipeError(error.response?.data?.message || "Recipe not found");
            setFetchedRecipe(null);
        } finally {
            setIsLoadingRecipe(false);
        }
    };

    const handleCalculate = () => {
        if (!fetchedRecipe || !servings || Number(servings) <= 0) return;
        const multiplier = Number(servings) / fetchedRecipe.baseServings;
        const scaled = fetchedRecipe.ingredients.map((ing) => {
            const numericValue = parseFloat(ing.quantity);
            const isNumeric = !isNaN(numericValue) && isFinite(numericValue);
            return {
                ...ing,
                quantity: isNumeric
                    ? (numericValue * multiplier).toFixed(1).replace(/\.0$/, "")
                    : ing.quantity,
            };
        });
        setCalculatedIngredients(scaled);
    };

    return (
        <Card className="shadow-soft">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display">
                    <Calculator className="h-5 w-5 text-primary" />
                    Ingredient Calculator
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Enter Dish Name</Label>
                        <div className="flex gap-2">
                            <div className="relative flex-1" ref={suggestionRef}>
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="text"
                                    placeholder="e.g. Chicken Biryani"
                                    value={dishName}
                                    onChange={(e) => {
                                        setDishName(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    className="pl-9"
                                />
                                {showSuggestions && dishName.trim() && filteredSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 z-50 mt-1 w-full rounded-md border border-border bg-popover text-popover-foreground shadow-md animate-in fade-in-80 zoom-in-95">
                                        <div className="max-h-60 overflow-y-auto w-full p-1">
                                            {filteredSuggestions.map((suggestion) => (
                                                <div
                                                    key={suggestion._id}
                                                    className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-2 pl-3 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                    onClick={() => {
                                                        setDishName(suggestion.name);
                                                        setShowSuggestions(false);
                                                        handleFetchRecipe(suggestion.name);
                                                    }}
                                                >
                                                    {suggestion.name}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={() => handleFetchRecipe()}
                                disabled={!dishName.trim() || isLoadingRecipe}
                                className="gradient-primary border-0"
                            >
                                {isLoadingRecipe ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get Ingredients"}
                            </Button>
                        </div>
                        {recipeError && <p className="text-sm text-destructive">{recipeError}</p>}
                    </div>

                    {fetchedRecipe && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="rounded-xl border border-border bg-muted/50 p-6"
                        >
                            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                                Base Ingredients for {fetchedRecipe.name} ({fetchedRecipe.baseServings} servings)
                            </h3>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {fetchedRecipe.ingredients.map((ing) => (
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

                    {fetchedRecipe && (
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
                    )}

                    {calculatedIngredients && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="rounded-xl border border-border bg-muted/50 p-6"
                        >
                            <h3 className="mb-4 font-display text-lg font-semibold text-foreground">
                                Ingredients for {servings} servings of {fetchedRecipe?.name}
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
                </div>
            </CardContent>
        </Card>
    );
};

export default IngredientCalculator;
