import { styled } from "@/stitches.config";
import { useMemo } from "react";
import { useStore } from "@/store/store";

const ArrowIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="20"
      height="18"
      viewBox="0 0 20 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.883095 16.8332L10 1.63833L19.1169 16.8332H0.883095Z"
        stroke="currentColor"
      />
    </svg>
  );
};
const UpvoteArrowIcon = styled(ArrowIcon, {
  variants: {
    upvoted: {
      true: {
        fill: "$sand",
        stroke: "$forest",
      },
    },
  },
});

const Wrapper = styled("div", {
  backgroundColor: "transparent",
  borderColor: "transparent",
  borderWidth: 1,
  borderStyle: "solid",
  padding: "$1",
  textAlign: "center",
  cursor: "pointer",
  display: "flex",
  flexDirection: "column",
  width: 32,
  boxSizing: "border-box",
  overflow: "hidden",
  gap: "$1",
  fontSize: "$xs",
  fontWeight: "$regular",
  defaultVariants: {
    type: "post",
  },
  variants: {
    type: {
      post: {
        borderColor: "$forest",
      },
      comment: {},
    },
    upvoted: {
      true: {
        backgroundColor: "$forest",
        color: "$sand",
        "&:hover": {
          [`& ${UpvoteArrowIcon}`]: {
            opacity: 0.5,
          },
        },
      },
    },
  },
  compoundVariants: [
    {
      upvoted: true,
      type: "post",
      css: {
        "&:hover": {
          backgroundColor: "$forest",
          color: "$sand",
        },
      },
    },
    {
      upvoted: false,
      type: "post",
      css: {
        "&:hover": {
          backgroundColor: "$forest",
          color: "$sand",
        },
        [`& ${UpvoteArrowIcon}`]: {
          fill: "$sand",
        },
      },
    },
    {
      upvoted: true,
      type: "comment",
      css: {
        backgroundColor: "transparent",
        borderColor: "transparent",
        color: "$forest",
        "&:hover": {},
        [`& ${UpvoteArrowIcon}`]: {
          fill: "$forest",
        },
      },
    },
    {
      upvoted: false,
      type: "comment",
      css: {
        // backgroundColor: "transparent",
        borderColor: "transparent",
        "&:hover": {
          [`& ${UpvoteArrowIcon}`]: {
            fill: "rgba(50, 72, 65, 0.1)",
          },
        },
      },
    },
  ],
});

export interface UpvoteProps {
  count?: number;
  upvoted?: boolean;
  type?: "post" | "comment";
  onClick?: () => void;
  disabled?: boolean;
}
const Upvote = ({
  count = 0,
  upvoted = false,
  type = "post",
  onClick,
  disabled = false,
}: UpvoteProps) => {
  const countDisplay = useMemo(
    () =>
      Intl.NumberFormat("en-US", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(count),
    [count]
  );

  return (
    <Wrapper
      upvoted={upvoted}
      type={type}
      onClick={disabled ? undefined : onClick}
    >
      <div>
        <UpvoteArrowIcon upvoted={upvoted} />
      </div>
      {countDisplay}
    </Wrapper>
  );
};
export default Upvote;
