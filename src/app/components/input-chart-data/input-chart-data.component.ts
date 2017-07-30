import {Component, Input, EventEmitter, Output, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, Validators, ValidatorFn, AbstractControl} from "@angular/forms";

@Component({
    selector: 'input-chart-data',
    templateUrl: './input-chart-data.component.html',
    styleUrls: ['./input-chart-data.component.css'],
})
export class InputChartDataComponent implements OnInit {
    formGroup: FormGroup;
    methods = ['filter', 'map', 'sample', 'size', 'forEach',];

    @Input()
    chartFormData: InputChartDataModel;

    @Output()
    chartFormDataChange = new EventEmitter<InputChartDataModel>();

    formErrors: any[];

    validationMessages = {
        'name': {
            'required': 'Choose a lodash-like method.',
        },
        'dataInput': {
            'required': 'Input for a function is required! Enter either valid JSON or string.',
        },
        'funcInput': {
            'validJsFnExpression': 'Input must be a valid JS expression.'
        },
    };

    constructor(private fb: FormBuilder) { }

    isDataObject() {
        try {
            const json = JSON.parse(this.formGroup.get('dataInput').value);
            if (Array.isArray(json)) {
                return false
            }

            return true;
        } catch(e) {
            return false;
        }
    }

    ngOnInit(): void {
        this.buildForm();
    }

    buildForm(): void {
        this.formGroup = this.fb.group({
            'name': [
                this.chartFormData.methodId, [nonEmptyStringOrArrayOrObject]
            ],
            'dataInput': [this.chartFormData.dataInput, Validators.required],
            'funcInput': [this.chartFormData.fn, validJsFnExpression()]
        });

        this.formGroup.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    generateData() {
        const rand = Math.random();
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let newDataInputValue: string;
        let newFuncInputValue: string;

        const mode = rand > 0.6 ? 'list': rand > 0.3 ? 'string': 'obj';
        switch (mode) {
            case 'list':
                const data = Array(10)
                    .fill(0)
                    .map((el) => Math.round(Math.random() * 10));

                newDataInputValue = JSON.stringify(data);
                switch (this.chartFormData.methodId) {
                    case 'filter':
                        newFuncInputValue = `x != ${data[0]}`;
                        break;
                    case 'map':
                        newFuncInputValue = 'x * x';
                        break;
                    case 'sample':
                    case 'size':
                    case 'forEach':
                        newFuncInputValue = 'x';
                }
                break;
            case 'string':
                newDataInputValue = '';

                for (let i = 0; i < 100; i++) {
                    newDataInputValue += possible.charAt(Math.floor(Math.random() * possible.length));
                }

                switch (this.chartFormData.methodId) {
                    case 'filter':
                        newFuncInputValue = `x != "${newDataInputValue[0]}"`;
                        break;
                    case 'map':
                        newFuncInputValue = rand > 0.5? '"#" + x': '"char \"" + x + "\""';
                        break;
                    case 'sample':
                    case 'size':
                    case 'forEach':
                        newFuncInputValue = 'x';
                }
                break;
            default:
                const res = {
                    'Website visits': 0,
                    'Downloads': 0,
                    'Requested price list': 0,
                    'Invoice sent': 0,
                    'Finalized': 0,
                };

                for (let prop in res) {
                    res[prop] = Math.round(Math.random() * 10000);
                }

                newDataInputValue = JSON.stringify(res);
                switch (this.chartFormData.methodId) {
                    case 'filter':
                        newFuncInputValue = `x < 1000`;
                        break;
                    case 'map':
                        newFuncInputValue = 'x * x';
                        break;
                    case 'sample':
                    case 'size':
                    case 'forEach':
                        newFuncInputValue = 'x';
                }
        }

        this.formGroup.patchValue({dataInput: newDataInputValue, funcInput: newFuncInputValue });
    }

    onValueChanged(data?: any) {
        if (!this.formGroup) { return; }
        const form = this.formGroup;

        this.formErrors = [];
        this.formErrors = Object.keys(form.controls)
            .map(k => {
                return { fieldId: k, control: form.controls[k], errors: [] };
            })
            .filter(dto => !dto.control.valid)
            .map(dto => {
                const fieldValidationMessages =  this.validationMessages[dto.fieldId];
                const res = <any[]>[];
                for (const key in dto.control.errors) {
                    res.push(fieldValidationMessages[key]);
                }

                return res;
            })
            .reduce( (accum: string[], errors: string[]): string[] => accum.concat(errors), []);

        if (form.valid) {
            let isChanged = false;

            if (this.chartFormData.methodId !== this.formGroup.get('name').value) {
                isChanged = true;
                this.chartFormData.methodId = this.formGroup.get('name').value;
            }

            if (this.chartFormData.dataInput !== this.formGroup.get('dataInput').value) {
                isChanged = true;
                this.chartFormData.dataInput = this.formGroup.get('dataInput').value;
            }

            if (this.chartFormData.fn !== this.formGroup.get('funcInput').value) {
                isChanged = true;
                this.chartFormData.fn = this.formGroup.get('funcInput').value;
            }

            if (isChanged) {
                this.chartFormDataChange.emit(this.chartFormData);
            }
        }
    }
}

export class InputChartDataModel {
    methodId: string = 'filter';
    // dataInput: string = '[5,4,8,2,7]';
    dataInput: string = '{"aaaa": 14324, "cccc": 1235}';
    fn: string = 'x % 1 === 0';
}

export function validJsFnExpression(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        const json = control.value;
        let x;//<< we plan to use it in the json JS code

        try {
            eval(json);
        } catch (e) {
            return {'validJsFnExpression': {json}};
        }
        return null;
    };
}

function nonEmptyStringOrArrayOrObject(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
        let jsonData: any;
        try {
            jsonData = JSON.parse(control.value);
        } catch (e) {
            /// processing input as string
            if (control.value.trim().length == 0) {
                return {
                    'nonEmptyStringOrArrayOrObject': {json: control.value}
                };
            } else {
                return null;
            }
        }

        /// processing input as array
        if (Array.isArray(jsonData)) {
            for (let i = 0; i < jsonData.length; i++) {
                if (jsonData[i] != null && jsonData[i] != '') {
                    return null;
                }
            }

            return {
                'nonEmptyStringOrArrayOrObject': {json: control.value}
            };
        }

        for(let prop in jsonData) {
            if (jsonData[prop] != null && jsonData[prop] != '') {
                return null;
            }
        }

        return {
            'nonEmptyStringOrArrayOrObject': {json: control.value}
        };
    }
}
