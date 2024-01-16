import { HttpStatus } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModule, Test } from '@nestjs/testing';
import { Server } from 'http';
import { join } from 'path';
import { AppModule } from 'src/app.module';
import { AuthRegisterDto } from 'src/auth/dto/auth-register.dto';
import { DatabaseService } from 'src/database/database.service';
import { LinkErrorMessages } from 'src/link/link.constants';
import * as request from 'supertest';

const mockUrl = 'https://kinmov.ru';

const mockUserRegisterDto: AuthRegisterDto = { email: 'mock@email.ru', nickname: 'mock', password: '11223344' };

describe('Link (e2e)', () => {
	let app: NestExpressApplication;
	let server: Server;
	let path: string;
	let database: DatabaseService;
	let token: string;

	beforeAll(async () => {
		database = new DatabaseService();
		await database.$connect();
	});

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		app.setBaseViewsDir(join(process.cwd(), './src/', './templates')).setViewEngine('hbs');
		server = app.getHttpServer();
		await app.init();

		token = (await request(server).post('/auth/register').send(mockUserRegisterDto)).body.accessToken;
	});

	describe('/link/create (POST)', () => {
		it('No url (fail)', async () => {
			const res = await request(server)
				.post('/link/create')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.NO_URL);
		});

		it('Bad url (fail)', async () => {
			const res = await request(server)
				.post('/link/create?url=mock')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_URL);
		});

		it('Bad case type (fail)', async () => {
			const res = await request(server)
				.post(`/link/create?url=${mockUrl}&case=uper`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_CASE_TYPE);
		});

		it('Unauthorized (fail)', () => {
			return request(server).post(`/link/create?url=${mockUrl}`).expect(HttpStatus.UNAUTHORIZED);
		});

		it('Created (success)', async () => {
			const res = await request(server)
				.post(`/link/create?url=${mockUrl}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.CREATED);
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

	afterEach(async () => {
		await database.user.delete({ where: { email: mockUserRegisterDto.email } });
	});

	afterAll(async () => {
		await database.$disconnect();
	});
});
