const axios = require('axios');

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// ─── Get Distance and Duration Between Two Points ────────────────────────────

exports.getDistance = async (pickupLat, pickupLon, dropoffLat, dropoffLon) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      throw new Error('Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
      params: {
        origins: `${pickupLat},${pickupLon}`,
        destinations: `${dropoffLat},${dropoffLon}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      console.error('Distance Matrix API error:', response.data.status);
      throw new Error(`Distance Matrix API error: ${response.data.status}`);
    }

    const result = response.data.rows[0].elements[0];

    if (result.status !== 'OK') {
      console.error('Distance element error:', result.status);
      throw new Error(`Could not calculate distance: ${result.status}`);
    }

    return {
      distance_meters: result.distance.value,
      distance_km: (result.distance.value / 1000).toFixed(2),
      duration_seconds: result.duration.value,
      duration_text: result.duration.text,
      distance_text: result.distance.text
    };
  } catch (error) {
    console.error('getDistance error:', error.message);
    throw error;
  }
};

// ─── Geocode Address to Lat/Lon ───────────────────────────────────────────────

exports.geocodeAddress = async (address) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      throw new Error('Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || response.data.results.length === 0) {
      console.error('Geocode error:', response.data.status);
      throw new Error(`Could not geocode address: ${response.data.status}`);
    }

    const location = response.data.results[0].geometry.location;
    const formatted_address = response.data.results[0].formatted_address;

    return {
      latitude: location.lat,
      longitude: location.lng,
      formatted_address
    };
  } catch (error) {
    console.error('geocodeAddress error:', error.message);
    throw error;
  }
};

// ─── Reverse Geocode Lat/Lon to Address ──────────────────────────────────────

exports.reverseGeocode = async (latitude, longitude) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      throw new Error('Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
      params: {
        latlng: `${latitude},${longitude}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK' || response.data.results.length === 0) {
      console.error('Reverse geocode error:', response.data.status);
      throw new Error(`Could not reverse geocode: ${response.data.status}`);
    }

    return response.data.results[0].formatted_address;
  } catch (error) {
    console.error('reverseGeocode error:', error.message);
    throw error;
  }
};

// ─── Get Route Information ────────────────────────────────────────────────────

exports.getRoute = async (pickupLat, pickupLon, dropoffLat, dropoffLon) => {
  try {
    if (!GOOGLE_MAPS_API_KEY) {
      console.error('GOOGLE_MAPS_API_KEY not configured');
      throw new Error('Maps API key not configured');
    }

    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${pickupLat},${pickupLon}`,
        destination: `${dropoffLat},${dropoffLon}`,
        key: GOOGLE_MAPS_API_KEY
      }
    });

    if (response.data.status !== 'OK') {
      console.error('Directions API error:', response.data.status);
      throw new Error(`Directions API error: ${response.data.status}`);
    }

    const route = response.data.routes[0];
    const leg = route.legs[0];

    return {
      distance_km: (leg.distance.value / 1000).toFixed(2),
      duration_text: leg.duration.text,
      polyline: route.overview_polyline.points,
      steps: leg.steps.map(step => ({
        instruction: step.html_instructions,
        distance: step.distance.text,
        duration: step.duration.text
      }))
    };
  } catch (error) {
    console.error('getRoute error:', error.message);
    throw error;
  }
};
