import { DataObject } from '@loopback/repository';
import { TextSearchModel } from '@/common';
import voca from 'voca';
import get from 'lodash/get';

const getSearchText = (entity: DataObject<any>, fields: string[], moreData?: DataObject<any>) => {
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

export default getSearchText;

export const renderTextSearch = (entity: DataObject<any>, model: string, moreData?: DataObject<any>) => {
  const fields = TextSearchModel[model];
  if (!fields) return '';
  const textSearch = getSearchText(entity, fields, moreData);
  return textSearch;
};
