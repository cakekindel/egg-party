import { Controller, Get } from '@nestjs/common';

/**
 * Health check route which conforms to
 * Health Check Response Format for APIs
 *
 * https://tools.ietf.org/id/draft-inadarei-api-health-check-01.html
 */
@Controller('health')
export class HealthCheckController
{
    @Get()
    public getHealth(): { status: string }
    {
        return { status: 'test' };
    }
}
