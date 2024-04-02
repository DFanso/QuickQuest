import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ContentType } from 'src/Types/chat.types';
import { User } from 'src/user/entities/user.entity';

@Schema({ timestamps: true })
export class Chat extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  customer: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  worker: User;

  @Prop({
    type: [
      {
        sender: { type: MongooseSchema.Types.ObjectId, ref: 'User' },
        contentType: {
          type: String,
          enum: Object.values(ContentType),
          default: ContentType.Text,
        },
        content: { type: MongooseSchema.Types.Mixed },
        timestamp: Date,
      },
    ],
    default: [],
  })
  messages: {
    sender: User;
    contentType: ContentType;
    content: string | MongooseSchema.Types.ObjectId;
    timestamp: Date;
  }[];
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
