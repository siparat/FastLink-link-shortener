import { HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TestingModule, Test } from '@nestjs/testing';
import { hash } from 'bcrypt';
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
		await database.user.create({
			data: {
				...mockUserRegisterDto,
				password: await hash(mockUserRegisterDto.password, Number(new ConfigService().get('SALT')))
			}
		});
	});

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [AppModule]
		}).compile();
		app = moduleRef.createNestApplication();
		app.setBaseViewsDir(join(process.cwd(), './src/', './templates')).setViewEngine('hbs');
		server = app.getHttpServer();
		await app.init();

		token = (await request(server).post('/auth/login').send(mockUserRegisterDto)).body.accessToken;
	});

	describe('/create (POST)', () => {
		it('No url (fail)', async () => {
			const res = await request(server)
				.post('/create')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.NO_URL);
		});

		it('Bad url (fail)', async () => {
			const res = await request(server)
				.post('/create?url=mock')
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_URL);
		});

		it('Bad case type (fail)', async () => {
			const res = await request(server)
				.post(`/create?url=${mockUrl}&case=uper`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.BAD_REQUEST);
			expect(res.body.message).toEqual(LinkErrorMessages.BAD_CASE_TYPE);
		});

		it('Unauthorized (fail)', () => {
			return request(server).post(`/create?url=${mockUrl}`).expect(HttpStatus.UNAUTHORIZED);
		});

		it('Created (success)', async () => {
			const res = await request(server)
				.post(`/create?url=${mockUrl}`)
				.set('Authorization', 'Bearer ' + token)
				.expect(HttpStatus.CREATED);
			path = res.body.path;
		});
	});

	describe('/:path (GET)', () => {
		it('Not found', async () => {
			const res = await request(server).get('/mock').expect(HttpStatus.OK);
			expect(res.text).toContain(LinkErrorMessages.NOT_FOUND_BY_PATH);
		});

		it('Received (success)', async () => {
			const res = await request(server).get(`/${path}`);
			expect(res.type).toEqual('text/html');
		});
	});

	afterAll(async () => {
		await database.user.delete({ where: { email: mockUserRegisterDto.email } });
		await database.$disconnect();
	});
});
