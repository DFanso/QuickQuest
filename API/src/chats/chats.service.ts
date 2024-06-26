import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  defer,
  filter,
  from,
  map,
  merge,
  Observable,
  scan,
  Subject,
} from 'rxjs';
import { ContentType } from 'src/Types/chat.types';
import { Chat } from './entities/chat.entity';
import { UserService } from 'src/user/user.service';
import { OffersService } from 'src/offers/offers.service';

@Injectable()
export class ChatsService {
  private messagesSubject = new Subject<any>();
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

  async getAllChatsForUser(userId: string): Promise<Chat[]> {
    const chats = await this.chatModel
      .find({
        $or: [{ customer: userId }, { worker: userId }],
      })
      .populate('customer', 'firstName lastName email profileImage')
      .populate('worker', 'firstName lastName email profileImage')
      .exec();
    return chats;
  }

  async addMessage(
    chatId: string,
    senderId: string,
    contentType: ContentType,
    content: string | any,
  ): Promise<void> {
    const newMessage: any = {
      sender: senderId,
      contentType,
      content,
      timestamp: new Date(),
    };

    if (contentType === ContentType.Offer) {
      const offer = await this.offersService.findOne({
        _id: content,
      });
      newMessage.content = offer;
    }

    await this.chatModel.updateOne(
      { _id: chatId },
      {
        $push: {
          messages: newMessage,
        },
      },
    );

    // Emit the new message along with the chatId
    this.messagesSubject.next({ chatId, message: newMessage });
  }

  getMessages(chatId: string): Observable<any> {
    // Retrieve old messages from the database
    const oldMessages$ = defer(() => from(this.getOldMessages(chatId)));

    // Combine old messages with new messages from the subject
    return merge(
      oldMessages$,
      this.messagesSubject.asObservable().pipe(
        filter((data: any) => data.chatId === chatId),
        map((data: any) => ({
          chatId: data.chatId,
          messages: [data.message],
        })),
      ),
    ).pipe(
      scan(
        (acc: any, curr: any) => ({
          chatId: curr.chatId,
          messages: [...acc.messages, ...curr.messages],
        }),
        { chatId, messages: [] },
      ),
    );
  }

  private async getOldMessages(chatId: string): Promise<any> {
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
    return { chatId, messages };
  }

  // async getMessages(chatId: string): Promise<Observable<any>> {
  //   const chat = await this.chatModel.findById(chatId).lean().exec();
  //   if (!chat) {
  //     throw new NotFoundException('Chat not found');
  //   }

  //   const populateOffers = chat.messages.map(async (message) => {
  //     if (message.contentType === ContentType.Offer) {
  //       const offer = await this.offersService.findOne({
  //         _id: message.content,
  //       });
  //       return {
  //         ...message,
  //         content: offer,
  //       };
  //     }
  //     return message;
  //   });

  //   const messages = await Promise.all(populateOffers);
  //   return of({ type: 'message', data: messages });

  // }
}
