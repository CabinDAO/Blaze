import { useState, useCallback, useEffect } from "react";
import { Button } from "@cabindao/topo";
import { DropdownProps } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@/stitches.config";

const StyledDiv = styled("div", {
  display: "flex",
  flexDirection: "column",
}
);

const DropdownMenu = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useEffect(() => {
      if (isOpen) {
        document.addEventListener("click", toggle);
      }
      return () => {
        document.removeEventListener("click", toggle);
      }
  }, [isOpen, toggle]);

  return (
    <StyledDiv className="filter">
      <Button type="primary" onClick={toggle}>
        Filter
      </Button>
      {isOpen &&
        props.options.map((option) => (
          <Button key={uuidv4()} type="secondary">
            {option.text}
          </Button>
        ))}
    </StyledDiv>
  );
};

export default DropdownMenu;
