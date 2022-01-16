import { styled } from "@/stitches.config";

const Wrapper = styled("div", {
  borderColor: "$forest",
  borderWidth: 1,
  borderStyle: "solid",
  textAlign: "center",
});

const Upvote = () => {
  return (
    <Wrapper>
      <div>^</div>
      123
    </Wrapper>
  );
};
export default Upvote;
