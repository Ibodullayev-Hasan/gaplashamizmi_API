// import { CacheInterceptor } from "@nestjs/cache-manager";
// import { ExecutionContext, Injectable, CallHandler, HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { tap } from "rxjs/operators";

// @Injectable()
// export class CustomCacheInterceptor extends CacheInterceptor {
// 	trackBy(context: ExecutionContext): string | undefined {
// 		return super.trackBy(context);
// 	}

// 	async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
// 		return next.handle().pipe(
// 			tap((data) => {
// 				if (data === null || data === undefined) {
// 					try {
// 						throw new NotFoundException("CacheInterceptor: Foydalanuvchi topilmadi!")
// 					} catch (error: any) {
// 						throw error instanceof HttpException
// 							? error
// 							: new HttpException(error.message, HttpStatus.BAD_REQUEST)
// 					}
// 				}
// 			})
// 		);
// 	}
// }
