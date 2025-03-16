import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { patchState, signalStore, withHooks, withMethods, withState } from '@ngrx/signals';
import {
  AuthState,
  SocialAuthProvider,
  SupabaseUser,
  PasswordResetRequest,
  UpdatePasswordRequest,
  UserProfileUpdate,
  AuthMode,
  ElectronAuthResult,
} from '../models/auth.models';
import { SupabaseAuthService } from '../services/auth.service';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

/**
 * Initial auth state
 */
const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

/**
 * Authentication store using ngrx/signals
 */
export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods(
    (
      store,
      authService = inject(SupabaseAuthService),
      router = inject(Router),
      config = inject(SUPABASE_AUTH_CONFIG),
      destroyRef = inject(DestroyRef),
    ) => {
      return {
        /**
         * Initialize store and set up auth state listeners
         */
        async initializeStore() {
          patchState(store, { loading: true });
          try {
            const user = await authService.getCurrentUser();
            patchState(store, { user, loading: false });
          } catch (error) {
            patchState(store, {
              user: null,
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Sign in with email and password
         * @param email User email
         * @param password User password
         */
        async signInWithEmail(email: string, password: string) {
          patchState(store, { loading: true, error: null });

          try {
            const { user, error } = await authService.signInWithEmail(email, password);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            patchState(store, {
              user,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Sign up with email and password
         * @param email User email
         * @param password User password
         */
        async signUpWithEmail(email: string, password: string) {
          patchState(store, { loading: true, error: null });

          try {
            const { user, error } = await authService.signUpWithEmail(email, password);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            patchState(store, {
              user,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Sign in with a social provider
         * @param provider Social auth provider
         */
        async signInWithSocialProvider(provider: SocialAuthProvider) {
          patchState(store, { loading: true, error: null });

          try {
            const { error } = await authService.signInWithSocialProvider(provider);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
            } else {
              patchState(store, { loading: false });
            }
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Send password reset email
         * @param request Password reset request
         */
        async sendPasswordResetEmail(request: PasswordResetRequest) {
          patchState(store, { loading: true, error: null });

          try {
            const { error } = await authService.sendPasswordResetEmail(request);

            patchState(store, {
              loading: false,
              error: error ? error.message : null,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Update user password
         * @param request Update password request
         */
        async updatePassword(request: UpdatePasswordRequest) {
          patchState(store, { loading: true, error: null });

          try {
            const { error } = await authService.updatePassword(request);

            patchState(store, {
              loading: false,
              error: error ? error.message : null,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Update user profile
         * @param update User profile update data
         */
        async updateProfile(update: UserProfileUpdate) {
          patchState(store, { loading: true, error: null });

          try {
            const { error } = await authService.updateProfile(update);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            // Get updated user data
            const user = await authService.getCurrentUser();
            patchState(store, {
              user,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Sign out the current user
         */
        async signOut() {
          patchState(store, { loading: true, error: null });

          try {
            const { error } = await authService.signOut();

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            patchState(store, {
              user: null,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Get the current authentication mode (Web or Electron)
         * @returns The current auth mode
         */
        getAuthMode(): AuthMode {
          return authService.getAuthMode();
        },

        /**
         * Open external authentication window (for Electron mode)
         * @param path Authentication path
         * @param options Additional query parameters
         */
        async openExternalAuthWindow(path: string, options: Record<string, string> = {}) {
          patchState(store, { loading: true, error: null });

          try {
            await authService.openExternalAuthWindow(path, options);
            patchState(store, { loading: false });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Process deep link URL and authenticate with hashed token
         * Used in Electron apps to handle the redirect from web auth
         * @param url Deep link URL containing authentication parameters
         */
        async processDeepLinkAuth(url: string) {
          patchState(store, { loading: true, error: null });

          try {
            // Extract token from URL
            const result = await authService.processDeepLinkUrl(url);

            if (result.error || !result.hashedToken) {
              patchState(store, {
                loading: false,
                error: result.error || 'Invalid deep link URL',
              });
              return;
            }

            // Verify the token and create a session
            const { user, error } = await authService.verifyHashedToken(result.hashedToken);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            patchState(store, {
              user,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },

        /**
         * Handle direct verification of a hashed token
         * @param hashedToken The hashed token to verify
         */
        async verifyHashedToken(hashedToken: string) {
          patchState(store, { loading: true, error: null });

          try {
            const { user, error } = await authService.verifyHashedToken(hashedToken);

            if (error) {
              patchState(store, {
                loading: false,
                error: error.message,
              });
              return;
            }

            patchState(store, {
              user,
              loading: false,
            });
          } catch (error) {
            patchState(store, {
              loading: false,
              error: (error as Error).message,
            });
          }
        },
      };
    },
  ),
  withHooks({
    onInit(store) {
      store.initializeStore();
    },
  }),
);
