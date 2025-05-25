import { BaseHttpRequest } from '../sensay-sdk/core/BaseHttpRequest';
import type { ApiRequestOptions } from '../sensay-sdk/core/ApiRequestOptions';
import type { CancelablePromise } from '../sensay-sdk/core/CancelablePromise';
import type { OpenAPIConfig } from '../sensay-sdk/core/OpenAPI';
import { FetchHttpRequest } from '../sensay-sdk/core/FetchHttpRequest';

/**
 * Enhanced HTTP request with verbose logging
 */
export class VerboseHttpRequest extends BaseHttpRequest {
  private fetchRequest: FetchHttpRequest;

  constructor(config: OpenAPIConfig) {
    super(config);
    this.fetchRequest = new FetchHttpRequest(config);
  }

  /**
   * Request method with verbose logging
   * @param options The request options from the service
   * @returns CancelablePromise<T>
   * @throws ApiError
   */
  public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
    // Log request details
    console.group(`🔷 API Request: ${options.method} ${options.url}`);
    console.log('Request Options:', {
      method: options.method,
      url: options.url,
      path: options.path,
      query: options.query,
      body: options.body
    });
    console.groupEnd();

    // Use the standard FetchHttpRequest to make the actual request
    const promise = this.fetchRequest.request<T>(options);

    // Add logging for the response or error
    promise.then((response) => {
      console.group(`✅ API Response: ${options.method} ${options.url}`);
      console.log('Response:', response);
      console.groupEnd();
    }).catch((error) => {
      console.group(`❌ API Error: ${options.method} ${options.url}`);
      console.log('Error:', error);
      console.log('Error Status:', error.status);
      console.log('Error Message:', error.message);
      if (error.body) {
        console.log('Error Body:', error.body);
      }
      console.groupEnd();
    });

    return promise;
  }
}