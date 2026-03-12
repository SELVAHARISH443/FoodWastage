import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
    ChefHat,
    Package,
    Heart,
    Calculator,
    Loader2,
    Users,
    Clock,
    MapPin,
    User,
    Phone,
    Check,
    Filter
} from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { createSurplus, getAllSurplus } from "@/services/api";
import IngredientCalculator from "@/components/IngredientCalculator";

interface FoodListing {
    _id: string;
    dishName: string;
    quantity: number;
    location: string;
    district: string;
    createdAt: string;
    expiresIn: number;
    expiresAt: string;
    estimatedPeople: number;
    provider: string;
    contact: string;
    notes?: string;
}

const Dashboard = () => {
    const { toast } = useToast();


    // Fetch all recipes just once on mount for autocomplete

    // --- Available Food Logic ---
    const [selectedDistrict, setSelectedDistrict] = useState<string>("all");

    const availableDistricts = [
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



    // --- Report Surplus Logic ---
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
            // Refetch surplus listings after reporting
            refetchSurplus();
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

        // Validate contact number (exactly 10 digits, only digits)
        const contactRegex = /^\d{10}$/;
        if (!contactRegex.test(form.contact)) {
            toast({
                title: "Invalid contact number",
                description: "Please enter a valid 10-digit contact number (digits only).",
                variant: "destructive",
            });
            return;
        }

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

    // --- Available Food Logic ---
    const { data: listings = [], isLoading: isLoadingSurplus, error: surplusError, refetch: refetchSurplus } = useQuery<FoodListing[]>({
        queryKey: ['surplus'],
        queryFn: getAllSurplus,
        refetchInterval: 30000,
    });

    // Filter listings based on selected district
    const filteredListings = selectedDistrict === "all"
        ? listings
        : listings.filter(listing => listing.district === selectedDistrict);

    const handleContact = (listing: FoodListing) => {
        toast({
            title: `Contact ${listing.provider}`,
            description: `Phone: ${listing.contact}`,
        });
    };

    const getTimeAgo = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins} min ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    };

    const getExpiresIn = (expiresAtString: string) => {
        const expiresAt = new Date(expiresAtString);
        const now = new Date();
        const diffMs = expiresAt.getTime() - now.getTime();
        const diffHours = Math.floor(diffMs / 3600000);
        if (diffHours < 1) {
            const diffMins = Math.floor(diffMs / 60000);
            return `${diffMins} minutes`;
        }
        return `${diffHours} hour${diffHours > 1 ? 's' : ''}`;
    };

    return (
        <div className="min-h-screen py-12">
            <div className="container max-w-6xl">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 text-center"
                >
                    <h1 className="font-display text-4xl font-bold text-foreground">Admin Dashboard</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage recipes, report surplus food, and view available listings all in one place.
                    </p>
                </motion.div>

                <Tabs defaultValue="calculator" className="space-y-8">
                    <div className="flex justify-center">
                        <TabsList className="grid w-full max-w-md grid-cols-3">
                            <TabsTrigger value="calculator" className="flex items-center gap-2">
                                <ChefHat className="h-4 w-4" />
                                <span className="hidden sm:inline">Calculator</span>
                            </TabsTrigger>
                            <TabsTrigger value="report" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                <span className="hidden sm:inline">Report</span>
                            </TabsTrigger>
                            <TabsTrigger value="available" className="flex items-center gap-2">
                                <Heart className="h-4 w-4" />
                                <span className="hidden sm:inline">Available</span>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* Calculator Tab */}
                    <TabsContent value="calculator">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <IngredientCalculator />
                        </motion.div>
                    </TabsContent>

                    {/* Report Tab */}
                    <TabsContent value="report">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            {submitted ? (
                                <Card className="shadow-soft text-center p-12">
                                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full gradient-primary mx-auto">
                                        <Check className="h-8 w-8 text-primary-foreground" />
                                    </div>
                                    <h2 className="font-display text-2xl font-bold">Thank You!</h2>
                                    <p className="mt-2 text-muted-foreground">Your surplus food report is live.</p>
                                    <p className="mt-4 rounded-lg bg-primary/10 px-4 py-2 text-sm font-semibold text-primary inline-block">
                                        Estimated to feed ~{Math.floor(Number(form.quantity) / 0.4)} people
                                    </p>
                                    <div className="mt-6">
                                        <Button onClick={() => {
                                            setSubmitted(false);
                                            setForm({ dishName: "", quantity: "", location: "", district: "", notes: "", expiresIn: "", provider: "", contact: "" });
                                        }} variant="outline">
                                            Report More Food
                                        </Button>
                                    </div>
                                </Card>
                            ) : (
                                <Card className="shadow-soft">
                                    <CardHeader>
                                        <CardTitle className="font-display flex items-center gap-2">
                                            <Package className="h-5 w-5 text-accent" />
                                            Report Surplus Food
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleSubmit} className="space-y-5">
                                            <div className="space-y-2">
                                                <Label>Dish Name *</Label>
                                                <Input placeholder="e.g. Vegetable Biryani" value={form.dishName} onChange={(e) => setForm({ ...form, dishName: e.target.value })} />
                                            </div>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Quantity (in kg) *</Label>
                                                    <Input type="number" min="0.1" step="0.1" placeholder="e.g. 5" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Available for (hours)</Label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input type="number" min="1" placeholder="e.g. 4" value={form.expiresIn} onChange={(e) => setForm({ ...form, expiresIn: e.target.value })} className="pl-9" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Pickup Location *</Label>
                                                <div className="relative">
                                                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                                    <Input placeholder="e.g. Community Kitchen, MG Road" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="pl-9" />
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
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Provider Name *</Label>
                                                    <div className="relative">
                                                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input placeholder="e.g. Chef Ramesh" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} className="pl-9" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Contact Number *</Label>
                                                    <div className="relative">
                                                        <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                                        <Input type="tel" placeholder="e.g. 9876543210 (10 digits only)" value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} className="pl-9" />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Additional Notes</Label>
                                                <Textarea placeholder="Any special instructions or dietary info..." value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
                                            </div>
                                            <Button type="submit" size="lg" className="w-full gradient-primary border-0 shadow-glow-primary">Submit Report</Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.div>
                    </TabsContent>

                    {/* Available Tab */}
                    <TabsContent value="available">
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                            <div className="mb-6 flex items-center justify-between">
                                <div className="flex gap-2">
                                    <Badge variant="outline" className="border-primary text-primary">
                                        {filteredListings.length} listings available
                                    </Badge>
                                    <Badge variant="secondary">
                                        ~{filteredListings.reduce((a, b) => a + b.estimatedPeople, 0)} people can be fed
                                    </Badge>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => refetchSurplus()} className="text-muted-foreground">
                                    Refresh List
                                </Button>
                            </div>

                            <div className="mb-6 flex items-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm font-medium">Filter by District:</span>
                                </div>
                                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Districts</SelectItem>
                                        {availableDistricts.map((district) => (
                                            <SelectItem key={district} value={district}>
                                                {district}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {selectedDistrict !== "all" && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedDistrict("all")}
                                    >
                                        Clear Filter
                                    </Button>
                                )}
                            </div>

                            {isLoadingSurplus ? (
                                <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                            ) : filteredListings.length === 0 ? (
                                <Card className="shadow-soft p-12 text-center">
                                    <p className="text-muted-foreground">
                                        {selectedDistrict === "all"
                                            ? "No surplus food available at the moment."
                                            : `No surplus food available in ${selectedDistrict}.`}
                                    </p>
                                </Card>
                            ) : (
                                <div className="grid gap-4">
                                    {filteredListings.map((listing, i) => (
                                        <motion.div key={listing._id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                            <Card className="shadow-soft hover:shadow-glow-primary transition-shadow">
                                                <CardContent className="p-6">
                                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                                        <div className="flex-1 space-y-3">
                                                            <div>
                                                                <h3 className="font-display text-xl font-semibold">{listing.dishName}</h3>
                                                                <p className="text-sm text-muted-foreground">by {listing.provider} · {getTimeAgo(listing.createdAt)}</p>
                                                            </div>
                                                            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{listing.location}, {listing.district}</span>
                                                                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-accent" />Expires in {getExpiresIn(listing.expiresAt)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{listing.quantity} kg</span>
                                                                <span className="flex items-center gap-1.5 text-sm text-muted-foreground"><Users className="h-4 w-4" />Feeds ~{listing.estimatedPeople} people</span>
                                                            </div>
                                                        </div>
                                                        <Button className="gradient-primary border-0 shadow-glow-primary" onClick={() => handleContact(listing)}>
                                                            <Phone className="mr-2 h-4 w-4" /> Contact
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Dashboard;
