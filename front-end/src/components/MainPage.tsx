import React, { useState } from 'react';

function MainPage() {
  // Request state
  const [activeTab, setActiveTab] = useState('Params');
  const [activeResponseTab, setActiveResponseTab] = useState('Body');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/users');
  const [protocol, setProtocol] = useState('http');
  
  // Response state
  const [responseStatus, setResponseStatus] = useState(200);
  const [responseStatusText, setResponseStatusText] = useState('OK');
  const [responseTime, setResponseTime] = useState('123');
  const [responseBody, setResponseBody] = useState(`{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    },
    {
      "id": 2,
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  ]
}`);
  const [responseHeaders, setResponseHeaders] = useState(`Content-Type: application/json
Content-Length: 157
Access-Control-Allow-Origin: *
Cache-Control: no-cache`);

  // Tab content states
  const [params, setParams] = useState([
    { key: '', value: '', description: '' },
    { key: '', value: '', description: '' }
  ]);
  const [headers, setHeaders] = useState([
    { key: 'Content-Type', value: 'application/json', description: '' },
    { key: '', value: '', description: '' }
  ]);
  const [bodyContent, setBodyContent] = useState('');
  const [bodyType, setBodyType] = useState('raw');
  const [authType, setAuthType] = useState('none');
  
  // Response display type
  const [responseViewType, setResponseViewType] = useState('raw');
  const [contentType, setContentType] = useState('application/json');

  // Function to determine if response is HTML
  const isHtmlResponse = () => {
    return responseHeaders.toLowerCase().includes('content-type: text/html') || 
           contentType.toLowerCase().includes('text/html');
  };

  // Add a new param, header, etc.
  const addRow = (type) => {
    if (type === 'params') {
      setParams([...params, { key: '', value: '', description: '' }]);
    } else if (type === 'headers') {
      setHeaders([...headers, { key: '', value: '', description: '' }]);
    }
  };

  // Update row values
  const updateRow = (type, index, field, value) => {
    if (type === 'params') {
      const newParams = [...params];
      newParams[index][field] = value;
      setParams(newParams);
    } else if (type === 'headers') {
      const newHeaders = [...headers];
      newHeaders[index][field] = value;
      setHeaders(newHeaders);
    }
  };

  // Mock send request function
  const sendRequest = () => {
    // In a real app, this would make an actual API call
    // For now, we'll just simulate different responses based on the method
    
    const startTime = Date.now();
    
    // Simulate network delay
    setTimeout(() => {
      const responseTime = Date.now() - startTime;
      setResponseTime(responseTime.toString());
      
      if (method === 'GET') {
        setResponseStatus(200);
        setResponseStatusText('OK');
        
        // Check if URL contains "html" to simulate HTML response
        if (url.toLowerCase().includes('html')) {
          setContentType('text/html');
          setResponseBody(`<!DOCTYPE html>
<html>
<head>
  <title>API Response</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is an HTML response from the API.</p>
  <ul>
    <li>Item 1</li>
    <li>Item 2</li>
    <li>Item 3</li>
  </ul>
</body>
</html>`);
          setResponseHeaders(`Content-Type: text/html
Content-Length: 227
Access-Control-Allow-Origin: *
Cache-Control: no-cache`);
        } else {
          setContentType('application/json');
          setResponseBody(JSON.stringify({
            status: "success",
            data: [
              { id: 1, name: "John Doe", email: "john@example.com" },
              { id: 2, name: "Jane Smith", email: "jane@example.com" }
            ]
          }, null, 2));
          setResponseHeaders(`Content-Type: application/json
Content-Length: 157
Access-Control-Allow-Origin: *
Cache-Control: no-cache`);
        }
      } else if (method === 'POST' || method === 'PUT') {
        setResponseStatus(201);
        setResponseStatusText('Created');
        setContentType('application/json');
        setResponseBody(JSON.stringify({
          status: "success",
          message: "Resource created successfully",
          id: 3
        }, null, 2));
        setResponseHeaders(`Content-Type: application/json
Content-Length: 89
Access-Control-Allow-Origin: *
Cache-Control: no-cache`);
      } else if (method === 'DELETE') {
        setResponseStatus(204);
        setResponseStatusText('No Content');
        setContentType('application/json');
        setResponseBody('');
        setResponseHeaders(`Content-Length: 0
Access-Control-Allow-Origin: *
Cache-Control: no-cache`);
      }
    }, 500);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="flex items-center px-5 py-3 bg-white shadow">
        <div className="flex items-center text-lg font-bold text-orange-500 mr-5">
          <i className="fa fa-bolt mr-2"></i>
          <span>API Craft</span>
        </div>
        <div className="flex-grow max-w-xl">
          <input 
            type="text" 
            placeholder="Search APIs..." 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
          />
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <h3 className="font-medium">Collections</h3>
            <button className="text-gray-500 hover:text-orange-500">
              <i className="fa fa-plus"></i>
            </button>
          </div>
          
          <div className="py-2">
            <div className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer font-medium">
              <i className="fa fa-folder text-gray-500 mr-2"></i>
              <span>My Collection</span>
            </div>
            <div className="flex items-center px-4 py-2 pl-9 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded mr-2 w-12 text-center">GET</span>
              <span className="text-sm overflow-hidden text-ellipsis">api/users</span>
            </div>
            <div className="flex items-center px-4 py-2 pl-9 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded mr-2 w-12 text-center">POST</span>
              <span className="text-sm overflow-hidden text-ellipsis">api/users/create</span>
            </div>
            <div className="flex items-center px-4 py-2 pl-9 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded mr-2 w-12 text-center">PUT</span>
              <span className="text-sm overflow-hidden text-ellipsis">api/users/update</span>
            </div>
          </div>
          
          <div className="flex justify-between items-center p-4 border-b border-t border-gray-100">
            <h3 className="font-medium">History</h3>
          </div>
          
          <div className="py-2">
            <div className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded mr-2 w-12 text-center">GET</span>
              <span className="text-xs text-gray-600 overflow-hidden text-ellipsis">https://api.example.com/users</span>
            </div>
            <div className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-orange-50 text-orange-700 text-xs font-bold rounded mr-2 w-12 text-center">POST</span>
              <span className="text-xs text-gray-600 overflow-hidden text-ellipsis">https://api.example.com/data</span>
            </div>
            <div className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
              <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold rounded mr-2 w-12 text-center">GET</span>
              <span className="text-xs text-gray-600 overflow-hidden text-ellipsis">http://localhost:3000/api/v1</span>
            </div>
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex p-4 border-b border-gray-200">
            <div className="flex mr-2">
              <select 
                className="px-3 py-2 bg-white border border-gray-300 rounded-l text-sm mr-px"
                value={protocol}
                onChange={(e) => setProtocol(e.target.value)}
              >
                <option value="http">HTTP</option>
                <option value="ws">WebSocket</option>
              </select>
              <select 
                className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium"
                value={method}
                onChange={(e) => setMethod(e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
                <option value="PATCH">PATCH</option>
              </select>
            </div>
            <input 
              type="text" 
              className="flex-1 px-3 py-2 border border-gray-300 rounded mr-2 text-sm"
              placeholder="Enter request URL" 
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <button 
              className="px-5 py-2 bg-orange-500 text-white rounded font-medium hover:bg-orange-600 transition-colors"
              onClick={sendRequest}
            >
              Send
            </button>
          </div>
          
          <div className="flex border-b border-gray-200">
            {['Params', 'Headers', 'Body', 'Auth'].map(tab => (
              <button 
                key={tab}
                className={`px-5 py-3 text-sm font-medium ${
                  activeTab === tab 
                    ? 'text-orange-500 border-b-2 border-orange-500' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          
          <div className="p-4 border-b border-gray-200 overflow-y-auto">
            {activeTab === 'Params' && (
              <div>
                <div className="flex font-medium text-sm text-gray-500 border-b border-gray-200 pb-2">
                  <div className="flex-1 px-2">Key</div>
                  <div className="flex-1 px-2">Value</div>
                  <div className="flex-1 px-2">Description</div>
                </div>
                {params.map((param, index) => (
                  <div key={index} className="flex py-2 border-b border-gray-100">
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Key" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={param.key}
                        onChange={(e) => updateRow('params', index, 'key', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Value" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={param.value}
                        onChange={(e) => updateRow('params', index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Description" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={param.description}
                        onChange={(e) => updateRow('params', index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <div className="py-3">
                  <button 
                    className="text-gray-500 hover:text-orange-500 text-sm"
                    onClick={() => addRow('params')}
                  >
                    <i className="fa fa-plus mr-1"></i> Add Parameter
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Headers' && (
              <div>
                <div className="flex font-medium text-sm text-gray-500 border-b border-gray-200 pb-2">
                  <div className="flex-1 px-2">Key</div>
                  <div className="flex-1 px-2">Value</div>
                  <div className="flex-1 px-2">Description</div>
                </div>
                {headers.map((header, index) => (
                  <div key={index} className="flex py-2 border-b border-gray-100">
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Key" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={header.key}
                        onChange={(e) => updateRow('headers', index, 'key', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Value" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={header.value}
                        onChange={(e) => updateRow('headers', index, 'value', e.target.value)}
                      />
                    </div>
                    <div className="flex-1 px-2">
                      <input 
                        type="text" 
                        placeholder="Description" 
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={header.description}
                        onChange={(e) => updateRow('headers', index, 'description', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
                <div className="py-3">
                  <button 
                    className="text-gray-500 hover:text-orange-500 text-sm"
                    onClick={() => addRow('headers')}
                  >
                    <i className="fa fa-plus mr-1"></i> Add Header
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Body' && (
              <div>
                <div className="mb-4">
                  <div className="flex mb-2">
                    <button 
                      className={`px-4 py-2 text-sm ${bodyType === 'raw' ? 'bg-gray-200' : 'bg-white'} border border-gray-300 rounded-l`}
                      onClick={() => setBodyType('raw')}
                    >
                      Raw
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm ${bodyType === 'form-data' ? 'bg-gray-200' : 'bg-white'} border-t border-b border-r border-gray-300`}
                      onClick={() => setBodyType('form-data')}
                    >
                      Form Data
                    </button>
                    <button 
                      className={`px-4 py-2 text-sm ${bodyType === 'x-form' ? 'bg-gray-200' : 'bg-white'} border-t border-b border-r border-gray-300 rounded-r`}
                      onClick={() => setBodyType('x-form')}
                    >
                      x-www-form-urlencoded
                    </button>
                  </div>
                  
                  {bodyType === 'raw' && (
                    <div>
                      <select 
                        className="w-full p-2 mb-2 border border-gray-300 rounded text-sm"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                      >
                        <option value="application/json">JSON</option>
                        <option value="text/plain">Text</option>
                        <option value="application/xml">XML</option>
                        <option value="text/html">HTML</option>
                      </select>
                      <textarea 
                        className="w-full p-3 border border-gray-300 rounded font-mono text-sm h-40"
                        value={bodyContent}
                        onChange={(e) => setBodyContent(e.target.value)}
                        placeholder={contentType === 'application/json' ? '{\n  "key": "value"\n}' : ''}
                      />
                    </div>
                  )}
                  
                  {bodyType === 'form-data' && (
                    <div className="border border-gray-300 rounded p-4">
                      <p className="text-gray-500 mb-2 text-sm">Form data fields go here</p>
                      {/* Form data fields would go here */}
                    </div>
                  )}
                  
                  {bodyType === 'x-form' && (
                    <div className="border border-gray-300 rounded p-4">
                      <p className="text-gray-500 mb-2 text-sm">URL encoded form fields go here</p>
                      {/* URL encoded form fields would go here */}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'Auth' && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Authentication Type</label>
                  <select 
                    className="w-full p-2 border border-gray-300 rounded text-sm"
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                  >
                    <option value="none">No Auth</option>
                    <option value="basic">Basic Auth</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="oauth2">OAuth 2.0</option>
                    <option value="apikey">API Key</option>
                  </select>
                </div>
                
                {authType === 'basic' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                      <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                      <input type="password" className="w-full p-2 border border-gray-300 rounded text-sm" />
                    </div>
                  </div>
                )}
                
                {authType === 'bearer' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Token</label>
                    <input type="text" className="w-full p-2 border border-gray-300 rounded text-sm" />
                  </div>
                )}
                
                {/* Other auth types would go here */}
              </div>
            )}
          </div>
          
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium">Response</h3>
              <div className="flex items-center">
                <span className={`font-bold mr-1 ${
                  responseStatus >= 200 && responseStatus < 300 ? 'text-green-600' : 
                  responseStatus >= 400 ? 'text-red-600' : 'text-yellow-600'
                }`}>{responseStatus}</span>
                <span className="text-sm mr-4">{responseStatusText}</span>
                <span className="text-xs text-gray-500">{responseTime} ms</span>
              </div>
            </div>
            
            <div className="flex border-b border-gray-200 bg-gray-50">
              {['Body', 'Headers'].map(tab => (
                <button 
                  key={tab}
                  className={`px-4 py-2 text-sm font-medium ${
                    activeResponseTab === tab 
                      ? 'text-orange-500 border-b-2 border-orange-500' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                  onClick={() => setActiveResponseTab(tab)}
                >
                  {tab}
                </button>
              ))}
              
              {/* View type selector - only show for body tab */}
              {activeResponseTab === 'Body' && isHtmlResponse() && (
                <div className="ml-auto mr-4 flex items-center">
                  <button 
                    className={`px-3 py-1 text-xs ${responseViewType === 'raw' ? 'bg-gray-200' : 'bg-white'} border border-gray-300 rounded-l`}
                    onClick={() => setResponseViewType('raw')}
                  >
                    Raw
                  </button>
                  <button 
                    className={`px-3 py-1 text-xs ${responseViewType === 'preview' ? 'bg-gray-200' : 'bg-white'} border-t border-b border-r border-gray-300 rounded-r`}
                    onClick={() => setResponseViewType('preview')}
                  >
                    Preview
                  </button>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-auto bg-gray-50 font-mono text-sm">
              {activeResponseTab === 'Body' && (
                <>
                  {isHtmlResponse() && responseViewType === 'preview' ? (
                    <div className="p-4 bg-white h-full">
                      <iframe 
                        srcDoc={responseBody}
                        className="w-full h-full border-0" 
                        title="HTML Response Preview"
                      />
                    </div>
                  ) : (
                    <pre className="p-4 whitespace-pre-wrap">
                      {responseBody}
                    </pre>
                  )}
                </>
              )}
              
              {activeResponseTab === 'Headers' && (
                <pre className="p-4 whitespace-pre-wrap">
                  {responseHeaders}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;