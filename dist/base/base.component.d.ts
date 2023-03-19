import { Component } from '@loopback/core';
import { ApplicationLogger } from '../helpers';
export declare class BaseComponent implements Component {
    protected logger: ApplicationLogger;
    constructor(opts: {
        scope: string;
    });
}
