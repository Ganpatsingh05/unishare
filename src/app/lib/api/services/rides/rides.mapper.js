// Ride Data Mapper - Maps between frontend and Spring Boot backend formats

/**
 * Maps frontend ride data to Spring Boot RideCreateRequest DTO
 * @param {Object} frontendData - Ride data from frontend form
 * @returns {Object} - Spring Boot compatible ride data
 */
export const mapToBackendRide = (frontendData) => {
  const contactInfo = {};
  
  // Convert contacts array to contactInfo object
  if (frontendData.contacts && Array.isArray(frontendData.contacts)) {
    frontendData.contacts.forEach(contact => {
      if (contact.value && contact.value.trim()) {
        contactInfo[contact.type] = contact.value.trim();
      }
    });
  } else if (frontendData.contact_info) {
    Object.assign(contactInfo, frontendData.contact_info);
  }

  return {
    fromLocation: frontendData.from || frontendData.fromLocation,
    toLocation: frontendData.to || frontendData.toLocation,
    rideDate: frontendData.date || frontendData.rideDate,
    rideTime: frontendData.time || frontendData.rideTime,
    totalSeats: Number(frontendData.seats || frontendData.totalSeats),
    price: Number(frontendData.price),
    vehicleInfo: frontendData.vehicle || frontendData.vehicleInfo,
    description: frontendData.description || '',
    contactInfo: contactInfo
  };
};

/**
 * Maps Spring Boot Ride entity to frontend format
 * @param {Object} backendRide - Ride entity from Spring Boot
 * @returns {Object} - Frontend compatible ride data
 */
export const mapToFrontendRide = (backendRide) => {
  if (!backendRide) return null;

  // Convert contactInfo object to contacts array
  const contacts = [];
  if (backendRide.contactInfo) {
    Object.entries(backendRide.contactInfo).forEach(([type, value]) => {
      contacts.push({ type, value });
    });
  }

  return {
    id: backendRide.id,
    from: backendRide.fromLocation,
    to: backendRide.toLocation,
    date: backendRide.rideDate,
    time: backendRide.rideTime,
    seats: backendRide.totalSeats,
    availableSeats: backendRide.availableSeats,
    price: backendRide.price,
    vehicle: backendRide.vehicleInfo,
    description: backendRide.description,
    status: backendRide.status,
    organizerId: backendRide.organizerId,
    contactInfo: backendRide.contactInfo,
    contacts: contacts,
    createdAt: backendRide.createdAt,
    updatedAt: backendRide.updatedAt,
    cancelledAt: backendRide.cancelledAt,
    
    // Legacy field mappings for backward compatibility
    fromLocation: backendRide.fromLocation,
    toLocation: backendRide.toLocation,
    rideDate: backendRide.rideDate,
    rideTime: backendRide.rideTime,
    totalSeats: backendRide.totalSeats,
    vehicleInfo: backendRide.vehicleInfo
  };
};

/**
 * Maps array of Spring Boot rides to frontend format
 * @param {Array} backendRides - Array of Ride entities
 * @returns {Array} - Array of frontend compatible rides
 */
export const mapToFrontendRides = (backendRides) => {
  if (!Array.isArray(backendRides)) return [];
  return backendRides.map(mapToFrontendRide);
};

/**
 * Maps Spring Boot PageResponse to frontend pagination format
 * @param {Object} pageResponse - Spring Boot PageResponse
 * @returns {Object} - Frontend compatible pagination
 */
export const mapPaginationResponse = (pageResponse) => {
  return {
    data: mapToFrontendRides(pageResponse.content || pageResponse.data || []),
    pagination: {
      page: pageResponse.number || pageResponse.page || 0,
      size: pageResponse.size || 10,
      totalPages: pageResponse.totalPages || 0,
      totalElements: pageResponse.totalElements || pageResponse.total || 0
    },
    total: pageResponse.totalElements || pageResponse.total || 0
  };
};

/**
 * Validates ride data before sending to backend
 * @param {Object} rideData - Ride data to validate
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export const validateRideForBackend = (rideData) => {
  const errors = [];

  // Required field validation
  if (!rideData.from && !rideData.fromLocation) {
    errors.push('Starting location is required');
  }
  if (!rideData.to && !rideData.toLocation) {
    errors.push('Destination is required');
  }
  if (!rideData.date && !rideData.rideDate) {
    errors.push('Ride date is required');
  }
  if (!rideData.time && !rideData.rideTime) {
    errors.push('Ride time is required');
  }
  if (!rideData.vehicle && !rideData.vehicleInfo) {
    errors.push('Vehicle information is required');
  }

  // Numeric validation
  const seats = rideData.seats || rideData.totalSeats;
  if (!seats || isNaN(seats) || seats < 1 || seats > 10) {
    errors.push('Seats must be between 1 and 10');
  }

  const price = rideData.price;
  if (price === undefined || price === null || isNaN(price) || price < 0) {
    errors.push('Valid price is required (can be 0 for free rides)');
  }

  // Contact validation
  const hasContacts = (rideData.contacts && rideData.contacts.length > 0) ||
                      (rideData.contactInfo && Object.keys(rideData.contactInfo).length > 0);
  if (!hasContacts) {
    errors.push('At least one contact method is required');
  }

  // Date validation
  const date = rideData.date || rideData.rideDate;
  const time = rideData.time || rideData.rideTime;
  if (date && time) {
    const rideDateTime = new Date(`${date}T${time}`);
    if (rideDateTime <= new Date()) {
      errors.push('Ride date and time must be in the future');
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Format ride date and time for display
 * @param {string} date - ISO date string
 * @param {string} time - Time string
 * @returns {string} - Formatted date time
 */
export const formatRideDateTime = (date, time) => {
  if (!date) return 'Date not set';
  
  try {
    const dateObj = new Date(`${date}T${time || '00:00'}`);
    return dateObj.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: time ? '2-digit' : undefined,
      minute: time ? '2-digit' : undefined
    });
  } catch (error) {
    return `${date} ${time || ''}`;
  }
};

/**
 * Get ride status display information
 * @param {string} status - Ride status from backend
 * @returns {Object} - { label, color, icon }
 */
export const getRideStatusInfo = (status) => {
  const statusMap = {
    ACTIVE: {
      label: 'Active',
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      icon: '✓'
    },
    COMPLETED: {
      label: 'Completed',
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-800',
      icon: '✓✓'
    },
    CANCELLED: {
      label: 'Cancelled',
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      icon: '✗'
    },
    EXPIRED: {
      label: 'Expired',
      color: 'gray',
      bgColor: 'bg-gray-100',
      textColor: 'text-gray-800',
      icon: '⏱'
    }
  };

  return statusMap[status] || {
    label: status || 'Unknown',
    color: 'gray',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    icon: '?'
  };
};
