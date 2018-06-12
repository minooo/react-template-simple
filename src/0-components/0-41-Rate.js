import React from "react";
import uuid from "uuid/v4";
import { WrapLink } from "@components";

export default ({ value, activeIcon, defaultIcon, onChange, total = 5 }) => {
  const count = Array(...Array(total));
  return (
    <div className="flex ai-center jc-between">
      {count &&
        count.length > 0 &&
        count.map((item, index) => (
          <div key={uuid()} className="equal flex jc-center">
            {index <= value - 1 ? (
              <WrapLink onClick={onChange ? () => onChange(index) : null}>
                {activeIcon || "★"}
              </WrapLink>
            ) : (
              <WrapLink onClick={onChange ? () => onChange(index) : null}>
                {defaultIcon || "☆"}
              </WrapLink>
            )}
          </div>
        ))}
    </div>
  );
};
