// calculate-total-price.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '@ims/core';

@Pipe({
  name: 'calculateTotalPrice',
  standalone: true,
  pure: false,
})
export class CalculateTotalPricePipe implements PipeTransform {
  transform(products: Product[]): number {
    return products.reduce(
      (total, product) => total + product.product_quantity * product.price,
      0
    );
  }
}
