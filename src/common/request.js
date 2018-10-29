function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function checkJson(json) {
  if ('1' === json.status) {
    const error = new Error((json.errorMessages && json.errorMessages[0]) || 'Unknown Error');
    throw error;
  } else if (-1 === json.result) {
    const error = new Error((json.exceptions && json.exceptions[0]) || 'Unknown Error');
    throw error;
  } else if (0 === json.result) {
    const error = new Error((json.messages && json.messages[0].message) || 'Unknown Error');
    throw error;
  }
  return json;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} params  The post params, only support post now
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, params = null) {
  if (params) {
    let options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-ebao-tenant-id': sessionStorage.getItem('SALES_APP_TENANT_CODE') || 'eBao',
        'X-ebao-bff-tenantCode': sessionStorage.getItem('SALES_APP_TENANT_CODE') || 'eBao',
      },
      body: JSON.stringify(params),
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkJson)
  } else {
    let options = {
      headers: {
        'X-ebao-tenant-id': sessionStorage.getItem('SALES_APP_TENANT_CODE') || 'eBao',
        'X-ebao-bff-tenantCode': sessionStorage.getItem('SALES_APP_TENANT_CODE') || 'eBao',
      }
    }
    return fetch(url, options)
      .then(checkStatus)
      .then(parseJSON)
      .then(checkJson)
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} options   The fetch options
 * @return {object}           An object containing either "data" or "err"
 */
export function requestRaw(url, options = null) {
  return  fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(checkJson)
}
