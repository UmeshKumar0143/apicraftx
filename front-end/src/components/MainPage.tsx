import React, { useState, useEffect } from 'react';
import { BACKEND_URL } from '../utils/utils';
import { useNavigate } from 'react-router-dom';

function MainPage() {
  const [activeTab, setActiveTab] = useState('Params');
  const [activeResponseTab, setActiveResponseTab] = useState('Body');
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseStatusText, setResponseStatusText] = useState('');
  const [responseTime, setResponseTime] = useState('');
  const [responseBody, setResponseBody] = useState('');
  const [responseHeaders, setResponseHeaders] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [params, setParams] = useState([{ key: '', value: '', description: '' }]);
  const [headers, setHeaders] = useState([{ key: '', value: '', description: '' }]);
  const [bodyContent, setBodyContent] = useState('');
  const [bodyType, setBodyType] = useState('raw');
  const [bodyParams, setBodyParams] = useState([{ key: '', value: '' }]);
  const [authType, setAuthType] = useState('none');
  const [contentType, setContentType] = useState('application/json');
  const [bearerToken, setBearerToken] = useState('');
  const [basicUsername, setBasicUsername] = useState('');
  const [basicPassword, setBasicPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [responseViewType, setResponseViewType] = useState('raw');

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
    }
  }, [navigate]);

  useEffect(() => {
    fetchHistory();
  }, [responseBody]);

  const fetchHistory = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const historyData = await response.json();
        setHistory(historyData);
      } else {
        console.error('Failed to fetch history:', response.statusText);
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      }
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/history/${id}`, {
        method: 'GET',
        headers: {
          token: token,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        fetchHistory();
      } else {
        console.error('Failed to delete history item:', response.statusText);
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      }
    } catch (error) {
      console.error('Error deleting history item:', error);
    }
  };

  const sendRequest = async () => {
    const token = localStorage.getItem('token');
    const requestHeaders: { [key: string]: string } = {};
    headers.forEach((header) => {
      if (header.key && header.value) {
        requestHeaders[header.key] = header.value;
      }
    });

    if (authType === 'bearer' && bearerToken) {
      requestHeaders['Authorization'] = `Bearer ${bearerToken}`;
    } else if (authType === 'basic' && basicUsername && basicPassword) {
      requestHeaders['Authorization'] = `Basic ${btoa(`${basicUsername}:${basicPassword}`)}`;
    }

    let finalUrl = url;
    if (params.some((p) => p.key && p.value)) {
      const queryParams = new URLSearchParams();
      params.forEach((param) => {
        if (param.key && param.value) {
          queryParams.append(param.key, param.value);
        }
      });
      finalUrl = `${url}${url.includes('?') ? '&' : '?'}${queryParams.toString()}`;
    }

    let requestBody;
    if (method !== 'GET' && method !== 'DELETE') {
      if (bodyType === 'raw' && bodyContent) {
        try {
          if (contentType === 'application/json') {
            requestBody = JSON.parse(bodyContent);
          } else {
            requestBody = bodyContent;
          }
        } catch (error) {
          requestBody = bodyContent;
        }
      } else if (bodyType === 'form-data' || bodyType === 'x-www-form-urlencoded') {
        requestBody = bodyParams.reduce((acc, p) => (p.key ? { ...acc, [p.key]: p.value } : acc), {});
      }
    }

    setIsLoading(true);
    const startTime = Date.now();

    try {
      const response = await fetch(`${BACKEND_URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...requestHeaders,
        },
        body: JSON.stringify({
          method,
          url: finalUrl,
          headers: requestHeaders,
          body: requestBody,
        }),
      });

      const data = await response.json();
      console.log('API Response:', data); 

      const endTime = Date.now();

      if (response.ok) {
        setResponseStatus(data.status || response.status);
        setResponseStatusText(data.statusText || response.statusText);
        setResponseTime((endTime - startTime).toString());
        setResponseBody(data.body || '');
        setResponseHeaders('');
        fetchHistory();
      } else {
        setResponseStatus(response.status);
        setResponseStatusText(response.statusText);
        setResponseTime((endTime - startTime).toString());
        setResponseBody(JSON.stringify(data, null, 2));
        setResponseHeaders('');
        if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/signin');
        }
      }
    } catch (error) {
      console.error('Error executing request:', error);
      setResponseStatus(0);
      setResponseStatusText('Error');
      setResponseBody(JSON.stringify({ error: 'Network error occurred' }, null, 2));
      setResponseHeaders('');
    } finally {
      setIsLoading(false);
    }
  };

  const isHtmlResponse = () => {
    return (
      responseHeaders.toLowerCase().includes('content-type: text/html') ||
      responseHeaders.toLowerCase().includes('content-type: application/xhtml+xml')
    );
  };

  const addRow = (type: string) => {
    if (type === 'params') {
      setParams([...params, { key: '', value: '', description: '' }]);
    } else if (type === 'headers') {
      setHeaders([...headers, { key: '', value: '', description: '' }]);
    } else if (type === 'bodyParams') {
      setBodyParams([...bodyParams, { key: '', value: '' }]);
    }
  };

  const updateRow = (type: string, index: number, field: string, value: string) => {
    if (type === 'params') {
      const newParams = [...params];
      newParams[index][field] = value;
      setParams(newParams);
    } else if (type === 'headers') {
      const newHeaders = [...headers];
      newHeaders[index][field] = value;
      setHeaders(newHeaders);
    } else if (type === 'bodyParams') {
      const newBodyParams = [...bodyParams];
      newBodyParams[index][field] = value;
      setBodyParams(newBodyParams);
    }
  };

  const loadFromHistory = (historyItem: any) => {
    setMethod(historyItem.method);
    setUrl(historyItem.url);

    if (historyItem.headers) {
      const headersArray = Object.entries(historyItem.headers).map(([key, value]) => ({
        key,
        value,
        description: '',
      }));
      headersArray.push({ key: '', value: '', description: '' });
      setHeaders(headersArray);
    }

    if (historyItem.body) {
      setBodyType('raw');
      setContentType('application/json');
      setBodyContent(JSON.stringify(historyItem.body, null, 2));
    }
  };

  const filteredHistory = history.filter(
    (item) =>
      item.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.method.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/signin');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="flex items-center w-full justify-between px-20 py-3 bg-white shadow">
        <div className="flex items-center text-lg font-bold text-orange-500 mr-5">
          <span>API Craft</span>
        </div>
        <div className="flex-grow max-w-xl">
          <input
            type="text"
            placeholder="Search APIs..."
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel */}
        <div className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-t border-gray-100">
            <h3 className="font-medium">History</h3>
          </div>

          <div className="py-2">
            {filteredHistory.map((item, index) => (
              <div
                key={index}
                className="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer"
                onClick={() => loadFromHistory(item)}
              >
                <span
                  className={`px-2 py-1 ${
                    item.method === 'GET'
                      ? 'bg-green-50 text-green-700'
                      : item.method === 'POST'
                      ? 'bg-orange-50 text-orange-700'
                      : item.method === 'PUT'
                      ? 'bg-blue-50 text-blue-700'
                      : item.method === 'DELETE'
                      ? 'bg-red-50 text-red-700'
                      : 'bg-gray-50 text-gray-700'
                  } text-xs font-bold rounded mr-2 w-12 text-center`}
                >
                  {item.method}
                </span>
                <span className="text-xs text-gray-600 overflow-hidden text-ellipsis flex-1">
                  {item.url}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item._id);
                  }}
                  className="text-sm bg-red-500 text-white font-bold p-[6px] border rounded-lg hover:cursor-pointer"
                >
                  Delete
                </button>
              </div>
            ))}
            {filteredHistory.length === 0 && (
              <div className="px-4 py-3 text-sm text-gray-500">No request history found.</div>
            )}
          </div>
        </div>

        {/* Right Panel */}
        <div className="flex-1 flex flex-col overflow-hidden bg-white">
          <div className="flex p-4 border-b border-gray-200 items-center">
            <div className="flex mr-2">
              <select
                className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium rounded-l"
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
              className={`px-5 py-2 mr-2 ${
                isLoading ? 'bg-gray-400' : 'bg-orange-500 hover:bg-orange-600'
              } text-white rounded font-medium transition-colors`}
              onClick={sendRequest}
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </div>

          <div className="flex border-b border-gray-200">
            {['Params', 'Headers', 'Body', 'Auth'].map((tab) => (
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
                    aria-label="Add parameter"
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
                    aria-label="Add header"
                  >
                    <i className="fa fa-plus mr-1"></i> Add Header
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'Body' && (
              <div>
                <div className="flex items-center mb-4">
                  <select
                    className="px-3 py-2 bg-white border border-gray-300 text-sm rounded mr-2"
                    value={bodyType}
                    onChange={(e) => setBodyType(e.target.value)}
                  >
                    <option value="raw">Raw</option>
                    <option value="form-data">Form Data</option>
                    <option value="x-www-form-urlencoded">x-www-form-urlencoded</option>
                  </select>
                  {bodyType === 'raw' && (
                    <select
                      className="px-3 py-2 bg-white border border-gray-300 text-sm rounded"
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                    >
                      <option value="application/json">application/json</option>
                      <option value="text/plain">text/plain</option>
                      <option value="text/html">text/html</option>
                      <option value="application/xml">application/xml</option>
                    </select>
                  )}
                </div>
                {bodyType === 'raw' && (
                  <textarea
                    className="w-full h-48 p-3 border border-gray-300 rounded text-sm font-mono"
                    placeholder="Enter request body..."
                    value={bodyContent}
                    onChange={(e) => setBodyContent(e.target.value)}
                  />
                )}
                {bodyType === 'form-data' && (
                  <div>
                    {bodyParams.map((param, index) => (
                      <div key={index} className="flex py-2 border-b border-gray-100">
                        <div className="flex-1 px-2">
                          <input
                            type="text"
                            placeholder="Key"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            value={param.key}
                            onChange={(e) => updateRow('bodyParams', index, 'key', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 px-2">
                          <input
                            type="text"
                            placeholder="Value"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            value={param.value}
                            onChange={(e) => updateRow('bodyParams', index, 'value', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="py-3">
                      <button
                        className="text-gray-500 hover:text-orange-500 text-sm"
                        onClick={() => addRow('bodyParams')}
                        aria-label="Add form field"
                      >
                        <i className="fa fa-plus mr-1"></i> Add Form Field
                      </button>
                    </div>
                  </div>
                )}
                {bodyType === 'x-www-form-urlencoded' && (
                  <div>
                    {bodyParams.map((param, index) => (
                      <div key={index} className="flex py-2 border-b border-gray-100">
                        <div className="flex-1 px-2">
                          <input
                            type="text"
                            placeholder="Key"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            value={param.key}
                            onChange={(e) => updateRow('bodyParams', index, 'key', e.target.value)}
                          />
                        </div>
                        <div className="flex-1 px-2">
                          <input
                            type="text"
                            placeholder="Value"
                            className="w-full p-2 border border-gray-300 rounded text-sm"
                            value={param.value}
                            onChange={(e) => updateRow('bodyParams', index, 'value', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                    <div className="py-3">
                      <button
                        className="text-gray-500 hover:text-orange-500 text-sm"
                        onClick={() => addRow('bodyParams')}
                        aria-label="Add URL-encoded field"
                      >
                        <i className="fa fa-plus mr-1"></i> Add URL-Encoded Field
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'Auth' && (
              <div>
                <select
                  className="px-3 py-2 bg-white border border-gray-300 text-sm rounded mb-4"
                  value={authType}
                  onChange={(e) => setAuthType(e.target.value)}
                >
                  <option value="none">No Auth</option>
                  <option value="bearer">Bearer Token</option>
                  <option value="basic">Basic Auth</option>
                </select>
                {authType === 'bearer' && (
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Bearer Token</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                      placeholder="Enter token"
                      value={bearerToken}
                      onChange={(e) => setBearerToken(e.target.value)}
                    />
                  </div>
                )}
                {authType === 'basic' && (
                  <div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Enter username"
                        value={basicUsername}
                        onChange={(e) => setBasicUsername(e.target.value)}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                      <input
                        type="password"
                        className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                        placeholder="Enter password"
                        value={basicPassword}
                        onChange={(e) => setBasicPassword(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Response Section */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex">
                {['Body', 'Headers'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-5 py-2 text-sm font-medium ${
                      activeResponseTab === tab
                        ? 'text-orange-500 border-b-2 border-orange-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveResponseTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {responseStatus && (
                <div className="flex items-center text-sm">
                  <span
                    className={`mr-2 ${
                      responseStatus >= 200 && responseStatus < 300
                        ? 'text-green-600'
                        : responseStatus >= 400
                        ? 'text-red-600'
                        : 'text-gray-600'
                    }`}
                  >
                    {responseStatus} {responseStatusText}
                  </span>
                  <span className="text-gray-500">| {responseTime} ms</span>
                </div>
              )}
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {activeResponseTab === 'Body' && (
                <div>
                  {responseBody ? (
                    <div>
                      <div className="flex mb-2">
                        <select
                          className="px-3 py-1 bg-white border border-gray-300 text-sm rounded"
                          value={responseViewType}
                          onChange={(e) => setResponseViewType(e.target.value)}
                        >
                          <option value="raw">Raw</option>
                          {isHtmlResponse() && <option value="preview">Preview</option>}
                        </select>
                      </div>
                      {responseViewType === 'raw' ? (
                        <pre className="bg-gray-50 p-3 rounded text-sm font-mono overflow-auto">
                          {responseBody}
                        </pre>
                      ) : (
                        <iframe
                          className="w-full h-96 border border-gray-300 rounded"
                          srcDoc={responseBody}
                          title="Response Preview"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No response yet. Send a request to see the response.
                    </div>
                  )}
                </div>
              )}
              {activeResponseTab === 'Headers' && (
                <div>
                  {responseHeaders ? (
                    <pre className="bg-gray-50 p-3 rounded text-sm font-mono">{responseHeaders}</pre>
                  ) : (
                    <div className="text-gray-500 text-sm">
                      No headers yet. Send a request to see the headers.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;