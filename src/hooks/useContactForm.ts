import { useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/supabase';

type Reservation = Database['public']['Tables']['reservations']['Insert'];
type ContactMessage = Database['public']['Tables']['contact_messages']['Insert'];

export const useContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitReservation = async (reservationData: Reservation) => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Demo mode: Reservation would be saved:', reservationData);
        return { success: true, error: null };
      }

      const { data, error } = await supabase
        .from('reservations')
        .insert([reservationData])
        .select()
        .single();

      if (error) throw error;

      // Also create a contact message for the restaurant staff
      const contactData: ContactMessage = {
        name: reservationData.name,
        email: reservationData.email,
        subject: `Table Reservation - ${reservationData.date} at ${reservationData.time}`,
        message: `Reservation Details:
- Name: ${reservationData.name}
- Email: ${reservationData.email}
- Phone: ${reservationData.phone || 'Not provided'}
- Date: ${reservationData.date}
- Time: ${reservationData.time}
- Guests: ${reservationData.guests}
- Special Requests: ${reservationData.message || 'None'}`,
        status: 'unread'
      };

      await supabase
        .from('contact_messages')
        .insert([contactData]);

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const submitContactMessage = async (messageData: ContactMessage) => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        // Demo mode - simulate success
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Demo mode: Contact message would be saved:', messageData);
        return { success: true, error: null };
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert([messageData])
        .select()
        .single();

      if (error) throw error;

      return { success: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    submitReservation,
    submitContactMessage,
  };
};