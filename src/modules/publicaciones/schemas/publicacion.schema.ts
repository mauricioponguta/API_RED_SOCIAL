import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PublicacionDocument = Publicacion & Document;

@Schema({
  collection: 'publicaciones',
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion',
  },
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

  @Prop({
    default: true,
  })
  activo!: boolean;
}

export const PublicacionSchema = SchemaFactory.createForClass(Publicacion);
