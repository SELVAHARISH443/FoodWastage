import { useState } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Clock, Users, Check, User, Phone } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { createSurplus } from "@/services/api";

const ReportSurplus = () => {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    dishName: "",
    quantity: "",
    location: "",
    district: "",
    notes: "",
    expiresIn: "",
    provider: "",
    contact: "",
  });

  const districts = [
    "Ariyalur",
    "Chengalpattu",
    "Chennai",
    "Coimbatore",
    "Cuddalore",
    "Dharmapuri",
    "Dindigul",
    "Erode",
    "Kallakurichi",
    "Kancheepuram",
    "Kanyakumari",
    "Karur",
    "Krishnagiri",
    "Madurai",
    "Nagapattinam",
    "Namakkal",
    "Nilgiris",
    "Perambalur",
    "Pudukkottai",
    "Ramanathapuram",
    "Ranipet",
    "Salem",
    "Sivaganga",
    "Tenkasi",
    "Thanjavur",
    "Theni",
    "Thoothukudi",
    "Tiruchirappalli",
    "Tirunelveli",
    "Tirupathur",
    "Tiruppur",
    "Tiruvallur",
    "Tiruvannamalai",
    "Tiruvarur",
    "Vellore",
    "Viluppuram",
    "Virudhunagar"
  ];

  const estimatedPeople = form.quantity ? Math.floor(Number(form.quantity) / 0.4) : 0;

  const mutation = useMutation({
    mutationFn: createSurplus,
    onSuccess: () => {
      setSubmitted(true);
      toast({
        title: "Surplus reported!",
        description: `Your food report is now visible to nearby orphanages.`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dishName || !form.quantity || !form.location || !form.district || !form.provider || !form.contact) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    mutation.mutate(form);
  };

  if (submitted) {
    return (
      <div className="min-h-screen py-12">
        <div className="container max-w-lg">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center rounded-2xl border border-border bg-card p-12 text-center shadow-soft"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary">
              <Check className="h-8 w-8 text-primary-foreground" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              Thank You!
            </h2>
            <p className="mt-2 text-muted-foreground">
              Your surplus food report for <strong>{form.dishName}</strong> is now live.
              Nearby orphanages can see and collect it.
            </p>
            <p className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              Estimated to feed ~{estimatedPeople} people
            </p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setForm({ dishName: "", quantity: "", location: "", district: "", notes: "", expiresIn: "", provider: "", contact: "" });
              }}
              variant="outline"
              className="mt-6"
            >
              Report More Food
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-accent">
              <Package className="h-5 w-5 text-accent-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Report Surplus Food</h1>
          </div>
          <p className="text-muted-foreground">
            Have extra food? Report it here so nearby orphanages can collect it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="font-display">Food Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <Label>Dish Name *</Label>
                  <Input
                    placeholder="e.g. Vegetable Biryani"
                    value={form.dishName}
                    onChange={(e) => setForm({ ...form, dishName: e.target.value })}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Quantity (in kg) *</Label>
                    <Input
                      type="number"
                      min="0.1"
                      step="0.1"
                      placeholder="e.g. 5"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Available for (hours)</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="number"
                        min="1"
                        placeholder="e.g. 4"
                        value={form.expiresIn}
                        onChange={(e) => setForm({ ...form, expiresIn: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Pickup Location *</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Community Kitchen, MG Road"
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>District *</Label>
                    <Select value={form.district} onValueChange={(value) => setForm({ ...form, district: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select district" />
                      </SelectTrigger>
                      <SelectContent>
                        {districts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Provider Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        placeholder="e.g. Chef Ramesh"
                        value={form.provider}
                        onChange={(e) => setForm({ ...form, provider: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Contact Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={form.contact}
                        onChange={(e) => setForm({ ...form, contact: e.target.value })}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Additional Notes</Label>
                  <Textarea
                    placeholder="Any special instructions or dietary info..."
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                {estimatedPeople > 0 && (
                  <div className="flex items-center gap-3 rounded-lg border border-border bg-primary/5 p-4">
                    <Users className="h-5 w-5 text-primary" />
                    <p className="text-sm text-foreground">
                      <strong>{form.quantity} kg</strong> can feed approximately{" "}
                      <strong className="text-primary">~{estimatedPeople} people</strong>
                    </p>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full gradient-primary border-0 shadow-glow-primary">
                  Submit Report
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default ReportSurplus;
