
export type LocationCategory = 'academic' | 'residence' | 'common_area' | 'administrative' | 'pickup_point';

export interface CampusLocation {
  id: string;
  name: string;
  description?: string;
  locationType: LocationCategory;  // Changed from 'category' to 'locationType'
  coordinates: {
    lat: number;
    lng: number;
  };
  isActive: boolean;
  isVerified: boolean;
  buildingCode?: string;
  commonNames?: string[];
  entrancePoints?: Array<{
    lat: number;
    lng: number;
    description?: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface LocationFeedback {
  id: string;
  locationId: string;
  feedbackType: string;
  description?: string;
  suggestedCoordinates?: {
    lat: number;
    lng: number;
  };
  submittedBy: string;
  status: 'pending' | 'reviewed' | 'implemented' | 'rejected';
  createdAt: string;
}
