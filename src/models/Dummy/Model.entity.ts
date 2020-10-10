import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Dummy {

  @PrimaryGeneratedColumn({ type: "uuid" })
  uuid: number;

  @Column()
  welcomeMessage: string;
}
