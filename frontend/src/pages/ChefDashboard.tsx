import { motion } from "framer-motion";
import { ChefHat } from "lucide-react";
import IngredientCalculator from "@/components/IngredientCalculator";

const ChefDashboard = () => {
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
            Enter a dish name to get its ingredients, then specify servings to calculate quantities.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <IngredientCalculator />
        </motion.div>
      </div>
    </div>
  );
};

export default ChefDashboard;
