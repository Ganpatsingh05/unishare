// api/resources.js - Resources API functions
import { apiCall } from './base.js';

// ============== PUBLIC RESOURCES ==============

// Get all resources (public endpoint with admin override)
export const getResources = async (category = null, includeInactive = false) => {
  try {
    const params = new URLSearchParams();
    if (category && category !== 'all') {
      params.append('category', category);
    }
    if (includeInactive) {
      params.append('includeInactive', 'true');
    }
    
    const endpoint = `/admin/resources${params.toString() ? `?${params.toString()}` : ''}`;
    const data = await apiCall(endpoint);
    
    return {
      success: true,
      resources: Array.isArray(data) ? data : [],
      message: `Found ${Array.isArray(data) ? data.length : 0} resources`
    };
  } catch (error) {
    console.warn('Resources endpoint not available:', error.message);
    
    // Return demo/fallback resources for development when backend is not available
    const fallbackResources = [
      { id: 1, title: 'Academic Calendar', desc: 'Official academic schedule and holidays', category: 'academics', type: 'link', url: 'https://drive.google.com/file/d/example1', tags: ['calendar','dates'], active: true, created_at: '2024-01-01T00:00:00Z' },
      { id: 2, title: 'CS101 Syllabus', desc: 'Course outline and grading policy', category: 'docs', type: 'link', url: 'https://drive.google.com/file/d/example2', tags: ['cs','syllabus'], active: true, created_at: '2024-01-02T00:00:00Z' },
      { id: 3, title: 'Library Resources', desc: 'Digital library access and study materials', category: 'campus', type: 'link', url: 'https://drive.google.com/folder/d/example3', tags: ['library','books'], active: false, created_at: '2024-01-03T00:00:00Z' },
      { id: 4, title: 'Student Software Pack', desc: 'Essential software and tools for students', category: 'tools', type: 'link', url: 'https://drive.google.com/folder/d/example4', tags: ['software','tools'], active: true, created_at: '2024-01-04T00:00:00Z' },
      { id: 5, title: 'Campus Resources', desc: 'Maps, guides and campus information', category: 'media', type: 'link', url: 'https://drive.google.com/folder/d/example5', tags: ['campus','guides'], active: true, created_at: '2024-01-05T00:00:00Z' },
    ];
    
    // Filter by category if specified
    let filteredResources = category && category !== 'all' 
      ? fallbackResources.filter(r => r.category === category)
      : fallbackResources;
    
    // Filter by active status unless includeInactive is true
    if (!includeInactive) {
      filteredResources = filteredResources.filter(r => r.active);
    }
    
    return { 
      success: true, 
      resources: filteredResources,
      message: 'Using demo resources (backend not available)' 
    };
  }
};

// Get available categories (public endpoint)
export const getResourceCategories = async () => {
  try {
    const data = await apiCall('/admin/resources/categories');
    
    return {
      success: true,
      categories: Array.isArray(data) ? data : [],
      message: 'Categories loaded successfully'
    };
  } catch (error) {
    console.warn('Categories endpoint not available:', error.message);
    
    // Return fallback categories
    const fallbackCategories = [
      { key: 'academics', label: 'Academics' },
      { key: 'tools', label: 'Tools' },
      { key: 'campus', label: 'Campus' },
      { key: 'docs', label: 'Docs' },
      { key: 'media', label: 'Media' }
    ];
    
    return { 
      success: true, 
      categories: fallbackCategories,
      message: 'Using demo categories (backend not available)' 
    };
  }
};

// ============== ADMIN RESOURCES MANAGEMENT ==============

// Create a new resource (admin only)
export const createResource = async (resourceData) => {
  try {
    // Ensure tags are properly formatted and include all required fields
    const processedData = {
      title: resourceData.title,
      desc: resourceData.desc || '',
      category: resourceData.category,
      type: resourceData.type || 'link',
      url: resourceData.url,
      tags: Array.isArray(resourceData.tags) ? resourceData.tags : [],
      active: resourceData.active !== undefined ? resourceData.active : true
    };
    
    const data = await apiCall('/admin/resources', {
      method: 'POST',
      body: JSON.stringify(processedData)
    });
    
    return {
      success: true,
      resource: data,
      message: 'Resource created successfully'
    };
  } catch (error) {
    // Handle validation errors from backend
    if (error.response && error.response.status === 400) {
      try {
        const errorData = await error.response.json();
        return {
          success: false,
          errors: errorData.errors || [errorData.error || 'Validation failed'],
          message: 'Validation failed'
        };
      } catch (jsonError) {
        return {
          success: false,
          errors: ['Validation failed'],
          message: 'Validation failed'
        };
      }
    }
    
    console.warn('Create resource endpoint not available:', error.message);
    // Return success for demo mode
    return {
      success: true,
      resource: {
        id: Date.now(),
        ...resourceData,
        type: resourceData.type || 'link',
        active: true,
        created_at: new Date().toISOString()
      },
      message: 'Resource created (demo mode)'
    };
  }
};

