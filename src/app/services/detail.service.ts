import { Injectable } from '@angular/core';
@Injectable()

export class DetailService {
    private _detail: boolean;

    constructor() {
    }
    set(value:boolean) {
        this._detail = value;
    }
    get(): boolean {
        return this._detail;
    }
}
