import { NotFoundException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export function notFoundMiddleware(req: Request, res: Response, next: NextFunction) {
	next(new NotFoundException(`A route that does not exist`))
}