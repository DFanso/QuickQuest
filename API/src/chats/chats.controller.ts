import {
  Controller,
  Post,
  Body,
  Param,
  Sse,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ChatsService } from './chats.service';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Observable, merge, mapTo, interval, map, switchMap } from 'rxjs';
import { ContentType } from 'src/Types/chat.types';
import { AuthGuard } from '@nestjs/passport';
import { ClsService } from 'nestjs-cls';
import { AppClsStore, UserType } from 'src/Types/user.types';
import { UserService } from 'src/user/user.service';

@ApiTags('chats')
@Controller({ path: 'chats', version: '1' })
export class ChatsController {
  constructor(
    private readonly chatService: ChatsService,
    private readonly clsService: ClsService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @ApiOperation({ summary: 'Create a new chat' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        workerId: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The chat has been successfully created',
  })
  async createChat(@Body('workerId') workerId: string): Promise<any> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user || user.type !== UserType.Customer) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    const chat = await this.chatService.createChat(context.user.id, workerId);
    return { chatId: chat._id };
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard('jwt'))
  @Post(':chatId/messages')
  @ApiOperation({ summary: 'Add a new message to a chat' })
  @ApiParam({ name: 'chatId', type: 'string' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        contentType: { type: 'string', enum: Object.values(ContentType) },
        content: { type: 'string' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The message has been successfully added',
  })
  async addMessage(
    @Param('chatId') chatId: string,
    @Body('contentType') contentType: ContentType,
    @Body('content') content: string | any,
  ): Promise<void> {
    const context = this.clsService.get<AppClsStore>();
    if (!context || !context.user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const user = await this.userService.findOne({ _id: context.user.id });
    if (!user) {
      throw new HttpException('Unauthorized User', HttpStatus.UNAUTHORIZED);
    }
    await this.chatService.addMessage(
      chatId,
      context.user.id,
      contentType,
      content,
    );
  }

  @Sse(':chatId/sse')
  @ApiOperation({
    summary: 'Subscribe to chat messages using Server-Sent Events',
  })
  @ApiParam({ name: 'chatId', type: 'string' })
  @ApiResponse({
    status: 200,
    description: 'Successfully subscribed to chat messages',
  })
  async sse(
    @Param('chatId') chatId: string,
  ): Promise<Observable<MessageEvent>> {
    const messages$ = await this.chatService.getMessages(chatId);
    return messages$.pipe(
      switchMap((data) => {
        return new Observable<MessageEvent>((observer) => {
          observer.next(
            new MessageEvent('message', { data: JSON.stringify(data) }),
          );
        });
      }),
    );
  }
}
