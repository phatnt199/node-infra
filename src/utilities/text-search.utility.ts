import voca from 'voca';
import get from 'lodash/get';

export const getSearchText = (entity: any, fields: string[], moreData?: any) => {
  const re = new RegExp(/[`~!@#$%^&*()_|+\-=?;:'",.<>{}[]\\\/]/, 'g');
  const result: string[] = [];
  for (const field of fields) {
    const data = get(entity, field);
    if (data) {
      result.push(
        voca
          .latinise(data)
          ?.split(re)
          .map((word: string) => word.trim().toLowerCase())
          .join(' '),
      );
    }
  }

  if (moreData) {
    for (const key in moreData) {
      const data = moreData[key];
      if (data) {
        result.push(
          voca
            .latinise(data)
            ?.split(re)
            .map((word: string) => word.trim().toLowerCase())
            .join(' '),
        );
      }
    }
  }

  return result.join(' ');
};
