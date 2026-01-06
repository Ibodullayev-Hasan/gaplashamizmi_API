import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ChatService } from "./chat.service";
import { Request, Response } from "express";
import { AuthGuard } from "../../common/guards/jwt-auth.guard";

@Controller("chat")
export class ChatController {
	constructor(private readonly chatService: ChatService) { }

	// get recent users
	@UseGuards(AuthGuard)
	@Get('recent')
	async recentUsers(@Req() req: Request, @Res() res: Response) {
		const data = await this.chatService.recentUsers(req?.user?.id)

		res.status(200).json({ success: true, message: 'Successfull get recent users ', data })

	}
}