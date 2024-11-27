import { ValueOrPromise } from '@/common';

type TTask<T> = () => Promise<T>;

export const executePromiseWithLimit = async <T>(opts: {
  tasks: Array<TTask<T>>;
  limit: number;
  onTaskDone?: <R>(opts: { result: R }) => ValueOrPromise<void>;
}) => {
  const { tasks, limit, onTaskDone } = opts;

  const results = [];
  const executing = new Set();

  for (const task of tasks) {
    const promise = task().then(result => {
      executing.delete(promise);
      return result;
    });

    executing.add(promise);
    results.push(promise);

    if (executing.size >= limit) {
      const done = await Promise.race(executing);
      onTaskDone?.({ result: done });
    }
  }

  await Promise.all(executing);
  return Promise.all(results);
};
