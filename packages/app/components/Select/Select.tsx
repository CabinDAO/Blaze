import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import { styled } from "@/stitches.config";
import {Option, SelectProps} from "@/types";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import { Button } from "@cabindao/topo";



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

const Select = (props: SelectProps) => {
  return (
    <div>
      <StyledSelect onChange={props.sortHandler}>
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
