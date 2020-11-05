export interface IGetProps {
  commissionUuids: string[];
}

export interface ICreateProps {
  dni: string;
  name: string;
  surname: string;
  email: string;
  linkedin?: string;
  phoneNumber: string;
  telegram?: string;
  admissionYear?: string;
  graduationYear?: string;
  country?: string;
  commissionUuids?: string[];
}

export interface IUpdateProps extends ICreateProps {
  uuid: string;
}
