export type TCommissionUuids = string[] | "ALL";
export type TRoleUuids = string[] | "ALL";

export interface IGetProps {
  commissionUuids: TCommissionUuids;
  roleUuids: TRoleUuids;
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
  notes?: string;
  commissionUuids?: TCommissionUuids;
  roleUuids?: TRoleUuids;
  stateUuid: string;
}

export interface IUpdateProps extends ICreateProps {
  uuid: string;
}
