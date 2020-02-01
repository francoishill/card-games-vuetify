import axios from 'axios'
import config from '../config'

const baseURL = config.ApiBaseUrl

export default axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});