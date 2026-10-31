import { useUserStudyRolesQuery } from "@study/api/userRoleApi";
import { UserRole } from "@study/types/user";
import { useMemo } from "react";

interface UserRoleResult {
  getUserRole: (studyId: number) => UserRole;
  isInstructor: (studyId: number) => boolean;
  isParticipant: (studyId: number) => boolean;
  isApplicant: (studyId: number) => boolean;
  hasApplied: (studyId: number) => boolean;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useUserRole = (): UserRoleResult => {
  const {
    data: userRoles,
    isLoading,
    error,
    refetch,
  } = useUserStudyRolesQuery();

  const getUserRole = useMemo(() => {
    return (studyId: number): UserRole => {
      if (!userRoles) return UserRole.GUEST;

      if (userRoles.instructorStudyIds?.includes(studyId)) {
        return UserRole.INSTRUCTOR;
      }

      if (userRoles.participantStudyIds?.includes(studyId)) {
        return UserRole.PARTICIPANT;
      }

      if (userRoles.appliedStudyIds?.includes(studyId)) {
        return UserRole.APPLICANT;
      }

      return UserRole.GUEST;
    };
  }, [userRoles]);

  const isInstructor = useMemo(() => {
    return (studyId: number): boolean => {
      return getUserRole(studyId) === UserRole.INSTRUCTOR;
    };
  }, [getUserRole]);

  const isParticipant = useMemo(() => {
    return (studyId: number): boolean => {
      return getUserRole(studyId) === UserRole.PARTICIPANT;
    };
  }, [getUserRole]);

  const isApplicant = useMemo(() => {
    return (studyId: number): boolean => {
      return getUserRole(studyId) === UserRole.APPLICANT;
    };
  }, [getUserRole]);

  const hasApplied = useMemo(() => {
    return (studyId: number): boolean => {
      if (!userRoles) return false;
      return (
        userRoles.appliedStudyIds?.includes(studyId) ||
        userRoles.participantStudyIds?.includes(studyId) ||
        false
      );
    };
  }, [userRoles]);

  return {
    getUserRole,
    isInstructor,
    isParticipant,
    isApplicant,
    hasApplied,
    isLoading,
    error: error as Error | null,
    refetch: () => void refetch(),
  };
};
