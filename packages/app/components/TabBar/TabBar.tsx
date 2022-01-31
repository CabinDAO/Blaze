import { styled } from "@/stitches.config";
import { useWallet } from "@/components/WalletAuth";
import { Select } from "@cabindao/topo"
import { useState, useEffect } from "react";
import { useStore } from "@/store/store";

const TabBarWrapper = styled("div", {
  boxSizing: "border-box",
  marginBottom: "$2",
});
const TabBarContent = styled("div", {
  display: "flex",
  marginBottom: -1,
  alignItems: "flex-end",
});
const TabLink = styled("button", {
  boxSizing: "border-box",
  height: "$10",
  background: "none",
  paddingLeft: "$4",
  paddingRight: "$4",
  border: 0,
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
const TabBar = ({ children, ...props }: { children?: React.ReactNode }) => {
  const { updateSort } = useStore();
  const { address } = useWallet();
  const [activeTab, setActiveTab] = useState(0);
  return (
    <TabBarWrapper {...props}>
      <TabBarContent {...props}>
        {!address && (
          <TabButton
            active={activeTab == 0 ? true : false}
            onClick={() => setActiveTab(0)}
          >
            Links
          </TabButton>
        )}
        {address && (
          <>
            <TabButton
              active={activeTab == 0 ? true : false}
              onClick={() => setActiveTab(0)}
            >
              Links
            </TabButton>
            <TabButton
              active={activeTab == 1 ? true : false}
              onClick={() => setActiveTab(1)}
            >
              Submissions
            </TabButton>
            <TabButton
              active={activeTab == 2 ? true : false}
              onClick={() => setActiveTab(2)}
            >
              Upvotes
            </TabButton>
            {/* <TabButton
                active={activeTab == 3 ? true : false}
                onClick={() => setActiveTab(3)}
              >
                Comments
              </TabButton> */}
            <div
              style={{
                marginLeft: "auto",
              }}
            >
              <Select
                disabled={false}
                options={[
                  { key: "newest", label: "Newest" },
                  { key: "trending", label: "Trending" },
                  { key: "controversial", label: "Controversial" },
                ]}
                value={"newest"}
                onChange={(key: Sort) => updateSort(key)}
              />
            </div>
          </>
        )}
      </TabBarContent>
    </TabBarWrapper>
  );
};

const StickyTabBar = styled(TabBar, {
  backgroundColor: "$sand",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  variants: {
    position: {
      fixed: {
        position: "static",
      },
      sticky: {
        position: "sticky",
        top: 0,
        left: 0,
      },
    },
  },
});

export default StickyTabBar;
