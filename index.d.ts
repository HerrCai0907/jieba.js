export declare function ready(): Promise<void>;
export declare function init(dictPath?: string | null, hmmPath?: string | null, userDictPath?: string | null, idfPath?: string | null, stopWordPath?: string | null): void;
export declare type ExtractResult = {
    word: string;
    weight: number;
};
export declare function extract(str: string, topN: number): ExtractResult[];
export declare function cut(str: string): string[];
