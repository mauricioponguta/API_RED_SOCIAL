import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ComentarioDocument = Comentario & Document;

@Schema({
  collection: 'comentarios',
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion',
  },
})
export class Comentario {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'Publicacion',
  })
  publicacion_id!: Types.ObjectId;

  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: 'User',
  })
  usuario_id!: Types.ObjectId;

  @Prop({
    required: true,
  })
  comentario!: string;

  @Prop({
    default: true,
  })
  activo!: boolean;
}

export const ComentarioSchema = SchemaFactory.createForClass(Comentario);
