export type connectionType =
  | 'mysql'
  | 'mariadb'
  | 'postgres'
  | 'cockroachdb'
  | 'sqlite'
  | 'mssql'
  | 'sap'
  | 'oracle'
  | 'cordova'
  | 'nativescript'
  | 'react-native'
  | 'sqljs'
  | 'mongodb'
  | 'aurora-data-api'
  | 'aurora-data-api-pg'
  | 'expo'
  | 'better-sqlite3';

export const ENV = process.env.NODE_ENV;

export type MockType<T> = {
  [P in keyof T]?: jest.Mock<Record<string, any>>;
};
