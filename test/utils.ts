import { createMock } from '@golevelup/ts-jest';
import { ExecutionContext } from '@nestjs/common';
import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { v4 as uuid4 } from 'uuid';

export const userId = uuid4();

export const gqlMockFactory = (
  context: Record<string, any>,
  info: Record<string, any>,
) =>
  createMock<ExecutionContext>({
    getType: () => 'graphql',
    getHandler: () => 'query',
    getClass: () => 'Test',
    getArgs: () => [{}, {}, context, info],
  });

export const gqlContextMockFactory = (contextMock: any) =>
  gqlMockFactory(contextMock, {});

export const gqlInfoMockFactory = (infoMock: any) => gqlMockFactory({}, infoMock);

export const getParamDecoratorFactory = (decorator: Function) => {
  class Test {
    public test(@decorator() value) {}
  }

  const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, Test, 'test');
  return args[Object.keys(args)[0]].factory;
};
