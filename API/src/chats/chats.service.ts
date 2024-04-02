import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable, from } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
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

  getMessages(chatId: string): Observable<any> {
    return from(
      this.chatModel
        .findById(chatId)
        .populate('customer worker messages.sender'),
    ).pipe(
      mergeMap((chat) => {
        const populateOffers = chat.messages.map((message) => {
          if (message.contentType === ContentType.Offer) {
            return this.offersService
              .findOne(message.content)
              .then((offer) => ({
                ...message,
                content: offer,
              }));
          }
          return Promise.resolve(message);
        });

        return Promise.all(populateOffers);
      }),
      map((messages) => {
        return { type: 'message', data: messages };
      }),
    );
  }
}
