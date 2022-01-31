import { styled } from "@/stitches.config";

const TabBarWrapper = styled("div", {
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  boxSizing: "border-box",
  marginBottom: "$2",
});
const TabBarContent = styled("div", {
  display: "flex",
  marginBottom: -1,
});
export const TabButton = styled("button", {
  boxSizing: "border-box",
  background: "none",
  paddingLeft: "$4",
  paddingRight: "$4",
  border: 0,
  height: "$10",
  cursor: "pointer",
  defaultVariants: {
    active: false,
  },
  variants: {
    active: {
      false: {
        "&:hover": {
          backgroundColor: "rgba(50, 72, 65, 0.1)",
        },
      },
      true: {
        backgroundColor: "$forest",
        color: "$sand",
      },
    },
  },
});
export const TabButton = (props: any) => <TabLink {...props} />;

const TabBar = ({ children, ...props }: { children?: React.ReactNode }) => (
  <TabBarWrapper {...props}>
    <TabBarContent>{children}</TabBarContent>
  </TabBarWrapper>
);

export default TabBar;
