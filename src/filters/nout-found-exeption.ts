import { ArgumentsHost, Catch, ExceptionFilter, HttpException, NotFoundException } from "@nestjs/common";
import { Response } from "express";

@Catch(NotFoundException)
export class NoutFoundExceptionFilter implements ExceptionFilter {

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const status = exception.getStatus()

        const message =
            // exception.message ?? "Unknown error";
            exception.message.split(" /", 2)[0] === "Cannot GET" ||
                exception.message.split(" /", 2)[0] === "Cannot POST" ||
                exception.message.split(" /", 2)[0] === "Cannot PATCH" ||
                exception.message.split(" /", 2)[0] === "Cannot DELETE"
                ? `Noto'g'ri marshrut`
                : exception.message

        response.status(status).send({
            message,
            statusCode: status
        })
    }
}