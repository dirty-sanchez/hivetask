import LdService from "./ld.service";

describe('LdService service', () => {
  let service: LdService;

  beforeEach(() => { service = new LdService(); });

  describe('.forEach()', () => {
    it('returns array & callback gets called with valid parameters for array', () => {
      const srcData = ['a', 'b', 'c'];
      const callbackTest = { fn: (el: any, i: number, collection: any[]) => {}};

      spyOn(callbackTest, 'fn');

      service.forEach(srcData, callbackTest.fn);
      expect(callbackTest.fn).toHaveBeenCalledTimes(3);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[0], 0, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[1], 1, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[2], 2, srcData);
    });

    it('returns object & callback gets called with valid parameters for object', () => {
      const srcData = {'a': 1, 'b': 2, 'c': 3};
      const callbackTest = { fn: () => {}};

      spyOn(callbackTest, 'fn');

      service.forEach(srcData, callbackTest.fn);
      expect(callbackTest.fn).toHaveBeenCalledTimes(3);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData['a'], 'a', srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData['b'], 'b', srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData['c'], 'c', srcData);
    });

    it('callback string & gets called with valid parameters for string', () => {
      const srcData = 'abc';
      const callbackTest = { fn: (el: any, i: number, collection: any[]) => {}};

      spyOn(callbackTest, 'fn');

      service.forEach(srcData, callbackTest.fn);
      expect(callbackTest.fn).toHaveBeenCalledTimes(3);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[0], 0, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[1], 1, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[2], 2, srcData);
    });

    it('works well with empty|null|undefined input parameters', () => {
      expect(service.forEach()).toBeUndefined();
      expect(service.forEach({})).toEqual({});
      expect(service.forEach(null)).toBeNull();
    });
  });

  describe('.filter()', () => {
    it('callback gets called with correct parameters', () => {
      const srcData = [1, 4, 65];
      const callbackTest = { fn: (el: any): boolean => true };

      spyOn(callbackTest, 'fn');

      const res = service.filter(srcData, callbackTest.fn);
      expect(callbackTest.fn).toHaveBeenCalledTimes(3);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[0], 0, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[1], 1, srcData);
      expect(callbackTest.fn).toHaveBeenCalledWith(srcData[2], 2, srcData);
    });

    it('returns filtered array for array', () => {
      const srcData = [1, 4, 65];
      const callbackTest = { fn: (el: any): boolean => {
        return  el === 1 || el === 65;
      }};

      const res = service.filter(srcData, callbackTest.fn);
      expect(res).toEqual([1, 65]);
    });

    it('returns source array if no fn supplied', () => {
      const srcData = [1, 4, 65];
      const res = service.filter(srcData,);
      expect(res).toEqual(srcData);
    });

    it('returns filtered array for object', () => {
      const srcData = {'a': 1, 'b': 4, 'c': 65};
      const callbackTest = { fn: (el: any): boolean => {
        return  el % 2 == 1;
      }};

      const res = service.filter(srcData, callbackTest.fn);
      expect(res).toEqual([1, 65]);
    });

    it('returns object values for object if no fn supplied', () => {
      const srcData = {"first": "foo", "second": "bar"};
      const check = (<any>Object).values(srcData);
      const res = service.filter(srcData,);
      expect(res).toEqual(check);
    });

    it('return filtered array for string', () => {
      const srcData = 'abcdef';
      const callbackTest = (el: any): boolean => el === 'a' || el === 'c' || el === 'e';
      const checkData = ['a', 'c', 'e'];

      const res = service.filter(srcData, callbackTest);
      expect(res).toEqual(checkData);
    });

    it('returns empty array if input is empty|null|undefined or a number', () => {
      expect(service.filter(null)).toEqual([]);
      expect(service.filter(undefined)).toEqual([]);
      expect(service.filter([])).toEqual([]);
    });
  });

  describe('.map()', () => {
    it('applies callback for each list element', () => {
      const srcData = [1, 2, 4, 8];
      const checkData = [1, 4, 16, 64];
      const callbackTest = { fn: (el: any): number => el * el };

      const res = service.map(srcData, callbackTest.fn);
      expect(res).toEqual(checkData);
    });

    it('applies callback for each objects field value', () => {
      const srcData = {"1": "field", "2": "field", "3": "field"};
      const checkData = ["field#1", "field#2", "field#3"];
      const callbackTest = { fn: (fieldValue: any, fieldName: string): string => fieldValue + "#" + fieldName};

      const res = service.map(srcData, callbackTest.fn);
      expect(res).toEqual(checkData);
    });

    it('applies callback for each char in string ', () => {
      const srcData = '123';
      const checkData = ['1-mississippi', '2-mississippi', '3-mississippi'];
      const actual = service.map(srcData, (char: string) => char + '-mississippi');
      expect(actual).toEqual(checkData);
    });

    it('returns empty array if input is empty|null|undefined', () => {
      expect(service.map([])).toEqual([]);
      expect(service.map(null)).toEqual([]);
      expect(service.map(undefined)).toEqual([]);
    });
  });

  describe('.sample', () => {
    it('returns undefined if input is empty|null|undefined|a number', ()=>{
      expect(service.sample()).toEqual(undefined);
      expect(service.sample(null)).toEqual(undefined);
      expect(service.sample(undefined)).toEqual(undefined);
      expect(service.sample(12)).toEqual(undefined);
    });

    it('picks random element from a list', () => {
      const srcData = [1, 2, 3, 4, 6];
      const result = service.sample(srcData);
      expect(srcData.indexOf(result)).not.toEqual(-1);
    });

    it('picks random symbol from an object', () => {
      const srcData = {name: 'John', lastname: 'Doe', birthday: '1845-01-01'};
      const result = service.sample(srcData);

      let isExistsInTheObj = false;
      for(let field in srcData) {
        if (srcData[field] === result) {
          isExistsInTheObj = true;
          break;
        }
      }

      expect(isExistsInTheObj).toBe(true);
    });

    it('picks random char from a string', () => {
      const srcData = 'abcdef';
      const res = service.sample(srcData);
      expect(srcData.indexOf(res)).not.toBe(-1);
    });
  });

  describe('.size', () => {
    it('returns 0 for empty|null|undefined|a number input', () => {
      expect(service.size()).toBe(0);
      expect(service.size(null)).toBe(0);
      expect(service.size(undefined)).toBe(0);
      expect(service.size(12345)).toBe(0);
    });

    it('returns length for a string or an array', () => {
      expect(service.size('abcdef')).toBe(6);
      expect(service.size(['a', 1, 6])).toBe(3);
    });

    it('returns properties count for an object', () => {
      expect(service.size({name: 'John', lastname: 'Doe'})).toBe(2);
    });
  });
});