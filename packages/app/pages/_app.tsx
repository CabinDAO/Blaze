import { Provider as WalletProvider, chain, defaultChains } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { styled, globalCss } from "@/stitches.config";
import type { AppProps } from "next/app";
import { Button } from "@cabindao/topo";
import WalletAddress from "@/components/WalletAddress";
import Link from "next/link";
import WalletAuth, { useWallet } from "@/components/WalletAuth";

const globalStyles = globalCss({
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "$sans",
    color: "$forest",
    backgroundColor: "$sand",
  },
  a: {
    color: "$forest",
    "&:hover": {
      opacity: 0.5,
    },
  },
});

const Wrapper = styled("div", {
  margin: "0 auto",
  padding: "$4",
  maxWidth: 740,
  width: "100%",
  marginBottom: "$12",
  boxSizing: "border-box",
});

const Header = styled("header", {
  display: "flex",
  flexDirection: "row",
  padding: "$2",
});

const DaoCampLogo = styled("h2", {
  margin: 0,
  padding: 0,
  fontSize: "1.5rem",
  color: "$forest",
});

const MainContainer = styled("div", {
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
});

const Footer = styled("footer", {
  marginTop: "auto",
  paddingTop: "$8",
  paddingBottom: "$40",
  backgroundColor: "$forest",
  color: "$sand",
  textAlign: "center",
  "& a": {
    color: "$sand",
  },
});

const FooterHeading = styled("p", {
  fontWeight: "$regular",
});
const FooterSubtitle = styled("p", {
  fontWeight: "$light",
});

const UserActions = styled("div", {
  marginLeft: "auto",
  paddingRight: "$12",
  display: "flex",
  flexDirection: "row",
  columnGap: "$4",
});

const Nav = styled("nav", {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  columnGap: "$4",
});

const alchemyId = process.env.ALCHEMY_API_KEY;
const chains = defaultChains;

const connectors = [new InjectedConnector({ chains: defaultChains })];

const ProfileLink = () => {
  const { address, ens } = useWallet();
  if (!address) return null;
  return (
    <Link href="/profile">
      <a>
        <WalletAddress address={address} ens={ens} />
      </a>
    </Link>
  );
};

const SubmitLinkAction = () => {
  const { isConnected } = useWallet();
  if (isConnected) {
    return (
      <Link href="/submission/new" passHref>
        <Button tone="wheat">Submit a Link</Button>
      </Link>
    );
  }
  return null;
};

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <WalletProvider autoConnect connectors={connectors}>
      <MainContainer>
        <Header>
          <Link href="/">
            <a>
              <DaoCampLogo>#dao-camp</DaoCampLogo>
            </a>
          </Link>
          <Nav>
            <Button type="link">Link</Button>
            <ProfileLink />
          </Nav>
          <UserActions>
            <SubmitLinkAction />
            <WalletAuth />
          </UserActions>
        </Header>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
        <Footer>
          {/* <Logo variant="logomark" color="sprout" /> */}
          <div>cabin logo</div>
          <FooterHeading>
            Made with care by <a href="https://www.creatorcabins.com/">Cabin</a>
          </FooterHeading>
          <FooterSubtitle>
            Special thanks to creators Xxxx, Xxxx, Xxxx, &amp; more.
          </FooterSubtitle>
        </Footer>
      </MainContainer>
    </WalletProvider>
  );
}

export default MyApp;
