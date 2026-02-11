import { motion } from "framer-motion";
import { ArrowRight, ChefHat, Heart, Leaf } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-food.jpg";

const features = [
  {
    icon: ChefHat,
    title: "Smart Cooking",
    description:
      "Enter dish & servings to get precise ingredient quantities. Cook exactly what's needed.",
  },
  {
    icon: Leaf,
    title: "Report Surplus",
    description:
      "Excess food? Report it instantly. We calculate how many people it can feed.",
  },
  {
    icon: Heart,
    title: "Feed the Needy",
    description:
      "Nearby orphanages see available food in real-time and collect before it's wasted.",
  },
];

const stats = [
  { value: "1.3B", label: "Tons of food wasted yearly" },
  { value: "828M", label: "People go hungry daily" },
  { value: "40%", label: "Of food produced is wasted" },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="container py-20 md:py-32">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="mb-4 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                Reduce Food Waste Together
              </span>
              <h1 className="mb-6 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Every Meal Matters,{" "}
                <span className="text-primary">Zero Waste</span>
              </h1>
              <p className="mb-8 max-w-lg text-lg text-muted-foreground">
                Connect chefs, food providers, and orphanages on one platform.
                Plan smarter, cook better, and ensure surplus food reaches those
                who need it most.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="gradient-primary border-0 shadow-glow-primary">
                  <Link to="/chef">
                    <ChefHat className="mr-2 h-5 w-5" />
                    Chef Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/available">
                    Find Food
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="overflow-hidden rounded-2xl shadow-soft">
                <img
                  src={heroImage}
                  alt="Fresh ingredients on a wooden table"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 animate-float rounded-xl bg-card p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-accent">
                    <Heart className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">2,400+</p>
                    <p className="text-xs text-muted-foreground">Meals saved</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-card/50 py-12">
        <div className="container">
          <div className="grid grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <p className="font-display text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="mt-3 text-muted-foreground">
              Three simple steps to reduce food waste
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="rounded-2xl border border-border bg-card p-8 shadow-soft transition-shadow hover:shadow-glow-primary"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="mb-2 font-display text-xl font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container">
          <div className="rounded-2xl gradient-primary p-12 text-center shadow-glow-primary">
            <h2 className="font-display text-3xl font-bold text-primary-foreground">
              Join the Movement
            </h2>
            <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
              Start planning smarter meals today and help ensure no food goes to waste.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="mt-8"
            >
              <Link to="/chef">Get Started Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
