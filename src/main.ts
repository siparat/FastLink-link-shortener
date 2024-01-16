import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app
		.setViewEngine('hbs')
		.useStaticAssets(join(process.cwd(), './src/', './templates/', './public'))
		.setBaseViewsDir(join(process.cwd(), './src/', './templates'))
		.enableCors();
	await app.listen(3000);
}
bootstrap();
