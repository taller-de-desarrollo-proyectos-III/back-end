export interface ICreateProps {
  name: string;
  description: string;
}

export interface IUpdateProps extends ICreateProps {
  uuid: string;
}
