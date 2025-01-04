-- CreateIndex
CREATE INDEX `Product_area_idx` ON `Product`(`area`);

-- RenameIndex
ALTER TABLE `OrderItem` RENAME INDEX `OrderItem_productId_fkey` TO `OrderItem_productId_idx`;
