import {
    Controller,
    Get,
    Post,
    Delete,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import { PromotionsService } from './promotions.service';
import { GetPromotionsQueryDto } from './dto/get-promotions-query.dto';
import { FakeAuthGuard } from '../common/guards/fake-auth.guard';

@Controller('promotions')
@UseGuards(FakeAuthGuard)
export class PromotionsController {
    constructor(private readonly promotionsService: PromotionsService) { }

    @Get()
    async listPromotions(@Req() req, @Query() query: GetPromotionsQueryDto) {
        const userId = req.user.id;
        return this.promotionsService.getPromotions(userId, query);
    }


    @Post(':id/favorite')
    async favorite(@Req() req, @Param('id') promotionId: string) {
        const userId = req.user.id;
        return this.promotionsService.favoritePromotion(userId, promotionId);
    }

    @Delete(':id/favorite')
    async unFavorite(@Req() req, @Param('id') promotionId: string) {
        const userId = req.user.id;
        return this.promotionsService.unFavoritePromotion(userId, promotionId);
    }



    @Get('favorites')
    async listFavorites(@Req() req) {
        const userId = req.user.id;
        return this.promotionsService.getFavorites(userId);
    }


    @Get(':id')
    async getOne(@Req() req, @Param('id') id: string) {
        const userId = req.user.id;
        return this.promotionsService.getPromotion(userId, id);
    }

}
