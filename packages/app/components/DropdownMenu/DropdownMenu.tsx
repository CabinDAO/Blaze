import { useState, useCallback } from "react";
import { Button } from "@cabindao/topo";
import { DropdownProps } from "@/types";
import {v4 as uuidv4} from "uuid/v4";

const DropdownMenu = ({options}: DropdownProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);
  return (
  <div className="filter">
      <Button type="primary">Filter</Button>
      {isOpen && 
        options.map(option => <Button key={uuidv4()}type="primary">{option}</Button>)
      }
  </div>)
};

export default DropdownMenu;
