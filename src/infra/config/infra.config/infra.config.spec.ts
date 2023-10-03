import { InfraConfig } from './infra.config';

describe('InfraConfig', () => {
  it('should be defined', () => {
    expect(new InfraConfig()).toBeDefined();
  });
});
