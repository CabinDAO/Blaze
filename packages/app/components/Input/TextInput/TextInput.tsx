import {styled} from "@/stitches.config";

const StyledTextInput = styled("input", {
  backgroundColor: "$sand",
  width: "100%",
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: "$forest",
  padding: "$3 $4",
  fontSize: "$sm",
});

interface TextInputProps {
  value?: string;
  placeholder?: string;
  onChange: (value: string) => void;
}

const TextInput = ({ onChange, ...rest }: TextInputProps) => {
  return (
    <StyledTextInput
      onChange={({ target: { value } }) => onChange(value)}
      {...rest}
    />
  );
};

export default TextInput;
