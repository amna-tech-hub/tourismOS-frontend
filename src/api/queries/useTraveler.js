import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { travelerApi } from "../endpoints/traveler.api";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { authApi } from "../endpoints/auth.api";

// ==========================================
// AUTH & PROFILE HOOKS
// ==========================================

export const useTravelerProfile = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.PROFILE,
    queryFn: () => authApi.getProfile,
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



// ==========================================
// TRAVEL JOURNAL HOOKS
// ==========================================

export const useMyJournals = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS,
    queryFn: () => travelerApi.getMyJournals(),
  });
};

export const useJournalDetail = (journalId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(journalId),
    queryFn: () => travelerApi.getJournalById(journalId),
    enabled: !!journalId,
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

export const useUpdateJournal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isPublic }) => travelerApi.updateJournal({ id, isPublic }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.TRAVELER.JOURNAL_DETAIL(variables.id),
      });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.TRAVELER.MY_JOURNALS });
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

//getAllTours

export const useAllTours = () => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.ALL_TOURS,
    queryFn: () => travelerApi.getAllTour(),
 
  });
};
console.log(useAllTours," all tours");

// ==========================================
// REVIEWS HOOKS
// ==========================================

export const useTourReviews = (tourId) => {
  return useQuery({
    queryKey: QUERY_KEYS.TRAVELER.TOUR_REVIEWS(tourId),
    queryFn: () => travelerApi.getTourReviews(tourId),
    enabled: !!tourId,
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