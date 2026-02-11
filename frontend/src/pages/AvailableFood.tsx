import { motion } from "framer-motion";
import { Heart, MapPin, Clock, Users, Phone, Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getAllSurplus } from "@/services/api";

interface FoodListing {
  _id: string;
  dishName: string;
  quantity: number;
  location: string;
  createdAt: string;
  expiresIn: number;
  expiresAt: string;
  estimatedPeople: number;
  provider: string;
  contact: string;
  notes?: string;
}

const AvailableFood = () => {
  const { toast } = useToast();

  // Fetch surplus food with auto-refresh every 30 seconds
  const { data: listings = [], isLoading, error } = useQuery<FoodListing[]>({
    queryKey: ['surplus'],
    queryFn: getAllSurplus,
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

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

  if (isLoading) {
    return (
      <div className="min-h-screen py-12 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading available food...</p>
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
              <p className="text-destructive font-semibold mb-2">Error loading food listings</p>
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
          className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary">
              <Heart className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold text-foreground">Available Food</h1>
          </div>
          <p className="text-muted-foreground">
            Browse surplus food available for pickup near you. Contact the provider to arrange collection.
          </p>
        </motion.div>

        <div className="mb-6 flex items-center gap-2">
          <Badge variant="outline" className="border-primary text-primary">
            {listings.length} listings available
          </Badge>
          <Badge variant="secondary">
            ~{listings.reduce((a, b) => a + b.estimatedPeople, 0)} people can be fed
          </Badge>
        </div>

        {listings.length === 0 ? (
          <Card className="shadow-soft">
            <CardContent className="pt-6 pb-6 text-center">
              <p className="text-muted-foreground">No surplus food available at the moment.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later or report surplus food to help others.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {listings.map((listing, i) => (
              <motion.div
                key={listing._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="shadow-soft transition-shadow hover:shadow-glow-primary">
                  <CardContent className="p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex-1 space-y-3">
                        <div>
                          <h3 className="font-display text-xl font-semibold text-foreground">
                            {listing.dishName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            by {listing.provider} · {getTimeAgo(listing.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4 text-primary" />
                            {listing.location}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-accent" />
                            Expires in {getExpiresIn(listing.expiresAt)}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                            {listing.quantity} kg
                          </span>
                          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            Feeds ~{listing.estimatedPeople} people
                          </span>
                        </div>
                      </div>
                      <Button
                        className="gradient-primary border-0 shadow-glow-primary"
                        onClick={() => handleContact(listing)}
                      >
                        <Phone className="mr-2 h-4 w-4" />
                        Contact
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableFood;
