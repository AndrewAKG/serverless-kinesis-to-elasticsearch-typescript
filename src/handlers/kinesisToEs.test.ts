import { handler } from './kinesisToEs';

import { Context, KinesisStreamEvent } from 'aws-lambda';

describe('Test Kinesis to ES Handler', () => {
  test('Verify Kinesis is pushing data correctly to ES', async () => {
    function unusedCallback<T>() {
      return (undefined as any) as T; // eslint-disable-line @typescript-eslint/no-explicit-any
    }

    const data = await handler(
      {} as KinesisStreamEvent,
      {} as Context,
      unusedCallback<any>() // eslint-disable-line @typescript-eslint/no-explicit-any
    );
  });
});
