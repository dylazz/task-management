import {type HTMLAttributes, type JSX} from "react";

type ActionButtonProps = {
    onClick?: () => void;
    title: string;
    icon: JSX.Element;
    hoverColor?: "blue" | "red" | "gray";
    className?: string;
} & HTMLAttributes<HTMLButtonElement>;

export const ActionButton = ({
                                 onClick,
                                 title,
                                 icon,
                                 hoverColor = "blue",
                                 className = "",
                                 ...restProps
                             }: ActionButtonProps) => {
    const colorClasses = {
        "blue": "hover:text-blue-600",
        "red": "hover:text-red-600",
        "gray": "hover:text-gray-600"
    };

    const hoverColorClass = colorClasses[hoverColor] || colorClasses["blue"];

    return (
        <button
            onClick={onClick}
            className={`p-2 text-gray-600 ${hoverColorClass} transition-colors ${className}`}
            title={title}
            {...restProps}
        >
            {icon}
        </button>
    );
};
