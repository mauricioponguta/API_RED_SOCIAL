import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReaccionDocument = Reaccion & Document;

@Schema({
  collection: 'reacciones',
  timestamps: {
    createdAt: 'fecha_creacion',
    updatedAt: 'fecha_modificacion',
  },
})
export class Reaccion {
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
  tipo_reaccion!: string;

  @Prop({
    default: true,
  })
  activo!: boolean;
}

export const ReaccionSchema = SchemaFactory.createForClass(Reaccion);
