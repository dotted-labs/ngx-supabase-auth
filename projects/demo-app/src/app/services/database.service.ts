import { Injectable } from '@angular/core';
import { supabaseClient } from '../app.config';

/**
 * Example service showing how to use the same Supabase client
 * that is used by the auth library throughout your application
 */
@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  /**
   * Example method to get todos from Supabase
   * Uses the same client instance as the auth library
   */
  async getTodos() {
    const { data, error } = await supabaseClient.from('todos').select('*');

    return { data, error };
  }

  /**
   * Example method to create a todo
   */
  async createTodo(title: string) {
    const { data, error } = await supabaseClient
      .from('todos')
      .insert([{ title, completed: false }])
      .select();

    return { data, error };
  }

  /**
   * Example method to upload a file to Supabase storage
   * Uses the same client instance as the auth library
   */
  async uploadFile(bucket: string, path: string, file: File) {
    const { data, error } = await supabaseClient.storage.from(bucket).upload(path, file);

    return { data, error };
  }
}
