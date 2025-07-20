import { create } from 'zustand';

type TripStatus = 'planned' | 'ongoing' | 'paused' | 'completed' | 'cancelled';

type ChatState = {
  chatHistory: string[];
  addChatResponse: (response: string) => void;
  clearChatHistory: () => void;
};

type MediaState = {
  uploadedImageUri: string | null;
  uploadedVideoUri: string | null;
  setUploadedImageUri: (uri: string | null) => void;
  setUploadedVideoUri: (uri: string | null) => void;
};


export type Trip = {
  id: string;
  title: string;
  duration: string;
  locations: Location[];
  routeCoords: RoutePoint[];
  trackingEnabled: boolean;
  status: TripStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  updatedAt?: string;
  notes?: string;
  isFavorite?: boolean;
  emergencyAlerts: string;
};

type TripState = {
  trips: Trip[];
  addTrip: (trip: Trip) => void;
  updateTrip: (id: string, updates: Partial<Trip>) => void;
  deleteTrip: (id: string) => void;
};

type GlobalState = {
  theme: 'light' | 'dark';
  language: 'en' | 'ur';
  isLoading: boolean;
  loggedIn: boolean;
  email: string;
  password: string;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setLoggedin: (loggedIn: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLanguage: (lang: 'en' | 'ur') => void;
  setLoading: (loading: boolean) => void;
};

type Location = {
  latitude: number;
  longitude: number;
  label: string;
};


type RoutePoint = {
  latitude: number;
  longitude: number;
};

type MapState = {
  locations: {
    route: RoutePoint[];
  };
  routeGeoJSON: GeoJSON.FeatureCollection | null;
  addRoutePoint: (point: RoutePoint) => void;
  clearRoute: () => void;
  setRouteGeoJSON: (geojson: GeoJSON.FeatureCollection) => void;
  clearRouteGeoJSON: () => void;
  selectedDestinations: Location[];
  addDestination: (loc: Location) => void;
  clearDestinations: () => void;
  tripTitle: string;
  tripDuration: string;
  setTripTitle: (title: string) => void;
  setTripDuration: (duration: string) => void;
};

type StoreState = GlobalState & MapState & TripState & ChatState & MediaState;


export const useGlobalStore = create<StoreState>((set) => ({
  
  theme: 'light',
  language: 'en',
  isLoading: true,
  loggedIn: false,
  email: "safar@gmail.com",
  password: "safar123",
  setEmail: (email) => set({ email }),
  setPassword: (password) => set({ password }),
  setLoggedin: (loggedIn) => set({ loggedIn }),
  setTheme: (theme) => set({ theme }),
  setLanguage: (language) => set({ language }),
  setLoading: (isLoading) => set({ isLoading }),

  
  locations: {
    route: [],
  },
  routeGeoJSON: null,
  addRoutePoint: (point) =>
    set((state) => ({
      locations: {
        ...state.locations,
        route: [...state.locations.route, point],
      },
    })),
  clearRoute: () =>
    set((state) => ({
      locations: {
        ...state.locations,
        route: [],
      },
    })),
  setRouteGeoJSON: (geojson) => set({ routeGeoJSON: geojson }),
  clearRouteGeoJSON: () => set({ routeGeoJSON: null }),
  selectedDestinations: [],
  addDestination: (loc) =>
    set((state) => ({
      selectedDestinations: [...state.selectedDestinations, loc],
    })),
  clearDestinations: () => set({ selectedDestinations: [] }),
  tripTitle: '',
  tripDuration: '',
  setTripTitle: (title) => set({ tripTitle: title }),
  setTripDuration: (duration) => set({ tripDuration: duration }),
  trips: [],
  addTrip: (trip) =>
    set((state) => ({
      trips: [...state.trips, trip],
    })),
  updateTrip: (id, updates) =>
    set((state) => ({
      trips: state.trips.map((trip) =>
        trip.id === id ? { ...trip, ...updates, updatedAt: new Date().toISOString() } : trip
      ),
    })),
  deleteTrip: (id) =>
    set((state) => ({
      trips: state.trips.filter((trip) => trip.id !== id),
    })),
  chatHistory: [],
  addChatResponse: (response) =>
    set((state) => ({ chatHistory: [...state.chatHistory, response] })),
  clearChatHistory: () => set({ chatHistory: [] }),
  uploadedImageUri: null,
  uploadedVideoUri: null,
  setUploadedImageUri: (uri) => set({ uploadedImageUri: uri }),
  setUploadedVideoUri: (uri) => set({ uploadedVideoUri: uri }),

}));
