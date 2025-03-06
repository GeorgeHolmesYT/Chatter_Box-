import { supabase } from '../config/supabase.js';

export const checkUsernameAvailability = async (username) => {
    const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .single();

    if (error) {
        throw new Error('Error checking username');
    }

    return !data;
};

export const validateUsernameFormat = (username) => {
    const minLength = 3;
    const maxLength = 20;
    const validFormat = /^[a-zA-Z0-9_]+$/;
    
    return username.length >= minLength && 
           username.length <= maxLength && 
           validFormat.test(username);
};
