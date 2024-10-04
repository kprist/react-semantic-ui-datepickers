import { SemanticDatepickerProps } from '../types';
type CustomIconProps = {
    clearIcon: SemanticDatepickerProps['clearIcon'];
    icon: SemanticDatepickerProps['icon'];
    isClearIconVisible: boolean;
    onClear: () => void;
    onClick: () => void;
};
declare const CustomIcon: ({ clearIcon, icon, isClearIconVisible, onClear, onClick, }: CustomIconProps) => import("react/jsx-runtime").JSX.Element;
export default CustomIcon;
