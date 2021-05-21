import axios from 'axios';
import adapter from "axios/lib/adapters/http";
import { Product } from './product';

axios.defaults.adapter = adapter;

export class API {
  constructor(url) {
    if (url === undefined || url === "") {
      url = 'http://localhost:8080';
    }
    if (url.endsWith("/")) {
      url = url.substr(0, url.length - 1)
    }
    this.url = url
  }

  withPath(path) {
    if (!path.startsWith("/")) {
      path = "/" + path
    }
    return `${this.url}${path}`
  }

  generateAuthToken() {
    return "Bearer " + new Date().toISOString()
  }

  async getAllProducts() {
    return axios.get(this.withPath("/products"), {
      headers: {
        "Authorization": this.generateAuthToken()
      }
    })
    .then(r => r.data.map(p => new Product(p)));
  }

  async getProduct(id) {
    return axios.get(this.withPath("/product/" + id), {
      headers: {
        "Authorization": this.generateAuthToken()
      }
    })
    .then(r => new Product(r.data));
  }

  async getProductsName() {
    return axios.get(this.withPath("/products/name"), {
      headers: {
        "Authorization": this.generateAuthToken()
      }
    })
        .then(r => r.data.map(p => new Product(p)));
  }
}

export default new API(process.env.REACT_APP_API_BASE_URL);