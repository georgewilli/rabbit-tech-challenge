import { Injectable } from "@nestjs/common";
import { ProductRepository } from "./product.repository";
import { PrismaService } from "src/prisma/prisma.service";
import { ProductFilters } from "./dto/get-all-products.dto";
import { ProductDTO } from "./dto/product.dto";

@Injectable()
export class ProductService {
  constructor(
    private readonly productsRepository: ProductRepository,
    private prismaService: PrismaService,
  ) {}

  async getAllProducts(filters: ProductFilters): Promise<ProductDTO[]> {
    const {
      categories,
      areas,
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      page = 1,
      pageSize = 20,
    } = filters;

  
    const query: any = {
      skip: (page - 1) * pageSize, 
      take: pageSize, 
      orderBy: {
        [sortBy]: sortOrder, 
      },
      where: {
        ...(categories && { category: { in: categories } }),
        ...(areas && { area: { in: areas } }),
      },
      select: {
        id: true,
        name: true,
        category: true,
        area: true,
        createdAt: true,
        orders: {
          select: {
            id: true, 
          },
        },
      },
    };
    const products = await this.prismaService.product.findMany(query);

    return products;
  }

  async getProductById(id: number): Promise<ProductDTO> {
    return this.productsRepository.findById(id);
  }
  async getTopTenProductsInRegion(area?: string): Promise<ProductDTO[]> {
    return this.productsRepository.getTopTenProductsInRegion(area);
  }
}
