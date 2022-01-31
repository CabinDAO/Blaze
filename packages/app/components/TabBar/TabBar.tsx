import { styled } from "@/stitches.config";
import { useWallet } from "@/components/WalletAuth";
import { Select } from "@cabindao/topo"
import { useState, useMemo } from "react";
import { useStore } from "@/store/store";
import DropdownMenu from "@/components/DropdownMenu";
import { DoubleArrowUpIcon, SunIcon, TargetIcon } from "@radix-ui/react-icons";
import AppState, { Sort } from "@/types";

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
  const { sort, updateSort } = useStore();
  const { address } = useWallet({ fetchEns: true });
  const [activeTab, setActiveTab] = useState(0);
    const leftNav = useMemo(() => {
      if (address) {
        return [
          { label: "Links", value: "links" },
          { label: "Submissions", value: "submissions" },
          { label: "Upvotes", value: "upvotes" },
        ];
      }
      return [
        {
          label: "Links",
          value: "links",
        },
      ];
    }, [address]);
  return (
    <TabBarWrapper {...props}>
      <TabBarContent {...props}>
        <MobileTabs>
          {leftNav.length === 1 ? (
            <TabButton active>{leftNav[0].label}</TabButton>
          ) : (
            <DropdownMenu
              active
              options={leftNav}
              value={leftNav[activeTab]?.value}
              onChange={(val) =>
                setActiveTab(leftNav.findIndex((opt) => opt.value === val))
              }
            />
          )}
        </MobileTabs>
        <DesktopTabs>
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
            </>
          )}
        </DesktopTabs>
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
          }}
        >
          <DropdownMenu
            options={[
              {
                value: "newest",
                label: (
                  <>
                    <SunIcon /> Newest
                  </>
                ),
              },
              {
                value: "trending",
                label: (
                  <>
                    <DoubleArrowUpIcon /> Trending
                  </>
                ),
              },
              {
                value: "controversial",
                label: (
                  <>
                    <TargetIcon /> Controversial
                  </>
                ),
              },
            ]}
            value={sort}
            onChange={(key: Sort) => updateSort(key)}
          />
        </div>
      </TabBarContent>
    </TabBarWrapper>
  );
};

const MobileTabs = styled("div", {
  display: "block",
  "@sm": {
    display: "none",
  },
});
const DesktopTabs = styled("div", {
  display: "none",
  "@sm": {
    display: "block",
  },
});

const StickyTabBar = styled(TabBar, {
  backgroundColor: "$sand",
  borderBottomWidth: 1,
  borderBottomStyle: "solid",
  borderColor: "$forest",
  "& > *": {
    marginBottom: -1,
  },
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
