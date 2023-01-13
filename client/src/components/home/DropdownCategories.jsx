import React from "react";
import { useEffect } from "react";
import { useState } from "react";

const DropdownCategories = (props) => {
    const onCatChange = (e) => {
        props.onCatChange(e.target.name, e.target.value);
    }


    return <div>
        <select name="CategoryId" value={props.prompt?.CategoryId} onChange={onCatChange} 
            className="form-select">
            {props.categories?.map((cat, idx) => {
                return (
                    <option key={idx} value={cat.CategoryId}>{cat.CategoryName}</option>
                )
            })
            }
        </select>
    </div>;
};

export default DropdownCategories;
