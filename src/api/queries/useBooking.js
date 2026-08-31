// hooks/useBooking.jsx
import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingApi } from '../endpoints/booking.api';
import { QUERY_KEYS } from '../../constants/queryKeys';

// ============================================================
// TRAVELER BOOKING HOOKS
// ============================================================

// 1. FETCH MY BOOKINGS
export const useMyBookings = (params = {}) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRAVELER.BOOKING.MY_BOOKINGS, params],
    queryFn: () => bookingApi.getMyBookings(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: false,
  });
};

// 2. FETCH BOOKING BY ID
export const useBookingDetails = (bookingId) => {
  return useQuery({
    queryKey: [...QUERY_KEYS.TRAVELER.BOOKING.DETAILS, bookingId],
    queryFn: () => bookingApi.getBookingById(bookingId),
    enabled: !!bookingId,
    staleTime: 1000 * 60 * 2,
  });
};

// 3. CREATE BOOKING MUTATION
export const useCreateBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookingApi.createBooking,
    onSuccess: (data) => {
      // Invalidate my bookings list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.TRAVELER.BOOKING.MY_BOOKINGS 
      });
      
      // Optionally prefetch the new booking details
      if (data?.data?.booking?._id) {
        queryClient.prefetchQuery({
          queryKey: [...QUERY_KEYS.TRAVELER.BOOKING.DETAILS, data.data.booking._id],
          queryFn: () => bookingApi.getBookingById(data.data.booking._id),
        });
      }
      
      // Invalidate company bookings if applicable
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.COMPANY.BOOKINGS 
      });
    },
    onError: (error) => {
      console.error('Create booking error:', error);
    },
  });
};

// 4. CANCEL BOOKING MUTATION
export const useCancelBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingId, reason }) => 
      bookingApi.cancelBooking(bookingId, reason),
    
    onSuccess: (data, variables) => {
      // Invalidate my bookings list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.TRAVELER.BOOKING.MY_BOOKINGS 
      });
      
      // Invalidate specific booking details
      if (variables?.bookingId) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.TRAVELER.BOOKING.DETAILS, variables.bookingId] 
        });
      }
      
      // Invalidate company bookings
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.COMPANY.BOOKINGS 
      });
    },
  });
};

// 5. CONFIRM BOOKING AFTER PAYMENT MUTATION
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (paymentId) => bookingApi.confirmBooking(paymentId),
    
    onSuccess: (data) => {
      // Find the booking ID from response and invalidate
      if (data?.data?._id) {
        queryClient.invalidateQueries({ 
          queryKey: [...QUERY_KEYS.TRAVELER.BOOKING.DETAILS, data.data._id] 
        });
      }
      
      // Invalidate my bookings list
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.TRAVELER.BOOKING.MY_BOOKINGS 
      });

      // Invalidate dashboard/company booking overview
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.SUPER_ADMIN.BOOKING_OVERVIEW 
      });
    },
  });
};

// ============================================================
// HELPER HOOKS & UTILITIES
// ============================================================

// 6. BOOKING STATS (Derived from data)
export const useBookingStats = (bookings) => {
  if (!bookings || bookings.length === 0) {
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      totalSpent: 0,
    };
  }

  return bookings.reduce(
    (acc, booking) => {
      acc.total += 1;
      
      const status = booking.status?.toLowerCase() || 'pending';
      if (status === 'pending') acc.pending += 1;
      else if (status === 'confirmed') acc.confirmed += 1;
      else if (status === 'cancelled') acc.cancelled += 1;
      else if (status === 'completed') acc.completed += 1;
      
      if (status === 'confirmed' || status === 'completed') {
        acc.totalSpent += booking.totalAmount || 0;
      }
      
      return acc;
    },
    {
      total: 0,
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
      totalSpent: 0,
    }
  );
};

// 7. BOOKING FILTER HOOK
export const useBookingFilter = () => {
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const updateFilter = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      status: '',
      startDate: '',
      endDate: '',
      search: '',
    });
  }, []);

  const applyFilters = useCallback(
    (bookings) => {
      if (!bookings || bookings.length === 0) return [];

      return bookings.filter((booking) => {
        if (filters.status && booking.status !== filters.status) {
          return false;
        }

        if (filters.search) {
          const searchTerm = filters.search.toLowerCase();
          const tourTitle = booking.tour?.title?.toLowerCase() || '';
          if (!tourTitle.includes(searchTerm)) {
            return false;
          }
        }

        if (filters.startDate) {
          const bookingDate = new Date(booking.travelDate);
          const startDate = new Date(filters.startDate);
          if (bookingDate < startDate) return false;
        }

        if (filters.endDate) {
          const bookingDate = new Date(booking.travelDate);
          const endDate = new Date(filters.endDate);
          if (bookingDate > endDate) return false;
        }

        return true;
      });
    },
    [filters]
  );

  return { filters, updateFilter, resetFilters, applyFilters };
};

// 8. UPCOMING BOOKINGS
export const useUpcomingBookings = (bookings, days = 7) => {
  if (!bookings || bookings.length === 0) return [];

  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + days);

  return bookings
    .filter((booking) => {
      const travelDate = new Date(booking.travelDate);
      return (
        travelDate >= now &&
        travelDate <= futureDate &&
        booking.status !== 'cancelled'
      );
    })
    .sort((a, b) => new Date(a.travelDate) - new Date(b.travelDate));
};

// 9. PAYMENT REDIRECTION UTILITY
export const redirectToPayment = (bookingResponse) => {
  try {
    if (bookingResponse?.data?.checkoutUrl) {
      window.location.href = bookingResponse.data.checkoutUrl;
      return { success: true, method: 'redirect' };
    }

    if (
      bookingResponse?.data?.provider === 'jazzcash' &&
      bookingResponse?.data?.action
    ) {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = bookingResponse.data.action;

      const formData = bookingResponse.data.formData || {};
      Object.keys(formData).forEach((key) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = formData[key];
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit();
      return { success: true, method: 'jazzcash' };
    }

    return {
      success: true,
      method: 'manual',
      bookingId: bookingResponse?.data?.booking?._id,
      paymentId: bookingResponse?.data?.paymentId,
    };
  } catch (error) {
    console.error('Payment redirection failed:', error);
    return { success: false, error: error.message };
  }
};

// 10. PAYMENT REDIRECTION HOOK
export const usePaymentRedirection = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleRedirect = useCallback(async (bookingResponse) => {
    setIsProcessing(true);
    setError(null);

    try {
      const result = redirectToPayment(bookingResponse);
      if (!result.success) {
        setError(result.error);
      }
      return result;
    } catch (err) {
      const errorMessage = err.message || 'Payment redirection failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsProcessing(false);
    }
  }, []);

  return {
    redirectToPayment: handleRedirect,
    isProcessing,
    error,
  };
};

// 11. BULK BOOKING OPERATIONS
export const useBulkUpdateBookingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ bookingIds, status }) =>
      bookingApi.bulkUpdateStatus({ bookingIds, status }),
    
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.TRAVELER.BOOKING.MY_BOOKINGS 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.COMPANY.BOOKINGS 
      });
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.SUPER_ADMIN.BOOKING_OVERVIEW 
      });
    },
  });
};

// 12. EXPORT ALL HOOKS
export default {
  useMyBookings,
  useBookingDetails,
  useCreateBooking,
  useCancelBooking,
  useConfirmBooking,
  useBookingStats,
  useBookingFilter,
  useUpcomingBookings,
  usePaymentRedirection,
  useBulkUpdateBookingStatus,
  redirectToPayment,
};