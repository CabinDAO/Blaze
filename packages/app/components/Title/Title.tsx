import { styled } from "@/stitches.config";

const Title = styled("h2", {
  marginTop: "$12",
  marginBottom: "$5",
  "&:last-of-type": {
    marginTop: 0,
  },
});
export default Title;
