import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, of } from 'rxjs';
import { ContentType } from 'src/Types/chat.types';
import { Chat } from './entities/chat.entity';
import { UserService } from 'src/user/user.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<Chat>,
    private readonly userService: UserService,
    private readonly offersService: OffersService,
  ) {}

  async createChat(customerId: string, workerId: string): Promise<Chat> {
    const existingChat = await this.chatModel.findOne({
      customer: customerId,
      worker: workerId,
    });

    if (existingChat) {
      return existingChat;
    }

    const newChat = new this.chatModel({
      customer: customerId,
      worker: workerId,
    });
    return newChat.save();
  }

  async addMessage(
    chatId: string,
    senderId: string,
    contentType: ContentType,
    content: string | any,
  ): Promise<void> {
    await this.chatModel.updateOne(
      { _id: chatId },
      {
        $push: {
          messages: {
            sender: senderId,
            contentType,
            content,
            timestamp: new Date(),
          },
        },
      },
    );
  }

  async getMessages(chatId: string): Promise<Observable<any>> {
    const chat = await this.chatModel.findById(chatId).lean().exec();
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }

    const populateOffers = chat.messages.map(async (message) => {
      if (message.contentType === ContentType.Offer) {
        const offer = await this.offersService.findOne({
          _id: message.content,
        });
        return {
          ...message,
          content: offer,
        };
      }
      return message;
    });

    const messages = await Promise.all(populateOffers);
    return of({ type: 'message', data: messages });
  }
}
