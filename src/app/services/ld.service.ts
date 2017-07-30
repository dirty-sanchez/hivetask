
import {isArray} from "rxjs/util/isArray";
import {setRootDomAdapter} from "@angular/platform-browser/src/dom/dom_adapter";
export default class LdService {
    forEach(src: any = undefined, fn: (el: any, index: any, collection: any) => void = undefined): any[] {
        if (!src || fn == null) {
            return src;
        }
        if (isArray(src) || typeof src === 'string') {
            const len = src.length;
            for (let i = 0; i < len; i++) {
                fn(src[i], i, src);
            }
        } else {
            for (let prop in src) {
                fn(src[prop], prop, src);
            }
        }

        return src;
    }

    filter(src: any = undefined, fn: (el: any, i: any, collection: any) => boolean = undefined ): any[] {
        const res: any = [];
        if (!src) {
            return res;
        }

        if (isArray(src)) {
            if (!fn) {
                return src;
            }

            const len = src.length;
            for (let i = 0; i < len; i++) {
                if (fn(src[i], i, src)) {
                    res.push(src[i])
                }
            }
        } else {
            if (!fn) {
                return (<any>Object).values(src);
            }

            for (let prop in src) {
                if (fn(src[prop], prop, src)) {
                    res.push(src[prop]);
                }
            }
        }

        return res;
    }

    map(src: any = undefined, fn: (el: any, i: any, collection: any) => any = undefined ): any[] {
        const res: any = [];
        if (!src || fn == null) {
            return res;
        }

        if (isArray(src) || typeof src === 'string') {
            const len = src.length;
            for (let i = 0; i < len; i++) {
                (res.push(fn(src[i], i, src)));
            }
        } else {
            for (let prop in src) {
                res.push(fn(src[prop], prop, src));
            }
        }

        return res;
    }

    sample(src: any = undefined): any {
        if (!src) {
            return undefined;
        }

        if (isArray(src) || typeof src === 'string') {
            return src[Math.floor(Math.random() * src.length)];
        }

        let count = 0;
        for (let prop in src) {
            if (Math.random() < 1 / ++count) {
                return src[prop];
            }
        }
    }

    size(src: any = undefined): any {
        if (!src) {
            return 0;
        }

        if (isArray(src) || typeof src === 'string') {
            return src.length;
        }

        let count = 0;
        for (let prop in src) {
            count++;
        }

        return count;
    }
}
