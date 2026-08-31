import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import { companyEmployeeApi } from "../endpoints/companyEmployee.api";
import { QUERY_KEYS } from "../../constants/queryKeys";

// ==========================================
// GET ALL COMPANY EMPLOYEES
// ==========================================

export const useCompanyEmployees = (params = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.COMPANY.EMPLOYEES_LIST(params),

    queryFn: () =>
      companyEmployeeApi.getEmployees(params),

    staleTime: 1000 * 60 * 5,

    // Keep the current employees visible while
    // search / filter / pagination is fetching.
    placeholderData: keepPreviousData,
  });
};

// ==========================================
// GET SINGLE EMPLOYEE
// ==========================================

export const useCompanyEmployee = (employeeId) => {
  return useQuery({
    queryKey:
      QUERY_KEYS.COMPANY.EMPLOYEE_DETAIL(employeeId),

    queryFn: () =>
      companyEmployeeApi.getEmployeeById(employeeId),

    enabled: !!employeeId,

    staleTime: 1000 * 60 * 5,
  });
};

// ==========================================
// INVITE EMPLOYEE
// ==========================================

export const useInviteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) =>
      companyEmployeeApi.inviteEmployee(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMPANY.EMPLOYEES,
      });
    },
  });
};

// ==========================================
// UPDATE EMPLOYEE
// ==========================================

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }) =>
      companyEmployeeApi.updateEmployee({
        id,
        ...payload,
      }),

    onSuccess: (_, variables) => {
      // Refresh employee detail
      queryClient.invalidateQueries({
        queryKey:
          QUERY_KEYS.COMPANY.EMPLOYEE_DETAIL(
            variables.id
          ),
      });

      // Refresh employee lists
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMPANY.EMPLOYEES,
      });
    },
  });
};

// ==========================================
// DELETE EMPLOYEE
// ==========================================

export const useDeleteEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (employeeId) =>
      companyEmployeeApi.deleteEmployee(employeeId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.COMPANY.EMPLOYEES,
      });
    },
  });
};