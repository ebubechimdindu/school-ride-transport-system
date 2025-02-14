import { useState } from "react";
import { navigationMenuTriggerStyle } from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SidebarProvider } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import { MapPin, Calendar, Clock, Activity, Car, X, Star, MessageCircle, Bell } from "lucide-react";
import RideMap from "@/components/map/RideMap";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const StudentDashboard = () => {
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState<{
    status: string;
    estimatedWait: string;
    nearbyDrivers: number;
  } | null>(null);
  const { toast } = useToast();
  const [rideRequest, setRideRequest] = useState({
    pickup: "",
    dropoff: "",
    notes: "",
    specialRequirements: "",
  });
  const [selectedLocations, setSelectedLocations] = useState<{
    pickup?: { address: string; lat: number; lng: number };
    dropoff?: { address: string; lat: number; lng: number };
  }>({});

  const handleRideRequest = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveRequest({
      status: "Searching for driver",
      estimatedWait: "5-10 minutes",
      nearbyDrivers: 3,
    });
    toast({
      title: "Ride Requested",
      description: "Looking for available drivers...",
    });
    setIsRequestOpen(false);
  };

  const handleCancelRequest = () => {
    setActiveRequest(null);
    toast({
      title: "Ride Cancelled",
      description: "Your ride request has been cancelled.",
    });
  };

  const handleDriverRequest = (driverName: string) => {
    setActiveRequest({
      status: `Requesting ${driverName}`,
      estimatedWait: "2-5 minutes",
      nearbyDrivers: 1,
    });
    toast({
      title: "Driver Requested",
      description: `Sending request to ${driverName}...`,
    });
  };

  const handleLocationSelect = (
    type: 'pickup' | 'dropoff',
    location: { address: string; lat: number; lng: number }
  ) => {
    setSelectedLocations(prev => ({
      ...prev,
      [type]: location
    }));
    setRideRequest(prev => ({
      ...prev,
      [type]: location.address
    }));
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-[#F1F0FB] to-white dark:from-gray-900 dark:to-gray-800 transition-colors duration-500">
        <StudentSidebar />
        <main className="flex-1 p-6 animate-fade-in">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">Dashboard</h1>
              <Dialog open={isRequestOpen} onOpenChange={setIsRequestOpen}>
                <DialogTrigger asChild>
                  <Button className={`${navigationMenuTriggerStyle()} hover:scale-105 transition-transform duration-200`}>
                    Book a Ride
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[625px] animate-scale-in">
                  <DialogHeader>
                    <DialogTitle>Request a Ride</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleRideRequest} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="pickup">Pickup Location</Label>
                          <Input
                            id="pickup"
                            placeholder="Enter pickup location"
                            value={rideRequest.pickup}
                            onChange={(e) =>
                              setRideRequest({
                                ...rideRequest,
                                pickup: e.target.value,
                              })
                            }
                            className="transition-all duration-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dropoff">Dropoff Location</Label>
                          <Input
                            id="dropoff"
                            placeholder="Enter dropoff location"
                            value={rideRequest.dropoff}
                            onChange={(e) =>
                              setRideRequest({
                                ...rideRequest,
                                dropoff: e.target.value,
                              })
                            }
                            className="transition-all duration-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-4">
                        <Label>Location Preview</Label>
                        <RideMap
                          pickup={selectedLocations.pickup?.address || ''}
                          dropoff={selectedLocations.dropoff?.address || ''}
                          className="aspect-square rounded-lg overflow-hidden"
                          showRoutePath={true}
                          onRouteCalculated={(distance, duration) => {
                            console.log(`Distance: ${distance}km, Duration: ${duration}min`);
                          }}
                          onLocationSelect={handleLocationSelect}
                          mode="student"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="specialRequirements">
                        Special Requirements
                      </Label>
                      <Select
                        onValueChange={(value) =>
                          setRideRequest({
                            ...rideRequest,
                            specialRequirements: value,
                          })
                        }
                      >
                        <SelectTrigger className="transition-all duration-200 hover:border-primary focus:ring-2 focus:ring-primary/20">
                          <SelectValue placeholder="Select any special requirements" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="wheelchair">
                            Wheelchair Accessible
                          </SelectItem>
                          <SelectItem value="assistant">Need Assistant</SelectItem>
                          <SelectItem value="luggage">
                            Extra Luggage Space
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any special instructions?"
                        value={rideRequest.notes}
                        onChange={(e) =>
                          setRideRequest({
                            ...rideRequest,
                            notes: e.target.value,
                          })
                        }
                        className="transition-all duration-200 hover:border-primary focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsRequestOpen(false)}
                        className="hover:bg-secondary transition-colors duration-200"
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="hover:scale-105 transition-transform duration-200"
                      >
                        Request Ride
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <QuickStat
                title="Active Rides"
                value={activeRequest ? "1" : "0"}
                icon={<Activity className="h-6 w-6 text-purple-500" />}
                trend="+5% from last week"
              />
              <QuickStat
                title="Total Rides"
                value="24"
                icon={<MapPin className="h-6 w-6 text-blue-500" />}
                trend="+12% from last month"
              />
              <QuickStat
                title="This Month"
                value="8"
                icon={<Calendar className="h-6 w-6 text-green-500" />}
                trend="-2% from last month"
              />
              <QuickStat
                title="Avg. Wait Time"
                value="5min"
                icon={<Clock className="h-6 w-6 text-orange-500" />}
                trend="Same as last week"
              />
            </div>

            {activeRequest && (
              <Card className="mb-8 border-l-4 border-l-blue-500 animate-fade-in hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 animate-pulse text-blue-500" />
                      Active Request
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="hover:bg-red-50 hover:text-red-500 transition-colors duration-200">
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="animate-scale-in">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Cancel Ride Request?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to cancel your current ride
                            request? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="hover:bg-secondary transition-colors duration-200">Keep Request</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleCancelRequest}
                            className="hover:bg-red-600 transition-colors duration-200"
                          >
                            Cancel Ride
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Status:</span>
                        <span className="font-medium">{activeRequest.status}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Estimated Wait:
                        </span>
                        <span className="font-medium">
                          {activeRequest.estimatedWait}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Nearby Drivers:
                        </span>
                        <span className="font-medium">
                          {activeRequest.nearbyDrivers}
                        </span>
                      </div>
                    </div>
                    <RideMap 
                      pickup={selectedLocations.pickup?.address || ''}
                      dropoff={selectedLocations.dropoff?.address || ''}
                      className="aspect-video md:aspect-square rounded-lg overflow-hidden"
                      showRoutePath={true}
                      showNearbyRequests={true}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Recent Rides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        route: "Campus Library → Dorm B",
                        time: "Today, 2:30 PM",
                        status: "Completed",
                      },
                      {
                        id: 2,
                        route: "Student Center → Main Gate",
                        time: "Yesterday, 4:15 PM",
                        status: "Cancelled",
                      },
                      {
                        id: 3,
                        route: "Sports Complex → Cafeteria",
                        time: "2 days ago, 1:00 PM",
                        status: "Completed",
                      },
                    ].map((ride, index) => (
                      <div
                        key={ride.id}
                        className={`flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div>
                          <p className="font-medium">{ride.route}</p>
                          <p className="text-sm text-gray-500">{ride.time}</p>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>Available Drivers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { id: 1, name: "John D.", rating: 4.8, distance: 3 },
                      { id: 2, name: "Sarah M.", rating: 4.9, distance: 5 },
                      { id: 3, name: "Mike R.", rating: 4.7, distance: 7 },
                    ].map((driver, index) => (
                      <div
                        key={driver.id}
                        className={`flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-in`}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                          {driver.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{driver.name}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Star className="h-4 w-4 text-yellow-400 mr-1" />
                            <span>{driver.rating}</span>
                            <span className="mx-2">•</span>
                            <span>{driver.distance} min away</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleDriverRequest(driver.name)}
                          disabled={activeRequest !== null}
                          className="hover:scale-105 transition-transform duration-200"
                        >
                          Request
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

const QuickStat = ({
  title,
  value,
  icon,
  trend,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
}) => (
  <Card className="animate-fade-in hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
    <CardContent className="pt-6">
      <div className="flex items-center justify-between mb-4">
        <span className="text-muted-foreground">{title}</span>
        <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 transition-colors">
          {icon}
        </div>
      </div>
      <div className="text-2xl font-bold mb-2">{value}</div>
      <div className="text-sm text-muted-foreground">{trend}</div>
    </CardContent>
  </Card>
);

export default StudentDashboard;
