'use client';

import React, { useState } from 'react';

interface RedeemKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  code: string;
  organizationName: string;
  name: string;
  email: string;
}

interface RedeemResponse {
  success: boolean;
  apiKey: string;
  organizationID: string;
  validUntil: string;
}

const RedeemKeyModal: React.FC<RedeemKeyModalProps> = ({ isOpen, onClose }) => {
  const [formValues, setFormValues] = useState<FormValues>({
    code: '',
    organizationName: '',
    name: '',
    email: '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [apiKeyData, setApiKeyData] = useState<RedeemResponse | null>(null);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [orgIdCopied, setOrgIdCopied] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.sensay.io/v1/api-keys/invites/${formValues.code}/redeem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationName: formValues.organizationName,
          name: formValues.name,
          email: formValues.email,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Extract the specific error message from the response
        let errorMessage;
        if (errorData.error) {
          errorMessage = errorData.error.message || errorData.error;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else {
          // If no specific error message is found, use a generic one
          errorMessage = `API error (${response.status}): Failed to redeem API key`;
        }
        
        throw new Error(errorMessage);
      }
      
      const data: RedeemResponse = await response.json();
      setApiKeyData(data);
      
      // Reset form
      setFormValues({
        code: '',
        organizationName: '',
        name: '',
        email: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const copyApiKey = () => {
    if (apiKeyData) {
      navigator.clipboard.writeText(apiKeyData.apiKey);
      setApiKeyCopied(true);
      setTimeout(() => setApiKeyCopied(false), 2000);
    }
  };
  
  const copyOrgId = () => {
    if (apiKeyData) {
      navigator.clipboard.writeText(apiKeyData.organizationID);
      setOrgIdCopied(true);
      setTimeout(() => setOrgIdCopied(false), 2000);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {apiKeyData ? 'API Key Generated' : 'Redeem API Key'}
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {apiKeyData ? (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="ml-2 text-green-700 font-medium">API Key successfully created!</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-700">Your API Key</p>
                  <div className="mt-1 relative">
                    <div className="bg-gray-100 p-3 pr-24 rounded-md font-mono text-sm overflow-x-auto whitespace-nowrap">
                      {apiKeyData.apiKey}
                    </div>
                    <button
                      onClick={copyApiKey}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                    >
                      {apiKeyCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Organization ID</p>
                  <div className="mt-1 relative">
                    <div className="bg-gray-100 p-3 pr-24 rounded-md font-mono text-sm overflow-x-auto whitespace-nowrap">
                      {apiKeyData.organizationID}
                    </div>
                    <button
                      onClick={copyOrgId}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs font-medium bg-white border border-gray-300 rounded-md px-2 py-1 hover:bg-gray-50"
                    >
                      {orgIdCopied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Valid Until</p>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDate(apiKeyData.validUntil)}
                  </p>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">Important notes</h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <ul className="list-disc space-y-1 pl-5">
                        <li>Save your <strong>API key</strong> in a secure location.</li>
                        <li>Copy your <strong>API key</strong> in your <strong>`.env.local`</strong> file.</li>
                        <li>You won&apos;t be able to see the API key again after closing this window.</li>
                        <li><strong>Organization ID</strong> is needed when communicating with the Sensay Support Team.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 flex justify-end">
                <button 
                  onClick={onClose} 
                  className="btn btn-primary"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Error Redeeming API Key</h3>
                      <div className="mt-2 text-sm text-red-700">
                        {error}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Invitation Code <span className="text-red-500">*</span>
                </label>
                <input 
                  id="code"
                  name="code"
                  type="text"
                  required
                  value={formValues.code}
                  onChange={handleChange}
                  className="mt-1 w-full input"
                  placeholder="Enter your invitation code"
                />
              </div>
              
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  required
                  value={formValues.organizationName}
                  onChange={handleChange}
                  className="mt-1 w-full input"
                  placeholder="Your company or organization name"
                />
              </div>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input 
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={formValues.name}
                  onChange={handleChange}
                  className="mt-1 w-full input"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input 
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formValues.email}
                  onChange={handleChange}
                  className="mt-1 w-full input"
                  placeholder="you@example.com"
                />
              </div>
              
              <div className="pt-4 flex justify-end space-x-3">
                <button 
                  type="button"
                  onClick={onClose} 
                  className="btn bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : 'Redeem API Key'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RedeemKeyModal;