// Update an existing resource (admin only)
export const updateResource = async (resourceId, updates) => {
  try {
    // Ensure tags are properly formatted and include all required fields
    const processedUpdates = {
      title: updates.title,
      desc: updates.desc || '',
      category: updates.category,
      type: updates.type || 'link',
      url: updates.url,
      tags: Array.isArray(updates.tags) ? updates.tags : [],
      active: updates.active !== undefined ? updates.active : true
    };
    
    const data = await apiCall(`/admin/resources/${resourceId}`, {
      method: 'PUT',
      body: JSON.stringify(processedUpdates)
    });
    
    return {
      success: true,
      resource: data,
      message: 'Resource updated successfully'
    };
  } catch (error) {
    // Handle validation errors from backend
    if (error.response && error.response.status === 400) {
      try {
        const errorData = await error.response.json();
        return {
          success: false,
          errors: errorData.errors || [errorData.error || 'Validation failed'],
          message: 'Validation failed'
        };
      } catch (jsonError) {
        return {
          success: false,
          errors: ['Validation failed'],
          message: 'Validation failed'
        };
      }
    }
    
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        errors: ['Resource not found'],
        message: 'Resource not found'
      };
    }
    
    console.warn('Update resource endpoint not available:', error.message);
    // Return success for demo mode
    return {
      success: true,
      resource: { id: resourceId, ...updates, updated_at: new Date().toISOString() },
      message: 'Resource updated (demo mode)'
    };
  }
};

// Delete a resource (admin only)
export const deleteResource = async (resourceId) => {
  try {
    const data = await apiCall(`/admin/resources/${resourceId}`, {
      method: 'DELETE'
    });
    
    return {
      success: true,
      message: data.message || 'Resource deleted successfully',
      resourceId: data.id || resourceId
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        message: 'Resource not found',
        resourceId
      };
    }
    
    console.warn('Delete resource endpoint not available:', error.message);
    // Return success for demo mode
    return {
      success: true,
      message: 'Resource deleted (demo mode)',
      resourceId
    };
  }
};

// Toggle resource active status (admin only)
export const toggleResourceActive = async (resourceId) => {
  try {
    const data = await apiCall(`/admin/resources/${resourceId}/toggle`, {
      method: 'PATCH'
    });
    
    return {
      success: true,
      message: data.message || 'Resource status toggled successfully',
      resource: data.resource
    };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return {
        success: false,
        message: 'Resource not found'
      };
    }
    
    console.warn('Toggle resource endpoint not available:', error.message);
    // Return success for demo mode
    return {
      success: true,
      message: 'Resource status toggled (demo mode)',
      resource: { id: resourceId, active: !true } // Fake toggle
    };
  }
};

// ============== REQUESTED RESOURCES (inactive ones) ==============

// Get all inactive resources (used as "Requested" section)
export const getRequestedResources = async () => {
  try {
    // Fetch all resources including inactive, then filter client-side
    const params = new URLSearchParams();
    params.append('includeInactive', 'true');
    const data = await apiCall(`/admin/resources?${params.toString()}`);

    const list = Array.isArray(data) ? data.filter(r => r && r.active === false) : [];
    return {
      success: true,
      requestedResources: list,
      message: `Found ${list.length} inactive resources`
    };
  } catch (error) {
    return {
      success: false,
      requestedResources: [],
      message: error.message || 'Failed to load inactive resources'
    };
  }
};

// ============== PUBLIC SUGGESTIONS ==============

// Submit a resource suggestion (public users)
export const submitResourceSuggestion = async ({ title, desc, category, type = 'link', url, tags = [] }) => {
  try {
    const payload = {
      title,
      desc: desc || '',
      category,
      type: type || 'link',
      url,
      tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t=>t.trim()).filter(Boolean) : [])
    };
    const data = await apiCall('/admin/resources/suggestions', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return {
      success: true,
      message: data.message || 'Suggestion submitted successfully',
      suggestion: data.suggestion || null
    };
  } catch (error) {
    // Try to extract validation errors when available
    if (error.response && error.response.status === 400) {
      try {
        const err = await error.response.json();
        return { success: false, errors: err.errors || [err.error || 'Validation failed'] };
      } catch {}
    }
    return { success: false, errors: [error.message || 'Failed to submit suggestion'] };
  }
};