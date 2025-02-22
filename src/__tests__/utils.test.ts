import { expect } from 'chai';
import sinon from 'sinon';
import type { SinonSandbox, SinonStub } from '@types/sinon';
import { shuffle, logger } from '../utils/index.js';

describe('Utilities', () => {
    let sandbox: SinonSandbox;
    let consoleLogStub: SinonStub;
    let consoleErrorStub: SinonStub;

    beforeEach((): void => {
        sandbox = sinon.createSandbox();
        consoleLogStub = sandbox.stub(console, 'log');
        consoleErrorStub = sandbox.stub(console, 'error');
    });

    afterEach((): void => {
        sandbox.restore();
    });

    describe('shuffle', () => {
        it('should return an array of the same length', () => {
            const original: number[] = [1, 2, 3, 4, 5];
            const shuffled = shuffle(original);
            expect(shuffled).to.have.lengthOf(original.length);
        });

        it('should contain all original elements', () => {
            const original: number[] = [1, 2, 3, 4, 5];
            const shuffled = shuffle(original);
            original.forEach((item: number) => {
                expect(shuffled).to.include(item);
            });
        });

        it('should not modify the original array', () => {
            const original: number[] = [1, 2, 3, 4, 5];
            const originalCopy = [...original];
            shuffle(original);
            expect(original).to.deep.equal(originalCopy);
        });
    });

    describe('logger', () => {
        it('should log info messages correctly', () => {
            const message = 'Test info message';
            logger('info', message);
            expect(consoleLogStub.calledOnce).to.be.true;
            expect(consoleLogStub.firstCall.args[0]).to.include('[INFO]');
            expect(consoleLogStub.firstCall.args[0]).to.include(message);
        });

        it('should log error messages correctly', () => {
            const message = 'Test error message';
            const error = new Error('Test error');
            logger('error', message, error);
            expect(consoleErrorStub.calledOnce).to.be.true;
            expect(consoleErrorStub.firstCall.args[0]).to.include('[ERROR]');
            expect(consoleErrorStub.firstCall.args[0]).to.include(message);
        });

        it('should log success messages with checkmark', () => {
            const message = 'Test success message';
            logger('success', message);
            expect(consoleLogStub.calledOnce).to.be.true;
            expect(consoleLogStub.firstCall.args[0]).to.equal('✅');
            expect(consoleLogStub.firstCall.args[1]).to.include('[SUCCESS]');
            expect(consoleLogStub.firstCall.args[1]).to.include(message);
        });
    });
});