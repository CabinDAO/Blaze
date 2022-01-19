import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { styled } from "@/stitches.config";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@cabindao/topo";

export interface Option {
  text: string;
  value: string;
}
export interface ISelectProps {
  options: Option[];
}

export const StyledSelect = styled("select", {
});
export const StyledOption = styled("option", {
});

const MenuButton = (props: any) => {
  return (
    <Button
      css={{
        "&:hover": {
          backgroundColor: "rgba(50, 72, 65, 0.1)",
        },
      }}
      type="secondary"
      rightIcon={<ChevronDownIcon />}
      {...props}
    />
  );
};

const Select = (props: ISelectProps) => {
  const selectHandler = (e: Event) => {
    const select = e.target as HTMLSelectElement;
    const value = select.value;
    console.log(value);
  };
  return (
    <div>
      <StyledSelect onChange={selectHandler}>
        {props.options.map((option) => (
          <StyledOption key={uuidv4()} value={option.value}>
            {option.text}
          </StyledOption>
        ))}
      </StyledSelect>
    </div>
  );
};

export default Select;
