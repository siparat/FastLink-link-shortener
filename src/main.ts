import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
	const app = await NestFactory.create<NestExpressApplication>(AppModule);
	app
		.use(cookieParser())
		.setViewEngine('hbs')
		.useStaticAssets(join(process.cwd(), './src/', './templates/', './public'))
		.setBaseViewsDir(join(process.cwd(), './src/', './templates'))
		.enableCors({ credentials: true });
	await app.listen(3000);
}
bootstrap();
