import { useState, useCallback, useEffect, useContext, Context } from "react";
import { Button } from "@cabindao/topo";
import { DropdownProps } from "@/types";
import { v4 as uuidv4 } from "uuid";
import { styled } from "@/stitches.config";
import SortCtx from "@/context/SortContext";

const StyledDiv = styled("div", {
  display: "flex",
  flexDirection: "column",
});

const DropdownMenu = (props: DropdownProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  const { sortType, changeSortType } = useContext(SortCtx);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("click", toggle);
    }
    return () => {
      document.removeEventListener("click", toggle);
    };
  }, [isOpen, toggle]);

  return (
    <StyledDiv className="filter">
      <Button type="primary" onClick={toggle}>
        Sort
      </Button>
      {isOpen &&
        props.options.map((option, index) => (
          <Button key={uuidv4()} type="secondary" onClick={() => changeSortType(props.options[index])}>
            {option.text}
          </Button>
        ))}
    </StyledDiv>
  );
};

export default DropdownMenu;
