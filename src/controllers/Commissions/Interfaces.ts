export interface ICreateProps {
  name: string;
}

export interface IUpdateProps extends ICreateProps {
  uuid: string;
}
