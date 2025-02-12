
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import DriverSidebar from "@/components/driver/DriverSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Car, DollarSign, Star, Users } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { setError, updateDriverStatus } from "@/features/rides/ridesSlice";
import { Skeleton } from "@/components/ui/skeleton";

const DriverDashboard = () => {
  const { toast } = useToast();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const { error, driverStatus } = useAppSelector((state) => state.rides);

  useEffect(() => {
    // Simulate initial data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const toggleAvailability = () => {
    const newStatus = driverStatus === 'available' ? 'offline' : 'available';
    dispatch(updateDriverStatus(newStatus));
    toast({
      title: "Status Updated",
      description: `You are now ${newStatus}`,
    });
  };

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <DriverSidebar />
        <main className="flex-1 p-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-600">Error Loading Dashboard</h2>
            <p className="text-gray-600">{error}</p>
            <Button 
              onClick={() => dispatch(setError(null))}
              variant="outline"
              className="hover:bg-red-50"
            >
              Try Again
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <DriverSidebar />
      
      <main className="flex-1 overflow-y-auto p-8">
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Driver Dashboard</h1>
            <p className="text-gray-600">Welcome back, John</p>
          </div>

          {/* Status Toggle */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Status</p>
                  {isLoading ? (
                    <Skeleton className="h-6 w-24" />
                  ) : (
                    <p className={`text-lg font-semibold ${
                      driverStatus === 'available' ? 'text-green-600' : 'text-gray-600'
                    }`}>
                      {driverStatus === 'available' ? 'Available' : 'Offline'}
                    </p>
                  )}
                </div>
                <Button 
                  onClick={toggleAvailability}
                  disabled={isLoading}
                  className="hover:scale-105 transition-transform duration-200"
                >
                  {driverStatus === 'available' ? 'Go Offline' : 'Go Online'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Stats Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {['Total Rides', "Today's Earnings", 'Rating', 'Active Hours'].map((stat, index) => (
              <Card key={stat} className="animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">{stat}</CardTitle>
                  {[<Users />, <DollarSign />, <Star />, <Car />][index]}
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <>
                      <Skeleton className="h-8 w-24 mb-2" />
                      <Skeleton className="h-4 w-32" />
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-bold">
                        {[
                          "128",
                          "₦5,240",
                          "4.8",
                          "6.5"
                        ][index]}
                      </div>
                      <p className="text-xs text-gray-500">
                        {[
                          "+5 from last week",
                          "+12% from yesterday",
                          "From 96 ratings",
                          "Hours today"
                        ][index]}
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">No recent activity</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default DriverDashboard;

