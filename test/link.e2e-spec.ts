import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModule, Test } from '@nestjs/testing';
import { Server } from 'http';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { LinkErrorMessages } from 'src/link/link.constants';
import * as request from 'supertest';

const mockUrl = 'https://kinmov.ru';

describe('Link (e2e)', () => {
	let app: NestExpressApplication;
	let server: Server;
	let path: string;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		app.setBaseViewsDir(join(process.cwd(), './src/', './templates'));
		app.setViewEngine('hbs');
		server = app.getHttpServer();
		await app.init();
	});

	describe('/link/create (POST)', () => {
		it('No url (fail)', async () => {
			const res = await request(server).post('/link/create').expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.NO_URL);
		});

		it('Bad url (fail)', async () => {
			const res = await request(server).post('/link/create?url=mock').expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_URL);
		});

		it('Bad case type (fail)', async () => {
			const res = await request(server).post(`/link/create?url=${mockUrl}&case=uper`).expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_CASE_TYPE);
		});

		it('Created (success)', async () => {
			const res = await request(server).post(`/link/create?url=${mockUrl}`).expect(HttpStatus.CREATED);
			path = res.body.path;
		});
	});

	describe('/link/:path (GET)', () => {
		it('Not found', async () => {
			const res = await request(server).get('/link/mock').expect(HttpStatus.NOT_FOUND);
			expect(res.body.message).toEqual(LinkErrorMessages.NOT_FOUND_BY_PATH);
		});

		it('Received (success)', async () => {
			const res = await request(server).get(`/link/${path}`).expect(HttpStatus.OK);
			expect(res.type).toEqual('text/html');
		});
	});
});
