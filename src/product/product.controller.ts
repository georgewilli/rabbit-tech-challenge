import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductFilters } from './dto/get-all-products.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productsService: ProductService) {}

  @Get('top-ten-products')
  async getTopTenProductsInRegion(@Query('area') area?: string) {
    return await this.productsService.getTopTenProductsInRegion(area);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    return this.productsService.getProductById(+id);
  }

  @Get()
  async getAllProducts(@Query() filters: ProductFilters) {
    return this.productsService.getAllProducts(filters);
  }
}
