// import React, {
//   createContext,
//   useState,
//   useContext,
//   useEffect,
//   useCallback,
//   ReactNode,
// } from "react";
// import { useAuth } from "@clerk/clerk-react";
// import apiService from "../services/api";
// import googleFitService from "../services/googleFitService";

// // Define the UserProfile interface
// interface UserProfile {
//   id: string;
//   name: string;
//   email: string;
//   // Add other properties as needed
// }

// interface UserContextType {
//   profile: UserProfile | null;
//   isProfileLoading: boolean;
//   isGoogleFitConnected: boolean;
//   loadProfile: () => Promise<void>;
//   updateProfile: (data: Partial<UserProfile>) => Promise<void>;
//   checkGoogleFitStatus: () => Promise<boolean>;
// }

// const UserContext = createContext<UserContextType | undefined>(undefined);

// export const UserProvider: React.FC<{ children: ReactNode }> = ({
//   children,
// }) => {
//   const { isSignedIn, userId } = useAuth();
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [isProfileLoading, setIsProfileLoading] = useState<boolean>(true);
//   const [isGoogleFitConnected, setIsGoogleFitConnected] =
//     useState<boolean>(false);

//   const checkGoogleFitStatus = useCallback(async (): Promise<boolean> => {
//     try {
//       const status = await googleFitService.checkConnectionStatus();
//       setIsGoogleFitConnected(status);
//       return status;
//     } catch (error) {
//       console.error("Error checking Google Fit status:", error);
//       setIsGoogleFitConnected(false);
//       return false;
//     }
//   }, []);

//   const updateProfile = useCallback(
//     async (data: Partial<UserProfile>) => {
//       if (!isSignedIn || !userId) return;

//       try {
//         setIsProfileLoading(true);
//         // const updatedProfile = await apiService.updateUserProfile(userId, data);
//         // setProfile(updatedProfile);
//       } catch (error) {
//         console.error("Error updating user profile:", error);
//         throw error;
//       } finally {
//         setIsProfileLoading(false);
//       }
//     },
//     [isSignedIn, userId]
//   );

//   const loadProfile = useCallback(async () => {
//     if (!isSignedIn || !userId) return;

//     try {
//       setIsProfileLoading(true);
//     //   const userProfile = await apiService.getUser(userId);
//     //   setProfile(userProfile);
//       await checkGoogleFitStatus();
//     } catch (error) {
//       console.error("Error loading user profile:", error);
//     } finally {
//       setIsProfileLoading(false);
//     }
//   }, [isSignedIn, userId, checkGoogleFitStatus]);

//   useEffect(() => {
//     if (isSignedIn) {
//       loadProfile();
//     }
//   }, [isSignedIn, loadProfile]);

//   const contextValue: UserContextType = {
//     profile,
//     isProfileLoading,
//     isGoogleFitConnected,
//     loadProfile,
//     updateProfile,
//     checkGoogleFitStatus,
//   };

//   return (
//     <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
//   );
// };

// // Suppress the warning for this hook export
// // eslint-disable-next-line react-refresh/only-export-components
// export const useUserContext = () => {
//   const context = useContext(UserContext);
//   if (context === undefined) {
//     throw new Error("useUserContext must be used within a UserProvider");
//   }
//   return context;
// };

// export default UserContext;
