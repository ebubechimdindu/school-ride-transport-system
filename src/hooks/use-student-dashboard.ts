
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAppSelector } from '@/hooks/redux';

interface StudentStats {
  total_rides: number;
  today_rides: number;
  monthly_rides: number;
  avg_wait_minutes: number;
  completed_rides: number;
  cancelled_rides: number;
}

interface RecentActivity {
  id: number;
  status: string;
  pickup_address: string;
  dropoff_address: string;
  created_at: string;
  driver_name: string | null;
  rating: number;
  cancelled_at: string | null;
  completed_at: string | null;
}

interface NearbyDriver {
  id: string;
  full_name: string;
  average_rating: number;
  distance_meters: number;
  last_location_update: string;
  last_known_location: { lat: number; lng: number } | null;
}

export const useStudentDashboard = () => {
  const { toast } = useToast();
  const user = useAppSelector((state) => state.auth.user);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['studentStats', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_dashboard_stats')
        .select('*')
        .eq('student_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching student stats:', error);
        throw error;
      }

      if (!data) {
        return {
          total_rides: 0,
          today_rides: 0,
          monthly_rides: 0,
          avg_wait_minutes: 0,
          completed_rides: 0,
          cancelled_rides: 0
        };
      }

      return data as StudentStats;
    },
    enabled: !!user?.id,
    retry: false,
  });

  const { data: recentActivity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ['studentRecentActivity', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('student_recent_activity')
        .select('*')
        .eq('student_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) {
        console.error('Error fetching recent activity:', error);
        throw error;
      }

      return (data || []) as RecentActivity[];
    },
    enabled: !!user?.id,
    retry: false,
  });

  const { data: nearbyDrivers, isLoading: isLoadingDrivers } = useQuery<NearbyDriver[]>({
    queryKey: ['nearbyDrivers', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('driver_stats_detailed')
        .select(`
          driver_id as id,
          full_name,
          average_rating,
          last_known_location,
          phone_number
        `)
        .eq('status', 'verified')
        .not('last_known_location', 'is', null)
        .limit(5);

      if (error) {
        console.error('Error fetching nearby drivers:', error);
        throw error;
      }

      return (data || []).map(driver => ({
        id: driver.id,
        full_name: driver.full_name || 'Unknown Driver',
        average_rating: driver.average_rating || 0,
        distance_meters: 0,
        last_location_update: new Date().toISOString(),
        last_known_location: driver.last_known_location
      }));
    },
    enabled: !!user?.id,
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: false,
  });

  return {
    stats,
    recentActivity,
    nearbyDrivers,
    isLoading: isLoadingStats || isLoadingActivity || isLoadingDrivers,
  };
};
