/**
 * Analytics utility for tracking user feature usage
 */

import axios from 'axios';
import { API_BASE_URL } from '../config/api';

/**
 * Track feature usage for the current user
 * @param {string} featureType - The type of feature being used (e.g., 'text-to-image', 'image-to-text')
 * @param {string} action - The action being performed (e.g., 'generate', 'analyze')
 * @param {object} data - Additional data about the interaction
 * @param {string} userId - The user's UID from Firebase auth
 */
export const trackFeatureUsage = async (featureType, action, data = {}, userId = null) => {
  try {
    await axios.post(`${API_BASE_URL}/api/track`, {
      feature_type: featureType,
      action: action,
      data: data,
      userId: userId
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    // Don't throw error - tracking should not break the app
  }
};

/**
 * Get user-specific usage statistics
 * @param {string} userId - The user's UID from Firebase auth
 */
export const getUserUsageStats = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/usage`, {
      userId: userId
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching usage stats:', error);
    return {
      textToText: 0,
      textToImage: 0,
      imageToText: 0,
      voiceToText: 0,
      textToAudio: 0,
      imageEnhance: 0,
      outpainting: 0
    };
  }
};
