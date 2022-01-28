import { useMemo, useState } from "react";
import { styled } from "@/stitches.config";
import * as Dropdown from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@radix-ui/react-icons";

const Trigger = styled(Dropdown.Trigger, {
  backgroundColor: "transparent",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "$forest",
  borderRadius: 0,
  padding: "$3 $4",
  cursor: "pointer",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  minWidth: 124,
  height: 40,
  fontFamily: "$sans",
  fontSize: "$sm",
  color: "$forest",
  fontWeight: "$regular",
  variants: {
    active: {
      true: {
        backgroundColor: "$forest",
        color: "$sand",
      },
      false: {
        "&:hover": {
          backgroundColor: "rgba(50, 72, 65, 0.1)",
        },
      },
    },
    collapsed: {
      true: {
        borderWidth: "0 0 1px",
      },
    },
  },
});

const TriggerIcon = styled(ChevronDownIcon, {
  marginLeft: "$1",
  variants: {
    orientation: {
      up: {
        transform: "rotate(180deg)",
      },
      down: {},
    },
  },
});
const TriggerIconWrapper = styled("span", {
  marginLeft: "auto",
});

const Content = styled(Dropdown.Content, {
  backgroundColor: "$sand",
  color: "$forest",
  minWidth: 124,
  fontWeight: "$regular",
});

const Option = styled(Dropdown.Item, {
  marginBottom: -1,
  "&:first-child": {
    marginTop: -1,
  },
  backgroundColor: "$sand",
  padding: "$3 $4",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "$forest",
  cursor: "pointer",
  fontSize: "$sm",
  "&:hover": {
    backgroundColor: "rgba(50, 72, 65, 0.1)",
  },
});

interface DropdownMenuProps {
  active?: boolean;
  collapse?: boolean;
  options: any[];
  value: any;
  onChange?: (value: any) => void;
}
const DropdownMenu = ({
  active = false,
  collapse = false,
  options,
  value,
  onChange,
}: DropdownMenuProps) => {
  const [opened, setOpen] = useState(false);
  const selected = useMemo(
    () => options.find((option) => option.value === value),
    [options, value]
  );
  return (
    <Dropdown.Root onOpenChange={setOpen}>
      <Trigger collapsed={collapse} active={active}>
        {selected?.label ?? "Select"}
        <TriggerIconWrapper>
          <TriggerIcon orientation={opened ? "up" : "down"} />
        </TriggerIconWrapper>
      </Trigger>

      <Content>
        {options.map((option, idx) => (
          <Option key={idx} onClick={() => onChange && onChange(option.value)}>
            {option.label}
          </Option>
        ))}
      </Content>
    </Dropdown.Root>
  );
};

export default DropdownMenu;
