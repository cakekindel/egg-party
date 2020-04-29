import { createPool, FieldType, InterceptorType } from 'slonik';

const {
    createFieldNameTransformationInterceptor,
} = require('slonik-interceptor-field-name-transformation');

const slonikFieldNameMapper: SlonikFieldNameMapper = createFieldNameTransformationInterceptor;
type SlonikFieldNameMapper = (cfg: {
    format: 'CAMEL_CASE';
    test?: (field: FieldType) => true;
}) => InterceptorType;

export const pool = createPool('postgres://', {
    interceptors: [
        slonikFieldNameMapper({
            format: 'CAMEL_CASE',
        }),
    ],
});
