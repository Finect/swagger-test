'use strict';

class Events {
  static getTests (contentType, status, raw) {
    return {
      listen: 'test',
      script: {
        type: 'text/javascript',
        exec: (status.toString() !== '204' ? `tests['The Content-Type should be ${contentType}'] = 
postman.getResponseHeader('Content-Type') && 
postman.getResponseHeader('Content-Type').includes('${contentType}');
` : '') + `tests['Status code should be ${status}'] = pm.response.code === ${status}; ` + 
(status.toString() === '204' ? 'tests["Body is empty"] = (responseBody===null || responseBody.length===0);' : '') + `
` + (raw || '')
      }
    };
  }
}

module.exports = Events;
