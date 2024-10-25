import axios from 'axios'

const basesUrl = {
  core: import.meta.env.VITE_CORE_URL,
}

export class Api {
  constructor(baseURL, config) {
    this.axios = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...config,
    })
  }
}

export const apiBase = new Api(basesUrl.core)
