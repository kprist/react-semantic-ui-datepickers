import React from 'react';
import { FormInputProps } from 'semantic-ui-react';
import { SemanticDatepickerProps } from '../types';
type InputProps = FormInputProps & {
    clearIcon: SemanticDatepickerProps['clearIcon'];
    icon: SemanticDatepickerProps['icon'];
    isClearIconVisible: boolean;
};
declare const CustomInput: React.ForwardRefExoticComponent<Omit<InputProps, "ref"> & React.RefAttributes<HTMLInputElement>>;
export default CustomInput;
