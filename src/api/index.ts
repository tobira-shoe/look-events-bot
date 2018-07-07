import axios, { AxiosInstance } from 'axios'
import config from '../config'

export type Event = {
    id: number
    title: string
    description: string
    image: string
    link: string
    price: string
    places: string[]
    topics: string[]
    time: { dates: string[]; raw: string }
}

class EventsAPI {
    url: string
    doRequest: AxiosInstance

    constructor() {
        this.url = 'events'
        this.doRequest = axios.create({ baseURL: config.LOOK_EVENT_API })
    }

    get(id: number | string): Promise<Event> {
        return this.doRequest({
            method: 'get',
            url: `${this.url}/${Number(id)}`,
        }).then(res => res.data)
    }

    getList(params = {}): Promise<Event[]> {
        return this.doRequest({
            method: 'get',
            url: `${this.url}/`,
            params,
        }).then(res => res.data)
    }

    getListCount(): Promise<{ count: number }> {
        return this.doRequest({
            method: 'get',
            url: `${this.url}/count`,
        }).then(res => res.data)
    }
}

export default new EventsAPI()
