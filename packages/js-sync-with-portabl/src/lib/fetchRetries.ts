export const MAX_RETRIES = 3;

export async function fetchRetries<T>(
  fn: () => Promise<T>,
  maxRetry: number,
): Promise<T> {
  let retryCount = 0;
  let delay = 1000;

  const retry = async (): Promise<T> => {
    try {
      return await fn();
    } catch (error) {
      if (retryCount < maxRetry) {
        retryCount += 1;
        delay *= 2;
        await new Promise(resolve => {
          setTimeout(resolve, delay);
        });
        return retry();
      }
      throw new Error('Max retry reached');
    }
  };

  return retry();
}
