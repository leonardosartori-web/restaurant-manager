import {Product} from "./Product";

interface ExtendedProduct extends Product {
  product_id: string,
  status: string,
  operator: string
}

export interface Order {
  _id: string,
  table: number,
  waiter: string,
  productionTime: Date,
  products: ExtendedProduct[]
}
