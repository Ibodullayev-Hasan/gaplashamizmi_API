import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export function setUpswagger(app: INestApplication) {
	const options = new DocumentBuilder()
		.setTitle(`GAPLASHAMIZ 😉`)
		.setDescription(`Bu "GAPLASHAMIZ 😉" loyihasi uchun API dokumenti`)
		.setVersion('1.0')
		.build()

	const dokument = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api/docs/gaplashamiz', app, dokument)
}