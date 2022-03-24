import { styled } from "@/stitches.config";
import { useWallet } from "@/components/WalletAuth";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useStore } from "@/store/store";
import DropdownMenu from "@/components/DropdownMenu";
import { DoubleArrowUpIcon, SunIcon } from "@radix-ui/react-icons";
import { useQueryClient } from "react-query";

const TabBarWrapper = styled("div", {
  boxSizing: "border-box",
  marginBottom: "$2",
});
const TabBarContent = styled("div", {
  display: "flex",
  marginBottom: -1,
  alignItems: "flex-end",
});

export const TabLink = styled("button", {
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

export type Sort = "newest" | "trending";

const TabsContainer = ({
  className,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <TabBarWrapper className={className}>
      <TabBarContent>{children}</TabBarContent>
    </TabBarWrapper>
  );
};

const StickyContainer = styled(TabsContainer, {
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

export const StickyTabBar = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  const [scrolled, setScrolled] = useState(false);

  const handleScroll = () => {
    const offset = window.scrollY;
    setScrolled(offset > 200);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <StickyContainer
      className={className}
      position={scrolled ? "sticky" : "fixed"}
    >
      {children}
    </StickyContainer>
  );
};

const TabBar = ({ className }: { className?: string }) => {
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

  const queryClient = useQueryClient();

  const onChangeSort = useCallback(
    (sort: Sort) => {
      updateSort(sort);
      queryClient.invalidateQueries("posts");
    },
    [updateSort, queryClient]
  );

  return (
    <StickyTabBar className={className}>
      <MobileTabs>
        {leftNav.length === 1 ? (
          <TabLink active>{leftNav[0].label}</TabLink>
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
          <TabLink
            active={activeTab == 0 ? true : false}
            onClick={() => setActiveTab(0)}
          >
            Links
          </TabLink>
        )}
        {address && (
          <>
            <TabLink
              active={activeTab == 0 ? true : false}
              onClick={() => setActiveTab(0)}
            >
              Links
            </TabLink>
            <TabLink
              active={activeTab == 1 ? true : false}
              onClick={() => setActiveTab(1)}
            >
              Submissions
            </TabLink>
            <TabLink
              active={activeTab == 2 ? true : false}
              onClick={() => setActiveTab(2)}
            >
              Upvotes
            </TabLink>
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
            // {
            //   value: "controversial",
            //   label: (
            //     <>
            //       <TargetIcon /> Controversial
            //     </>
            //   ),
            // },
          ]}
          value={sort}
          onChange={onChangeSort}
        />
      </div>
    </StickyTabBar>
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

export default TabBar;
