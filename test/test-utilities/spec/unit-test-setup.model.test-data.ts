import { Controller, Get, Injectable } from '@nestjs/common';

// tslint:disable:max-classes-per-file

@Injectable()
export class WeatherBalloon {
    public elevation = 9000;
    public takeMeasurements(): void {}
}

@Injectable()
export class WeatherStation {
    constructor(balloon: WeatherBalloon) {
        balloon.takeMeasurements();
    }

    public getForecast(): string {
        return 'rainy';
    }
}

@Controller('weather')
export class WeatherController {
    private forecast: string;

    constructor(public station: WeatherStation) {
        this.forecast = station.getForecast();
    }

    @Get() public getForecast(): string {
        return this.forecast;
    }
}
