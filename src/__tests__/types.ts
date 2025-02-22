import type { SinonSandbox, SinonStub } from '@types/sinon';

declare global {
    namespace Mocha {
        interface Context {
            sandbox: SinonSandbox;
            consoleLogStub: SinonStub;
            consoleErrorStub: SinonStub;
        }
    }
}