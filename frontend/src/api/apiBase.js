import axios from 'axios'

import { env } from '@/env'

const basesUrl = {
  core: env.VITE_CORE_URL,
}

export class Api {
  constructor(baseURL, config) {
    this.axios = axios.create({
      baseURL: basesUrl[baseURL],
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      ...config,
    })
  }
}

export const newApi = new Api(basesUrl.core)
