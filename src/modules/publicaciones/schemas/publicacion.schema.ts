import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PublicacionDocument = Publicacion & Document;

@Schema({
  timestamps: true,
})
export class Publicacion {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  usuario_id!: Types.ObjectId;

  @Prop({
    required: true,
  })
  contenido!: string;

  @Prop()
  imagen?: string;

  @Prop({
    default: true,
  })
  activo!: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
