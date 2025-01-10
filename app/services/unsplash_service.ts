import axios, { AxiosInstance } from 'axios'
import env from '#start/env'
import { inject } from '@adonisjs/core'

export type IUnsplashPhoto = {
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
    small_s3: string
  }
}

@inject()
export class UnsplashService {
  #FOOD_AND_DRINK_TOPIC_ID = 'xjPR4hlkBGA'
  #axiosClient: AxiosInstance

  constructor() {
    this.#axiosClient = axios.create({
      baseURL: 'https://api.unsplash.com',
      headers: {
        Authorization: `Client-ID ${env.get('UNSPLASH_ACCESS_KEY')}`,
      },
    })
  }

  async getRandomPhoto(): Promise<IUnsplashPhoto> {
    const response = await this.#axiosClient.get('/photos/random', {
      params: {
        topics: this.#FOOD_AND_DRINK_TOPIC_ID,
      },
    })
    return response.data
  }
}
