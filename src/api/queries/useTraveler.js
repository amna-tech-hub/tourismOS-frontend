import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from "@tanstack/react-query";
import { travelerApi } from "../endpoints/traveler.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { authApi } from "../endpoints/auth.api";

// ==========================================
// AUTH & PROFILE HOOKS
// ==========================================


export const useTravelerProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.PROFILE,
    queryFn: () => authApi.getProfile(),
 
  });
};

export const useUpdateTravelerProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => authApi.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRAVELER.PROFILE });
    },
  });
};

// // ADD THESE NEW HOOKS FOR PROFILE MANAGEMENT
// export const useUploadProfilePicture = () => {
//   return useMutation({
//     mutationFn: async (file) => {
//       const formData = new FormData();
//       formData.append('profilePicture', file);
      
//       const response = await authApi.uploadProfilePicture(formData);
//       return response;
//     },
//   });
// };

// export const useDeleteProfilePicture = () => {
//   return useMutation({
//     mutationFn: async () => {
//       const response = await authApi.deleteProfilePicture();
//       return response;
//     },
//   });
// };
// ==========================================
// TRAVEL JOURNAL HOOKS
// ==========================================

export const useMyJournals = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS,
    queryFn: () => travelerApi.getMyJournals(),
       staleTime: 1000 * 60 * 5,
  });
};

export const useJournalDetail = (journalId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(journalId),
    queryFn: () => travelerApi.getJournalById(journalId),
    enabled: !!journalId,
     staleTime: 1000 * 60 * 5,
  });
};

export const useCreateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => travelerApi.createJournal(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS });
    },
  });
};

export const useAddJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, day, title, memory, photos, expenses }) =>
      travelerApi.addJournalEntry({ id, day, title, memory, photos, expenses }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS });
    },
  });
};

export const useUpdateJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      entryId,
      day,
      title,
      memory,
      photos,
      expenses,
    }) =>
      travelerApi.updateJournalEntry({
        id,
        entryId,
        day,
        title,
        memory,
        photos,
        expenses,
      }),

    onSuccess: (_, variables) => {
      // Refresh journal detail
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(
          variables.id
        ),
      });

      // Refresh journal list
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS,
      });
    },
  });
};
export const useDeleteJournalEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, entryId }) => travelerApi.deleteJournalEntry({ id, entryId }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(variables.id),
      });
    },
  });
};

export const useDeleteJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (journalId) => travelerApi.deleteJournal(journalId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS });
    },
  });
};

// ==========================================
// TOUR & AI HOOKS
// ==========================================

// Step 1: Generate AI Tour Preview
export const useGenerateTourPreview = () => {
  return useMutation({
    mutationFn: (payload) => travelerApi.generateTourPreview(payload),
  });
};

// Step 2: Final Submit (Create Tour)
export const useCreateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => travelerApi.createTour(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tours'] });
    },
  });
};


export const usePublicTours = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.PUBLIC_TOURS(params),
    queryFn: () => travelerApi.getPublicTours(params),
  });
};


/* =========================================================
   INFINITE PUBLIC TOURS
========================================================= */

export const useInfinitePublicTours = (params = {}) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.TRAVELER.PUBLIC_TOURS_INFINITE(params),

    queryFn: ({ pageParam = 1 }) =>
      travelerApi.getPublicTours({
        ...params,
        page: pageParam,
        limit: 8,
      }),

    initialPageParam: 1,

    getNextPageParam: (lastPage, allPages) => {
      const totalDocuments =
        Number(lastPage?.meta?.totalDocuments || 0);

      const loadedDocuments = allPages.reduce(
        (total, page) =>
          total +
          (Array.isArray(page?.data)
            ? page.data.length
            : 0),
        0
      );

      if (loadedDocuments >= totalDocuments) {
        return undefined;
      }

      return allPages.length + 1;
    },

    staleTime: 1000 * 60 * 5,
  });
};

// Fetch Company Tours (for company management portal)
// src/api/queries/useTraveler.js
export const useCompanyTours = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.COMPANY_TOURS(params),
    queryFn: () => travelerApi.getCompanyTours(params),
    staleTime: 1000 * 60 * 5,
  });
};
// Fetch Single Tour by ID
export const useTourById = (tourId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.TOUR_BY_ID(tourId),
    queryFn: () => travelerApi.getTourById(tourId),
    enabled: !!tourId,
  
  });
};

// Fetch Tour Details with Weather & Safety
export const useTourDetails = (tourId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.TOUR_DETAILS(tourId),
    queryFn: () => travelerApi.getTourDetails(tourId),
    enabled: !!tourId,
   
  });
};

// Update existing tour
export const useUpdateTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      travelerApi.updateTour({ id, ...payload }),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.TOUR_BY_ID(
          variables.id
        ),
      });

      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.TOUR_DETAILS(
          variables.id
        ),
      });

      queryClient.invalidateQueries({
        queryKey: ["tours", "company"],
      });
    },
  });
};
 

// Soft delete tour
export const useDeleteTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId) =>
      travelerApi.deleteTour(tourId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tours", "company"],
      });
    },
  });
};

// Publish draft tour
export const usePublishTour = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tourId) =>
      travelerApi.publishTour(tourId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["tours", "company"],
      });
    },
  });
};
// Check tour safety
export const useCheckTourSafety = () => {
  return useMutation({
    mutationFn: (payload) => travelerApi.checkTourSafety(payload),
  });
};

// ==========================================
// REVIEWS HOOKS
// ==========================================

export const useTourReviews = (tourId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.TOUR_REVIEWS(tourId),
    queryFn: () => travelerApi.getTourReviews(tourId),
    enabled: !!tourId,
    refetchInterval: 5000,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => travelerApi.createReview(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.TOUR_REVIEWS(variables.tourId),
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reviewId, tourId }) => travelerApi.deleteReview(reviewId),
    onSuccess: (_, variables) => {
      if (variables.tourId) {
        queryClient.invalidateQueries({
          queryKey: QUERY_KEYS.TRAVELER.TOUR_REVIEWS(variables.tourId),
        });
      }
    },
  });
};