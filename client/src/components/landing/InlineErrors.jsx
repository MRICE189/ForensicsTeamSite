import React from "react";

const InlineErrors = ({ field, errors }) => {
    if (!errors) {
        return null;
    }

    if (!errors[field]) {
        return null;
    }

    return (
        <div className="text-danger">
            {errors[field].map((error) => (
                <span>{error} </span>
            ))}
        </div>
    );
};

export default InlineErrors;
