import { DestroyRef, inject } from '@angular/core';
import { Router } from '@angular/router';
import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from '@ngrx/signals';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import {
  AuthMode,
  AuthProvider,
  AuthState,
  PasswordResetRequest,
  SocialAuthProvider,
  UpdatePasswordRequest,
  UserProfileUpdate,
} from '../models/auth.models';
import { SupabaseAuthService } from '../services/auth.service';
import { computed } from '@angular/core';
import { updateState, withDevtools } from '@angular-architects/ngrx-toolkit';

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  enabledAuthProviders: [],
  redirectToDesktopAfterLogin: false,
};

/**
 * Authentication store using ngrx/signals
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withDevtools('authStore'), // <-- add this
  withState(initialState),
  withComputed((store) => ({
    avatarUrl: computed(() => {
      const user = store.user();
      if (user?.user_metadata?.['avatar_url']) {
        return user.user_metadata['avatar_url'];
      }
      return 'https://ui-avatars.com/api/?name=User&color=7F9CF5&background=EBF4FF&size=100';
    }),
    isAuthenticated: computed(() => !!store.user()),
    hasSocialProviders: computed(
      () => store.enabledAuthProviders().length > 0 && store.enabledAuthProviders().some((p) => p !== AuthProvider.EMAIL_PASSWORD),
    ),
    hasEmailPasswordProvider: computed(() => store.enabledAuthProviders().includes(AuthProvider.EMAIL_PASSWORD)),
  })),
  withMethods(
    (
      store,
      authService = inject(SupabaseAuthService),
      router = inject(Router),
      config = inject(SUPABASE_AUTH_CONFIG),
      destroyRef = inject(DestroyRef),
    ) => {
      /**
       * Initialize store and set up auth state listeners
       */
      const initializeStore = async () => {
        updateState(store, 'initialize store', { loading: true, enabledAuthProviders: config.enabledAuthProviders || [] });
        try {
          const user = await authService.getCurrentUser();

          updateState(store, 'initialize store completed', { user, loading: false });
        } catch (error) {
          updateState(store, 'initialize store error', {
            user: null,
            loading: false,
            error: (error as Error).message,
          });
        }
      };
      /**
       * Sign in with email and password
       * @param email User email
       * @param password User password
       */
      const signInWithEmail = async (email: string, password: string) => {
        updateState(store, 'sign in with email', { loading: true, error: null });

        try {
          const { user, error } = await authService.signInWithEmail(email, password);

          if (error) {
            updateState(store, 'sign in with email error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          updateState(store, 'sign in with email success', {
            user,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'sign in with email exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      const setRedirectToDesktopAfterLogin = (redirect: boolean) => {
        authService.setRedirectToDesktopAfterLogin(redirect);
        // patchState(store, { redirectToDesktopAfterLogin: redirect });
      };

      /**
       * Sign up with email and password
       * @param email User email
       * @param password User password
       */
      const signUpWithEmail = async (email: string, password: string) => {
        updateState(store, 'sign up with email', { loading: true, error: null });

        try {
          const { user, error } = await authService.signUpWithEmail(email, password);

          if (error) {
            updateState(store, 'sign up with email error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          updateState(store, 'sign up with email success', {
            user,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'sign up with email exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Sign in with a social provider
       * @param provider Social auth provider
       */
      const signInWithSocialProvider = async (provider: SocialAuthProvider) => {
        updateState(store, 'sign in with social provider', { loading: true, error: null });

        try {
          const { error } = await authService.signInWithSocialProvider(provider);

          if (error) {
            updateState(store, 'sign in with social provider error', {
              loading: false,
              error: error.message,
            });
          } else {
            updateState(store, 'sign in with social provider success', { loading: false });
          }
        } catch (error) {
          updateState(store, 'sign in with social provider exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Send password reset email
       * @param request Password reset request
       */
      const sendPasswordResetEmail = async (request: PasswordResetRequest) => {
        updateState(store, 'send password reset email', { loading: true, error: null });

        try {
          const { error } = await authService.sendPasswordResetEmail(request);

          updateState(store, 'send password reset email completed', {
            loading: false,
            error: error ? error.message : null,
          });
        } catch (error) {
          updateState(store, 'send password reset email exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Update user password
       * @param request Update password request
       */
      const updatePassword = async (request: UpdatePasswordRequest) => {
        updateState(store, 'update password', { loading: true, error: null });

        try {
          const { error } = await authService.updatePassword(request);

          updateState(store, 'update password completed', {
            loading: false,
            error: error ? error.message : null,
          });
        } catch (error) {
          updateState(store, 'update password exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Update user profile
       * @param update User profile update data
       */
      const updateProfile = async (update: UserProfileUpdate) => {
        updateState(store, 'update profile', { loading: true, error: null });

        try {
          const { error } = await authService.updateProfile(update);

          if (error) {
            updateState(store, 'update profile error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          // Get updated user data
          const user = await authService.getCurrentUser();
          updateState(store, 'update profile success', {
            user,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'update profile exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Sign out the current user
       */
      const signOut = async () => {
        updateState(store, 'sign out', { loading: true, error: null });

        try {
          const { error } = await authService.signOut();

          if (error) {
            updateState(store, 'sign out error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          updateState(store, 'sign out success', {
            user: null,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'sign out exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Get the current authentication mode (Web or Electron)
       * @returns The current auth mode
       */
      const getAuthMode = (): AuthMode => {
        return authService.getAuthMode();
      };

      /**
       * Upload a file to Supabase storage
       * @param bucketName The storage bucket name
       * @param filePath The file path within the bucket
       * @param file The file to upload
       * @returns Promise with the file URL or error
       */
      const uploadFile = async (bucketName: string, filePath: string, file: File) => {
        updateState(store, 'upload file', { loading: true, error: null });

        try {
          const { url, error } = await authService.uploadFile(bucketName, filePath, file);

          if (error) {
            updateState(store, 'upload file error', {
              loading: false,
              error: error.message,
            });
            return { url: null, error };
          }

          updateState(store, 'upload file success', {
            loading: false,
          });

          return { url, error: null };
        } catch (error) {
          updateState(store, 'upload file exception', {
            loading: false,
            error: (error as Error).message,
          });

          return { url: null, error };
        }
      };

      /**
       * Open external authentication window (for Electron mode)
       * @param path Authentication path
       * @param options Additional query parameters
       */
      const openExternalAuthWindow = async (path: string, options: Record<string, string> = {}) => {
        updateState(store, 'open external auth window', { loading: true, error: null });

        try {
          await authService.openExternalAuthWindow(path, options);
          updateState(store, 'open external auth window success', { loading: false });
        } catch (error) {
          updateState(store, 'open external auth window exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Process deep link URL and authenticate with hashed token
       * Used in Electron apps to handle the redirect from web auth
       * @param url Deep link URL containing authentication parameters
       */
      const processDeepLinkAuth = async (url: string) => {
        updateState(store, 'process deep link auth', { loading: true, error: null });

        try {
          // Extract token from URL
          const result = await authService.processDeepLinkUrl(url);

          if (result.error || !result.hashedToken) {
            updateState(store, 'process deep link auth error', {
              loading: false,
              error: result.error || 'Invalid deep link URL',
            });
            return;
          }

          // Verify the token and create a session
          const { user, error } = await authService.verifyHashedToken(result.hashedToken);

          if (error) {
            updateState(store, 'process deep link auth token error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          updateState(store, 'process deep link auth success', {
            user,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'process deep link auth exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Handle direct verification of a hashed token
       * @param hashedToken The hashed token to verify
       */
      const verifyHashedToken = async (hashedToken: string) => {
        updateState(store, 'verify hashed token', { loading: true, error: null });

        try {
          const { user, error } = await authService.verifyHashedToken(hashedToken);

          if (error) {
            updateState(store, 'verify hashed token error', {
              loading: false,
              error: error.message,
            });
            return;
          }

          updateState(store, 'verify hashed token success', {
            user,
            loading: false,
          });
        } catch (error) {
          updateState(store, 'verify hashed token exception', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      /**
       * Check if the user is authenticated
       * @returns True if the user is authenticated, false otherwise
       */
      const checkAuth = async () => {
        updateState(store, 'check auth', { loading: true, error: null });

        try {
          const isAuthenticated = await authService.isAuthenticated();

          console.log('[AuthStore] Check auth', isAuthenticated);

          if (isAuthenticated) {
            updateState(store, 'check auth success', { loading: false });
          }

          return isAuthenticated;
        } catch (error) {
          updateState(store, 'check auth exception', {
            loading: false,
            error: (error as Error).message,
          });
          return false;
        }
      };

      /**
       * Helper to check if a provider is enabled
       * @param provider Auth provider
       * @returns True if the provider is enabled, false otherwise
       */
      const isProviderEnabled = (provider: AuthProvider | SocialAuthProvider): boolean => {
        return store.enabledAuthProviders().includes(provider as AuthProvider);
      };

      const openAppDesktopAfterLogin = async () => {
        try {
          await authService.handleElectronAuth();
        } catch (error) {
          console.error('❌ [AuthStore] Failed to open app desktop after login', error);
          updateState(store, 'open app desktop after login error', {
            loading: false,
            error: (error as Error).message,
          });
        }
      };

      return {
        signInWithEmail,
        setRedirectToDesktopAfterLogin,
        signUpWithEmail,
        signInWithSocialProvider,
        sendPasswordResetEmail,
        updatePassword,
        updateProfile,
        signOut,
        getAuthMode,
        uploadFile,
        openExternalAuthWindow,
        processDeepLinkAuth,
        verifyHashedToken,
        checkAuth,
        isProviderEnabled,
        openAppDesktopAfterLogin,
        initializeStore,
      };
    },
  ),
  withHooks({
    onInit(store) {
      store.initializeStore();
    },
  }),
);
