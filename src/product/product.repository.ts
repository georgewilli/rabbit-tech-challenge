import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async findById(id: number): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async create(data: CreateProductDto): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  async getTopTenProductsInRegion(area?: string) {
    const getTopTenQuery = Prisma.sql`SELECT 
    p.id,
    p.name,
    p.category,
    IFNULL(SUM(oi.quantity), 0) AS product_count
    FROM 
    Product AS p
    JOIN 
    OrderItem AS oi ON p.id = oi.productId
    ${area ? Prisma.sql`WHERE p.area = ${area}` : Prisma.empty}
    GROUP BY 
    p.id, p.name, p.area, p.category
    ORDER BY 
    product_count DESC
    LIMIT 10;
  `;
    return await this.prisma.$queryRaw<Product[]>(getTopTenQuery, area);
  }
}
