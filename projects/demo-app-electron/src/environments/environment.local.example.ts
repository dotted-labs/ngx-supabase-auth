/**
 * Example of a local environment configuration file.
 * Copy this file to 'environment.local.ts' and add your real credentials.
 * The local file will be ignored by git.
 */

export const environment = {
  // Override only what you need from the default environment
  supabase: {
    url: 'https://chayrsrhmqflptnwdhuu.supabase.co', // Your Supabase URL
    key: 'your-supabase-anon-key', // Your Supabase anon key
  },
  // You can override other properties too
  // auth: {
  //   ...custom auth settings if needed
  // },
  // electron: {
  //   ...custom electron settings if needed
  // }
};
