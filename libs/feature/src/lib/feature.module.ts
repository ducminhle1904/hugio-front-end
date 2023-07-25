import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDialogComponent } from './remotes/product/product-dialog/product-dialog.component';
import { ProductService } from '@ims/data-access';

@NgModule({
  imports: [CommonModule, ProductDialogComponent],
  providers: [ProductService],
})
export class FeatureModule {}
