import { Injectable, inject, effect, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import {
  AuthState,
  SocialAuthProvider,
  SupabaseUser,
  PasswordResetRequest,
  UpdatePasswordRequest,
  UserProfileUpdate,
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
      destroyRef = inject(DestroyRef)
    ) => {
      // Initialize the store
      effect(() => {
        initializeStore();
      });

      /**
       * Initialize store and set up auth state listeners
       */
      async function initializeStore() {
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
      }

      return {
        /**
         * Sign in with email and password
         * @param email User email
         * @param password User password
         */
        async signInWithEmail(email: string, password: string) {
          patchState(store, { loading: true, error: null });

          try {
            const { user, error } = await authService.signInWithEmail(
              email,
              password
            );

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
            const { user, error } = await authService.signUpWithEmail(
              email,
              password
            );

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
            const { error } = await authService.signInWithSocialProvider(
              provider
            );

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
      };
    }
  )
);
