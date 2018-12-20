import config from '../config'

class Client {
  constructor() {
    this.apiUrl = config.API_URL
  }

  async get(url, data) {
    return this.sendRequest('GET', url, data)
  }

  async post(url, data) {
    return this.sendRequest('POST', url, { body: data })
  }

  async put(url, data) {
    return this.sendRequest('PUT', url, { body: data })
  }

  async delete(url, data) {
    return this.sendRequest('DELETE', url, { body: data })
  }

  async sendRequest(method, url, httpOptions = {}) {
    httpOptions.method = method
    httpOptions.credentials = 'include'
    httpOptions.headers = httpOptions.headers || {}
    httpOptions.headers['Content-Type'] = 'application/json'

    if (httpOptions.body && Object.keys(httpOptions.body)) {
      httpOptions.body = JSON.stringify(httpOptions.body)
    }

    const response = await fetch(this.apiUrl + url, httpOptions)

    try {
      response.content = await response.json()
    } catch (ex) {
      // No content, whatever
    }

    return response
  }
}

const client = new Client()
export default client
