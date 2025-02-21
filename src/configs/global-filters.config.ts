import { INestApplication } from "@nestjs/common";
import { HttpExceptionFilter } from "src/common/filters/http-exception.filter";

export function setUpGlobalFilter(app: INestApplication) {
	app.useGlobalFilters(new HttpExceptionFilter())

}