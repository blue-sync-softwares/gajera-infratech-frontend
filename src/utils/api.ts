// API utility for making HTTP requests
// Base URL is configurable via environment variable or defaults to localhost:5000

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

interface ApiOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

/**
 * Generic API call function
 * @param endpoint - API endpoint (e.g., '/api/settings', '/upload')
 * @param options - Request options including method, headers, body, params
 * @returns Promise with response data
 */
export async function apiCall<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...fetchOptions } = options;

  // Build URL with query parameters if provided
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {} as Record<string, string>)
    ).toString();
    url += `?${queryString}`;
  }

  // Default headers
  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Merge with custom headers if provided
  const mergedHeaders = headers
    ? { ...defaultHeaders, ...Object.fromEntries(new Headers(headers)) }
    : defaultHeaders;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: mergedHeaders,
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP error! status: ${response.status}`,
        data: data,
      };
    }

    return {
      success: true,
      data: data,
      message: data.message,
    };
  } catch (error) {
    console.error('API call error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unknown error occurred',
    };
  }
}

/**
 * GET request
 */
export async function apiGet<T = any>(
  endpoint: string,
  params?: Record<string, string | number | boolean>,
  options?: Omit<ApiOptions, 'method' | 'body' | 'params'>
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'GET',
    params,
  });
}

/**
 * POST request
 */
export async function apiPost<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body),
    credentials: 'include'
  });
}

/**
 * PUT request
 */
export async function apiPut<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body),
  });
}

/**
 * PATCH request
 */
export async function apiPatch<T = any>(
  endpoint: string,
  body?: any,
  options?: Omit<ApiOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body),
  });
}

/**
 * DELETE request
 */
export async function apiDelete<T = any>(
  endpoint: string,
  options?: Omit<ApiOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
  return apiCall<T>(endpoint, {
    ...options,
    method: 'DELETE',
  });
}

/**
 * Upload file(s)
 * @param endpoint - Upload endpoint
 * @param file - File or Files to upload
 * @param fieldName - Form field name (default: 'file')
 * @param additionalData - Additional form data to send
 */
export async function apiUpload<T = any>(
  endpoint: string,
  file: File | File[],
  fieldName: string = 'file',
  additionalData?: Record<string, string>
): Promise<ApiResponse<T>> {
  const formData = new FormData();

  // Append file(s)
  if (Array.isArray(file)) {
    file.forEach((f) => formData.append(fieldName, f));
  } else {
    formData.append(fieldName, file);
  }

  // Append additional data
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value);
    });
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary for multipart/form-data
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || `HTTP error! status: ${response.status}`,
        data: data,
      };
    }

    return {
      success: true,
      data: data,
      message: data.message,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Download file
 */
export async function apiDownload(
  endpoint: string,
  filename?: string,
  options?: Omit<ApiOptions, 'method'>
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: 'GET',
    });

    if (!response.ok) {
      return {
        success: false,
        error: `HTTP error! status: ${response.status}`,
      };
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true };
  } catch (error) {
    console.error('Download error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Download failed',
    };
  }
}

// Export base URL for direct access if needed
export { API_BASE_URL };
